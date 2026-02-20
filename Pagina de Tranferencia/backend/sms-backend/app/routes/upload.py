import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__)

EXTENSOES_PERMITIDAS = {"pdf", "jpg", "jpeg", "png", "docx"}


def _extensao_permitida(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in EXTENSOES_PERMITIDAS


@upload_bp.route("/curriculo", methods=["POST"])
@jwt_required()
def upload_curriculo():
    if "curriculo" not in request.files:
        return jsonify({"message": "Arquivo 'curriculo' não encontrado no form-data."}), 400

    arquivo = request.files["curriculo"]
    if arquivo.filename == "":
        return jsonify({"message": "Nenhum arquivo selecionado."}), 400

    if not _extensao_permitida(arquivo.filename):
        return jsonify({"message": "Tipo de arquivo não permitido. Use PDF, JPG, PNG ou DOCX."}), 400

    ext = arquivo.filename.rsplit(".", 1)[1].lower()
    nome_unico = f"{uuid.uuid4().hex}.{ext}"
    caminho = os.path.join(current_app.config["UPLOAD_FOLDER"], nome_unico)
    arquivo.save(caminho)

    # Em produção, este URL apontaria para um bucket de storage.
    # Localmente, retorna um path de referência.
    url = f"http://localhost:5000/uploads/{nome_unico}"
    return jsonify({"url": url}), 200
