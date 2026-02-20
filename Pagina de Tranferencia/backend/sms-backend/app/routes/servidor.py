from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from ..extensions import db
from ..models import Usuario, Solicitacao
from datetime import datetime

servidor_bp = Blueprint("servidor", __name__)


@servidor_bp.route("/perfil", methods=["GET"])
@jwt_required()
def get_perfil():
    usuario_id = int(get_jwt_identity())
    usuario = Usuario.query.get_or_404(usuario_id)
    return jsonify(usuario.to_perfil_dict()), 200


@servidor_bp.route("/perfil", methods=["PATCH"])
@jwt_required()
def update_perfil():
    usuario_id = int(get_jwt_identity())
    usuario = Usuario.query.get_or_404(usuario_id)
    data = request.get_json(force=True)

    for campo in ["nome", "email", "telefone", "cargo", "vinculo", "unidade", "admissao"]:
        if campo in data:
            setattr(usuario, campo, data[campo])

    if data.get("novaSenha"):
        usuario.senha_hash = generate_password_hash(data["novaSenha"])

    db.session.commit()
    return jsonify({"message": "Perfil atualizado com sucesso."}), 200


@servidor_bp.route("/solicitacao", methods=["GET"])
@jwt_required()
def get_solicitacao():
    """Retorna a solicitação ATIVA mais recente (fora do histórico)."""
    usuario_id = int(get_jwt_identity())
    sol = (
        Solicitacao.query
        .filter_by(usuario_id=usuario_id, no_historico=False)
        .order_by(Solicitacao.data_criacao.desc())
        .first()
    )
    if not sol:
        return jsonify({"message": "Nenhuma solicitação ativa."}), 404
    return jsonify(sol.to_dict()), 200


@servidor_bp.route("/historico", methods=["GET"])
@jwt_required()
def get_historico():
    """Retorna todos os pedidos no histórico (contemplados/arquivados) do servidor logado."""
    usuario_id = int(get_jwt_identity())
    historico = (
        Solicitacao.query
        .filter_by(usuario_id=usuario_id)
        .order_by(Solicitacao.data_criacao.desc())
        .all()
    )
    return jsonify([s.to_dict() for s in historico]), 200