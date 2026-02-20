"""
seed.py – Popula o banco SQLite com dados de teste.
Execute: python seed.py
"""
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models import Usuario, Solicitacao

app = create_app()

CARGOS = [
    "ENFERMEIRO", "MÉDICO", "TÉCNICO DE ENFERMAGEM", "AGENTE COMUNITARIO DE SAUDE",
    "CIRURGIÃO DENTISTA", "PSICÓLOGO", "ASSISTENTE SOCIAL", "ANALISTA DE TI",
]

UNIDADES = [
    "UBS CENTRAL", "UBS ANCHIETA", "UBS SOLO SAGRADO", "UBS ESTORIL",
    "CAPS II LESTE", "HOSPITAL DE BASE", "DEPARTAMENTO DE TECNOLOGIA E INFORMAÇÃO",
    "UNIDADE DE PRONTO ATENDIMENTO (UPA) NORTE",
]

VINCULOS = ["Prefeitura", "Estado", "Federal"]

STATUSES = ["Em Análise", "Deferido", "Indeferido"]

USUARIOS_TESTE = [
    {
        "nome": "Admin Sistema",
        "matricula": "000.000-0",
        "email": "admin@riopreto.sp.gov.br",
        "senha": "admin123",
        "papel": "admin",
        "cargo": "ANALISTA DE TI",
        "vinculo": "Prefeitura",
        "unidade": "DEPARTAMENTO DE TECNOLOGIA E INFORMAÇÃO",
        "admissao": "2015-01-10",
        "telefone": "(17) 3999-0000",
    },
    {
        "nome": "Gabriel Riguetto",
        "matricula": "123.456-7",
        "email": "gabriel@riopreto.sp.gov.br",
        "senha": "gabriel123",
        "papel": "servidor",
        "cargo": "ANALISTA DE TI",
        "vinculo": "Prefeitura",
        "unidade": "DEPARTAMENTO DE TECNOLOGIA E INFORMAÇÃO",
        "admissao": "2021-01-10",
        "telefone": "(17) 99999-0000",
    },
    {
        "nome": "Maria Fernanda Costa",
        "matricula": "234.567-8",
        "email": "maria.fernanda@riopreto.sp.gov.br",
        "senha": "maria123",
        "papel": "servidor",
        "cargo": "ENFERMEIRO",
        "vinculo": "Prefeitura",
        "unidade": "UBS ANCHIETA",
        "admissao": "2019-03-20",
        "telefone": "(17) 99111-2233",
    },
    {
        "nome": "João Paulo Mendes",
        "matricula": "345.678-9",
        "email": "joao.mendes@riopreto.sp.gov.br",
        "senha": "joao123",
        "papel": "servidor",
        "cargo": "MÉDICO",
        "vinculo": "Estado",
        "unidade": "HOSPITAL DE BASE",
        "admissao": "2017-06-15",
        "telefone": "(17) 98877-6655",
    },
    {
        "nome": "Ana Beatriz Lima",
        "matricula": "456.789-0",
        "email": "ana.lima@riopreto.sp.gov.br",
        "senha": "ana123",
        "papel": "servidor",
        "cargo": "PSICÓLOGO",
        "vinculo": "Prefeitura",
        "unidade": "CAPS II LESTE",
        "admissao": "2022-08-01",
        "telefone": "(17) 97766-5544",
    },
    {
        "nome": "Carlos Eduardo Santos",
        "matricula": "567.890-1",
        "email": "carlos.santos@riopreto.sp.gov.br",
        "senha": "carlos123",
        "papel": "servidor",
        "cargo": "TÉCNICO DE ENFERMAGEM",
        "vinculo": "Prefeitura",
        "unidade": "UBS ESTORIL",
        "admissao": "2020-11-05",
        "telefone": "(17) 96655-4433",
    },
    {
        "nome": "Fernanda Oliveira",
        "matricula": "678.901-2",
        "email": "fernanda.oliveira@riopreto.sp.gov.br",
        "senha": "fernanda123",
        "papel": "servidor",
        "cargo": "ASSISTENTE SOCIAL",
        "vinculo": "Federal",
        "unidade": "UNIDADE DE PRONTO ATENDIMENTO (UPA) NORTE",
        "admissao": "2018-04-12",
        "telefone": "(17) 95544-3322",
    },
]

SOLICITACOES_TESTE = [
    {
        "usuario_email": "gabriel@riopreto.sp.gov.br",
        "opcao1": "UBS SOLO SAGRADO",
        "opcao2": "UBS CENTRAL",
        "status": "Em Análise",
        "dias_atras": 1,
    },
    {
        "usuario_email": "maria.fernanda@riopreto.sp.gov.br",
        "opcao1": "UBS CENTRAL",
        "opcao2": "UBS ESTORIL",
        "opcao3": "UBS SOLO SAGRADO",
        "status": "Deferido",
        "justificativa": "Solicitação atende todos os requisitos da Portaria 02/2022.",
        "dias_atras": 15,
    },
    {
        "usuario_email": "joao.mendes@riopreto.sp.gov.br",
        "opcao1": "UBS CENTRAL",
        "status": "Indeferido",
        "justificativa": "Não há vagas disponíveis na unidade solicitada no momento.",
        "dias_atras": 30,
    },
    {
        "usuario_email": "ana.lima@riopreto.sp.gov.br",
        "opcao1": "CAPS I NORTE",
        "opcao2": "CAPS AD",
        "status": "Em Análise",
        "dias_atras": 5,
    },
    {
        "usuario_email": "carlos.santos@riopreto.sp.gov.br",
        "opcao1": "UBS ANCHIETA",
        "opcao2": "UBS BOA VISTA",
        "status": "Em Análise",
        "dias_atras": 10,
    },
    {
        "usuario_email": "fernanda.oliveira@riopreto.sp.gov.br",
        "opcao1": "CAPS II OESTE",
        "opcao2": "CAPS INFANTIL",
        "status": "Deferido",
        "justificativa": "Transferência aprovada conforme necessidade do serviço.",
        "dias_atras": 45,
    },
]


def seed():
    with app.app_context():
        print("⏳  Recriando tabelas…")
        db.drop_all()
        db.create_all()

        print("👤  Criando usuários de teste…")
        usuarios_map = {}
        for u_data in USUARIOS_TESTE:
            u = Usuario(
                nome=u_data["nome"],
                matricula=u_data["matricula"],
                email=u_data["email"],
                senha_hash=generate_password_hash(u_data["senha"]),
                papel=u_data["papel"],
                cargo=u_data.get("cargo"),
                vinculo=u_data.get("vinculo"),
                unidade=u_data.get("unidade"),
                admissao=u_data.get("admissao"),
                telefone=u_data.get("telefone"),
            )
            db.session.add(u)
            usuarios_map[u_data["email"]] = u

        db.session.flush()

        print("📋  Criando solicitações de teste…")
        for idx, s_data in enumerate(SOLICITACOES_TESTE, start=1):
            usuario = usuarios_map[s_data["usuario_email"]]
            data_criacao = datetime.utcnow() - timedelta(days=s_data.get("dias_atras", 0))
            protocolo = f"#{data_criacao.year}-{str(idx).zfill(3)}"

            sol = Solicitacao(
                protocolo=protocolo,
                usuario_id=usuario.id,
                nome=usuario.nome,
                matricula=usuario.matricula,
                vinculo=usuario.vinculo,
                cargo=usuario.cargo,
                admissao=usuario.admissao,
                email=usuario.email,
                telefone=usuario.telefone,
                unidade_atual=usuario.unidade,
                opcao1=s_data.get("opcao1"),
                opcao2=s_data.get("opcao2"),
                opcao3=s_data.get("opcao3"),
                opcao4=s_data.get("opcao4"),
                opcao5=s_data.get("opcao5"),
                status=s_data.get("status", "Em Análise"),
                justificativa=s_data.get("justificativa"),
                data_criacao=data_criacao,
                data_edicao=datetime.utcnow() if s_data.get("status") != "Em Análise" else None,
            )
            db.session.add(sol)

        db.session.commit()
        print("\n✅  Seed concluído!")
        print("\n── Credenciais de acesso ────────────────────────────")
        for u_data in USUARIOS_TESTE:
            papel = "🔴 ADMIN  " if u_data["papel"] == "admin" else "🟢 SERVIDOR"
            print(f"  {papel}  {u_data['matricula']:15}  {u_data['email']:45}  senha: {u_data['senha']}")
        print("─────────────────────────────────────────────────────\n")


if __name__ == "__main__":
    seed()
