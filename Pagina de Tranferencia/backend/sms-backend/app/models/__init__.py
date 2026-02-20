from ..extensions import db
from datetime import datetime


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id         = db.Column(db.Integer, primary_key=True)
    nome       = db.Column(db.String(200), nullable=False)
    matricula  = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email      = db.Column(db.String(200), unique=True, nullable=False, index=True)
    telefone   = db.Column(db.String(30))
    cargo      = db.Column(db.String(100))
    vinculo    = db.Column(db.String(100))
    admissao   = db.Column(db.String(20))
    unidade    = db.Column(db.String(200))
    senha_hash = db.Column(db.String(256), nullable=False)
    papel      = db.Column(db.String(20), nullable=False, default="servidor")
    criado_em  = db.Column(db.DateTime, default=datetime.utcnow)

    refresh_tokens = db.relationship("RefreshTokenBlacklist", back_populates="usuario")
    solicitacoes   = db.relationship("Solicitacao", back_populates="usuario",
                                     order_by="Solicitacao.data_criacao.desc()")

    def to_perfil_dict(self):
        return {
            "nome":      self.nome,
            "matricula": self.matricula,
            "email":     self.email,
            "telefone":  self.telefone,
            "cargo":     self.cargo,
            "vinculo":   self.vinculo,
            "unidade":   self.unidade,
            "admissao":  self.admissao,
        }


class RefreshTokenBlacklist(db.Model):
    __tablename__ = "refresh_token_blacklist"

    id         = db.Column(db.Integer, primary_key=True)
    jti        = db.Column(db.String(256), unique=True, nullable=False, index=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"))
    criado_em  = db.Column(db.DateTime, default=datetime.utcnow)

    usuario = db.relationship("Usuario", back_populates="refresh_tokens")


class Solicitacao(db.Model):
    __tablename__ = "solicitacoes"

    __table_args__ = (
        db.Index("ix_sol_usuario_criacao", "usuario_id", "data_criacao"),
        db.Index("ix_sol_status_criacao",  "status",     "data_criacao"),
    )

    id            = db.Column(db.Integer, primary_key=True)
    protocolo     = db.Column(db.String(30), unique=True, index=True)
    usuario_id    = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False, index=True)
    nome          = db.Column(db.String(200))
    matricula     = db.Column(db.String(50), index=True)
    vinculo       = db.Column(db.String(100))
    cargo         = db.Column(db.String(100))
    admissao      = db.Column(db.String(20))
    email         = db.Column(db.String(200))
    telefone      = db.Column(db.String(30))
    unidade_atual = db.Column(db.String(200))
    opcao1        = db.Column(db.String(200))
    opcao2        = db.Column(db.String(200))
    opcao3        = db.Column(db.String(200))
    opcao4        = db.Column(db.String(200))
    opcao5        = db.Column(db.String(200))
    curriculo_url = db.Column(db.String(500))

    # Status: Em Análise | Deferido | Indeferido | Contemplado
    status        = db.Column(db.String(30), default="Em Análise", index=True)
    justificativa = db.Column(db.Text)

    # Data prevista de contemplação (admin preenche ao deferir)
    data_contemplacao = db.Column(db.DateTime, nullable=True)
    # Unidade efetivamente deferida
    unidade_deferida  = db.Column(db.String(200), nullable=True)

    # True = pedido contemplado/arquivado no histórico
    no_historico = db.Column(db.Boolean, default=False, index=True)

    data_criacao = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    data_edicao  = db.Column(db.DateTime)

    usuario = db.relationship("Usuario", back_populates="solicitacoes")

    def to_dict(self, admin=False):
        base = {
            "id":                self.id,
            "protocolo":         self.protocolo,
            "status":            self.status,
            "opcao1":            self.opcao1,
            "opcao2":            self.opcao2,
            "opcao3":            self.opcao3,
            "opcao4":            self.opcao4,
            "opcao5":            self.opcao5,
            "justificativa":     self.justificativa,
            "unidade_deferida":  self.unidade_deferida,
            "data_contemplacao": self.data_contemplacao.isoformat() + "Z" if self.data_contemplacao else None,
            "no_historico":      self.no_historico,
            "data_criacao":      self.data_criacao.isoformat() + "Z" if self.data_criacao else None,
            "data_edicao":       self.data_edicao.isoformat()  + "Z" if self.data_edicao  else None,
        }
        if admin:
            base.update({
                "nome":          self.nome,
                "email":         self.email,
                "matricula":     self.matricula,
                "vinculo":       self.vinculo,
                "cargo":         self.cargo,
                "unidade":       self.unidade_atual,
                "curriculo_url": self.curriculo_url,
            })
        return base