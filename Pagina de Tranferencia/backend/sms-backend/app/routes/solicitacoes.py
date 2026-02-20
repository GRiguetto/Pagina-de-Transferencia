from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from ..extensions import db
from ..models import Solicitacao, Usuario

solicitacoes_bp = Blueprint("solicitacoes", __name__)

STATUSES_VALIDOS = {"Em Análise", "Deferido", "Indeferido", "Contemplado"}


def _require_admin():
    claims = get_jwt()
    if claims.get("papel") != "admin":
        return jsonify({"message": "Acesso negado. Rota exclusiva para administradores."}), 403
    return None


def _gerar_protocolo():
    ano = datetime.utcnow().year
    total = Solicitacao.query.count() + 1
    return f"#{ano}-{str(total).zfill(4)}"


def _verificar_contemplados():
    """Verifica pedidos deferidos com data_contemplacao passada e os arquiva."""
    agora = datetime.utcnow()
    vencidos = Solicitacao.query.filter(
        Solicitacao.status == "Deferido",
        Solicitacao.no_historico == False,
        Solicitacao.data_contemplacao != None,
        Solicitacao.data_contemplacao <= agora,
    ).all()
    for sol in vencidos:
        sol.status = "Contemplado"
        sol.no_historico = True
    if vencidos:
        db.session.commit()


# ── GET /solicitacoes  (admin) ────────────────────────────────────────────────
@solicitacoes_bp.route("", methods=["GET"])
@jwt_required()
def listar_solicitacoes():
    err = _require_admin()
    if err:
        return err

    # Verificar contemplados automaticamente a cada listagem
    _verificar_contemplados()

    # Paginação para escalar com milhares de registros
    page      = request.args.get("page", 1, type=int)
    per_page  = request.args.get("per_page", 0, type=int)  # 0 = sem limite (retro-compat)
    historico = request.args.get("historico", "false").lower() == "true"

    q = Solicitacao.query

    # Filtro histórico vs ativo
    if historico:
        q = q.filter(Solicitacao.no_historico == True)
    else:
        q = q.filter(Solicitacao.no_historico == False)

    # Filtros
    if status := request.args.get("status"):
        q = q.filter(Solicitacao.status == status)
    if vinculo := request.args.get("vinculo"):
        q = q.filter(Solicitacao.vinculo.ilike(f"%{vinculo}%"))
    if cargo := request.args.get("cargo"):
        q = q.filter(Solicitacao.cargo.ilike(f"%{cargo}%"))
    if unidade := request.args.get("unidade"):
        q = q.filter(Solicitacao.unidade_atual.ilike(f"%{unidade}%"))
    if interesse := request.args.get("interesse"):
        q = q.filter(
            (Solicitacao.opcao1.ilike(f"%{interesse}%")) |
            (Solicitacao.opcao2.ilike(f"%{interesse}%")) |
            (Solicitacao.opcao3.ilike(f"%{interesse}%")) |
            (Solicitacao.opcao4.ilike(f"%{interesse}%")) |
            (Solicitacao.opcao5.ilike(f"%{interesse}%"))
        )
    if busca := request.args.get("busca"):
        like = f"%{busca}%"
        q = q.filter(
            (Solicitacao.nome.ilike(like)) |
            (Solicitacao.matricula.ilike(like)) |
            (Solicitacao.email.ilike(like)) |
            (Solicitacao.cargo.ilike(like)) |
            (Solicitacao.unidade_atual.ilike(like)) |
            (Solicitacao.opcao1.ilike(like)) |
            (Solicitacao.opcao2.ilike(like)) |
            (Solicitacao.opcao3.ilike(like))
        )
    if data_inicio := request.args.get("dataInicio"):
        try:
            q = q.filter(Solicitacao.data_criacao >= datetime.fromisoformat(data_inicio))
        except ValueError:
            pass
    if data_fim := request.args.get("dataFim"):
        try:
            q = q.filter(Solicitacao.data_criacao <= datetime.fromisoformat(data_fim))
        except ValueError:
            pass

    # Ordenação
    ordem = request.args.get("ordem", "recente")
    if ordem == "recente":
        q = q.order_by(Solicitacao.data_criacao.desc())
    elif ordem == "antigo":
        q = q.order_by(Solicitacao.data_criacao.asc())
    elif ordem == "nomeAZ":
        q = q.order_by(Solicitacao.nome.asc())
    elif ordem == "nomeZA":
        q = q.order_by(Solicitacao.nome.desc())
    elif ordem == "matricula":
        q = q.order_by(Solicitacao.matricula.asc())
    elif ordem == "contemplacao":
        q = q.order_by(Solicitacao.data_contemplacao.asc().nullslast())

    if per_page > 0:
        paginado = q.paginate(page=page, per_page=per_page, error_out=False)
        return jsonify({
            "items":   [s.to_dict(admin=True) for s in paginado.items],
            "total":   paginado.total,
            "pages":   paginado.pages,
            "page":    page,
            "per_page":per_page,
        }), 200

    return jsonify([s.to_dict(admin=True) for s in q.all()]), 200


# ── GET /solicitacoes/historico-usuario/:usuario_id  (admin) ─────────────────
@solicitacoes_bp.route("/historico-usuario/<int:uid>", methods=["GET"])
@jwt_required()
def historico_usuario(uid):
    err = _require_admin()
    if err:
        return err

    solic = (
        Solicitacao.query
        .filter_by(usuario_id=uid)
        .order_by(Solicitacao.data_criacao.desc())
        .all()
    )
    return jsonify([s.to_dict(admin=True) for s in solic]), 200


# ── POST /solicitacoes ────────────────────────────────────────────────────────
@solicitacoes_bp.route("", methods=["POST"])
@jwt_required()
def criar_solicitacao():
    usuario_id = int(get_jwt_identity())
    data = request.get_json(force=True)

    # Regra 6 meses — ignora pedidos indeferidos e pedidos no histórico
    seis_meses_atras = datetime.utcnow() - timedelta(days=180)
    sol_recente = (
        Solicitacao.query
        .filter(
            Solicitacao.usuario_id == usuario_id,
            Solicitacao.data_criacao >= seis_meses_atras,
            Solicitacao.status.notin_(["Indeferido", "Contemplado"]),
            Solicitacao.no_historico == False,
        )
        .first()
    )
    if sol_recente:
        return jsonify({"message": "Servidor já possui solicitação ativa no período de 6 meses."}), 409

    sol = Solicitacao(
        usuario_id=usuario_id,
        nome=data.get("nome"),
        matricula=data.get("matricula"),
        vinculo=data.get("vinculo"),
        cargo=data.get("cargo"),
        admissao=data.get("admissao"),
        email=data.get("email"),
        telefone=data.get("telefone"),
        unidade_atual=data.get("unidade_atual"),
        opcao1=data.get("opcao1"),
        opcao2=data.get("opcao2"),
        opcao3=data.get("opcao3"),
        opcao4=data.get("opcao4"),
        opcao5=data.get("opcao5"),
        curriculo_url=data.get("curriculo_url"),
        status="Em Análise",
    )
    db.session.add(sol)
    db.session.flush()
    sol.protocolo = _gerar_protocolo()
    db.session.commit()

    return jsonify({
        "id":           sol.id,
        "protocolo":    sol.protocolo,
        "status":       sol.status,
        "data_criacao": sol.data_criacao.isoformat() + "Z",
    }), 201


# ── PATCH /solicitacoes/:id  (servidor edita opções do próprio pedido) ────────
@solicitacoes_bp.route("/<int:sol_id>", methods=["PATCH"])
@jwt_required()
def editar_solicitacao(sol_id):
    usuario_id = int(get_jwt_identity())
    sol = Solicitacao.query.get_or_404(sol_id)

    if sol.usuario_id != usuario_id:
        return jsonify({"message": "Acesso negado."}), 403
    if sol.status != "Em Análise":
        return jsonify({"message": "Pedido já analisado não pode ser editado."}), 409

    data = request.get_json(force=True)
    for campo in ["opcao1","opcao2","opcao3","opcao4","opcao5","curriculo_url"]:
        if campo in data:
            setattr(sol, campo, data[campo] or None)

    sol.data_edicao = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "id":          sol.id,
        "protocolo":   sol.protocolo,
        "status":      sol.status,
        "opcao1":      sol.opcao1,
        "opcao2":      sol.opcao2,
        "opcao3":      sol.opcao3,
        "opcao4":      sol.opcao4,
        "opcao5":      sol.opcao5,
        "data_edicao": sol.data_edicao.isoformat() + "Z",
    }), 200


# ── PATCH /solicitacoes/:id/status  (admin) ───────────────────────────────────
@solicitacoes_bp.route("/<int:sol_id>/status", methods=["PATCH"])
@jwt_required()
def atualizar_status(sol_id):
    err = _require_admin()
    if err:
        return err

    sol  = Solicitacao.query.get_or_404(sol_id)
    data = request.get_json(force=True)

    novo_status = data.get("status")
    if novo_status not in STATUSES_VALIDOS:
        return jsonify({"message": f"Status inválido."}), 400

    sol.status        = novo_status
    sol.justificativa = data.get("justificativa") or sol.justificativa
    sol.data_edicao   = datetime.utcnow()

    # Se deferido, admin pode informar data de contemplação e unidade deferida
    if novo_status == "Deferido":
        if dc := data.get("data_contemplacao"):
            try:
                sol.data_contemplacao = datetime.fromisoformat(dc.replace("Z",""))
            except ValueError:
                pass
        if ud := data.get("unidade_deferida"):
            sol.unidade_deferida = ud

    # Se indeferido, remove campos de deferimento
    if novo_status == "Indeferido":
        sol.data_contemplacao = None
        sol.unidade_deferida  = None
        sol.no_historico      = False

    db.session.commit()

    return jsonify({
        "id":                sol.id,
        "status":            sol.status,
        "data_edicao":       sol.data_edicao.isoformat() + "Z",
        "data_contemplacao": sol.data_contemplacao.isoformat() + "Z" if sol.data_contemplacao else None,
        "unidade_deferida":  sol.unidade_deferida,
    }), 200


# ── DELETE /solicitacoes/:id  (admin) ─────────────────────────────────────────
@solicitacoes_bp.route("/<int:sol_id>", methods=["DELETE"])
@jwt_required()
def deletar_solicitacao(sol_id):
    err = _require_admin()
    if err:
        return err

    sol = Solicitacao.query.get_or_404(sol_id)
    db.session.delete(sol)
    db.session.commit()
    return "", 204