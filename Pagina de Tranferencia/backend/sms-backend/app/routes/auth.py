from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db
from ..models import Usuario, RefreshTokenBlacklist

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    login_val = data.get("login", "").strip()
    senha = data.get("senha", "")

    usuario = Usuario.query.filter(
        (Usuario.matricula == login_val) | (Usuario.email == login_val)
    ).first()

    if not usuario or not check_password_hash(usuario.senha_hash, senha):
        return jsonify({"message": "Credenciais inválidas."}), 401

    identity = str(usuario.id)
    access_token = create_access_token(
        identity=identity,
        additional_claims={"papel": usuario.papel}
    )
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "papel": usuario.papel,
        }
    }), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(force=True)

    required = ["nome", "matricula", "email", "senha"]
    for field in required:
        if not data.get(field):
            return jsonify({"message": f"Campo obrigatório ausente: {field}"}), 400

    existe = Usuario.query.filter(
        (Usuario.matricula == data["matricula"]) | (Usuario.email == data["email"])
    ).first()
    if existe:
        return jsonify({"message": "Matrícula ou e-mail já cadastrado."}), 409

    usuario = Usuario(
        nome=data["nome"],
        matricula=data["matricula"],
        email=data["email"],
        telefone=data.get("telefone"),
        cargo=data.get("cargo"),
        vinculo=data.get("vinculo"),
        admissao=data.get("admissao"),
        unidade=data.get("unidade"),
        senha_hash=generate_password_hash(data["senha"]),
        papel="servidor",
    )
    db.session.add(usuario)
    db.session.commit()
    return jsonify({"message": "Cadastro realizado com sucesso."}), 201


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    jti = get_jwt()["jti"]
    na_blacklist = RefreshTokenBlacklist.query.filter_by(jti=jti).first()
    if na_blacklist:
        return jsonify({"message": "Token inválido."}), 401

    identity = get_jwt_identity()
    usuario = Usuario.query.get(int(identity))
    if not usuario:
        return jsonify({"message": "Usuário não encontrado."}), 401

    access_token = create_access_token(
        identity=identity,
        additional_claims={"papel": usuario.papel}
    )
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt().get("jti")
    usuario_id = int(get_jwt_identity())
    if jti:
        entrada = RefreshTokenBlacklist(jti=jti, usuario_id=usuario_id)
        db.session.add(entrada)
        db.session.commit()
    return "", 204
