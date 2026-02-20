from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt
from .routes.auth import auth_bp
from .routes.servidor import servidor_bp
from .routes.solicitacoes import solicitacoes_bp
from .routes.upload import upload_bp
from .routes.tabelas import tabelas_bp
import os


def create_app():
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-mude-em-producao")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///sms.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret-mude-em-producao")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600        # 1 hora
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 86400 * 7  # 7 dias

    # Upload
    app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER", "uploads")
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # ── Extensions ────────────────────────────────────────────────────────────
    CORS(app, resources={r"/*": {"origins": "*"}},
         expose_headers=["Authorization"],
         allow_headers=["Content-Type", "Authorization"])
    db.init_app(app)
    jwt.init_app(app)

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(servidor_bp, url_prefix="/servidor")
    app.register_blueprint(solicitacoes_bp, url_prefix="/solicitacoes")
    app.register_blueprint(upload_bp, url_prefix="/upload")
    app.register_blueprint(tabelas_bp, url_prefix="/tabelas")

    with app.app_context():
        db.create_all()

    return app
