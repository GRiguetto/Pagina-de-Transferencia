# SMS Rio Preto – Back-end Flask

Back-end do Portal de Transferências da Secretaria Municipal de Saúde de São José do Rio Preto.

---

## Estrutura de Pastas

```
sms-backend/
├── app/
│   ├── __init__.py          # Application factory (create_app)
│   ├── extensions.py        # db e jwt compartilhados
│   ├── models/
│   │   └── __init__.py      # Usuario, Solicitacao, RefreshTokenBlacklist
│   └── routes/
│       ├── __init__.py
│       ├── auth.py          # POST /auth/login, /register, /refresh, /logout
│       ├── servidor.py      # GET/PATCH /servidor/perfil, GET /servidor/solicitacao
│       ├── solicitacoes.py  # GET/POST /solicitacoes, PATCH /:id/status, DELETE /:id
│       ├── upload.py        # POST /upload/curriculo
│       └── tabelas.py       # GET /tabelas/cargos, /tabelas/unidades
├── uploads/                 # Currículos salvos localmente
├── run.py                   # Ponto de entrada
├── seed.py                  # Popula banco com dados de teste
├── requirements.txt
└── .env.example
```

---

## Instalação

### 1. Clone e entre na pasta
```bash
git clone https://github.com/GRiguetto/Pagina-de-Transferencia.git
cd Pagina-de-Transferencia
# Coloque a pasta sms-backend dentro do repositório ou onde preferir
cd sms-backend
```

### 2. Crie um ambiente virtual
```bash
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Instale as dependências
```bash
pip install -r requirements.txt
```

### 4. Copie o .env
```bash
cp .env.example .env
# Edite SECRET_KEY e JWT_SECRET_KEY com valores fortes em produção
```

### 5. Popule o banco com dados de teste
```bash
python seed.py
```

### 6. Suba o servidor
```bash
python run.py
# Disponível em http://localhost:5000
```

---

## Credenciais de Teste

| Papel    | Matrícula   | E-mail                              | Senha       |
|----------|-------------|-------------------------------------|-------------|
| Admin    | 000.000-0   | admin@riopreto.sp.gov.br            | admin123    |
| Servidor | 123.456-7   | gabriel@riopreto.sp.gov.br          | gabriel123  |
| Servidor | 234.567-8   | maria.fernanda@riopreto.sp.gov.br   | maria123    |
| Servidor | 345.678-9   | joao.mendes@riopreto.sp.gov.br      | joao123     |
| Servidor | 456.789-0   | ana.lima@riopreto.sp.gov.br         | ana123      |
| Servidor | 567.890-1   | carlos.santos@riopreto.sp.gov.br    | carlos123   |
| Servidor | 678.901-2   | fernanda.oliveira@riopreto.sp.gov.br| fernanda123 |

---

## Endpoints – Resumo

| Método | Rota                          | Acesso     | Descrição                          |
|--------|-------------------------------|------------|-------------------------------------|
| POST   | /auth/login                   | Público    | Login (retorna JWT)                 |
| POST   | /auth/register                | Público    | Cadastro de servidor                |
| POST   | /auth/refresh                 | Refresh JWT| Renova access token                 |
| POST   | /auth/logout                  | JWT        | Invalida token                      |
| GET    | /servidor/perfil              | JWT        | Dados do servidor logado            |
| PATCH  | /servidor/perfil              | JWT        | Atualiza perfil/senha               |
| GET    | /servidor/solicitacao         | JWT        | Solicitação mais recente            |
| GET    | /solicitacoes                 | Admin      | Lista com filtros e ordenação       |
| POST   | /solicitacoes                 | JWT        | Cria nova solicitação               |
| PATCH  | /solicitacoes/:id/status      | Admin      | Atualiza status                     |
| DELETE | /solicitacoes/:id             | Admin      | Remove solicitação                  |
| POST   | /upload/curriculo             | JWT        | Upload de arquivo (multipart)       |
| GET    | /tabelas/cargos               | Público    | Lista de cargos                     |
| GET    | /tabelas/unidades             | Público    | Lista de unidades                   |

---

## Conectando com o Front-end

Abra `js/api.config.js` no seu front-end e defina:

```javascript
BASE_URL: 'http://localhost:5000/v1',
```

> **Atenção:** as rotas do back-end **não** têm o prefixo `/v1`.  
> Se o front-end já usa `/v1`, adicione o prefixo no Flask criando um Blueprint raiz ou configurando `url_prefix="/v1"` no `create_app`.  
> Para desenvolvimento local sem `/v1`, use `BASE_URL: 'http://localhost:5000'`.

---

## Adicionando prefixo /v1 (opcional)

Se quiser manter o contrato exato do guia (`/v1/auth/login` etc.), edite `app/__init__.py` e adicione o prefixo em todos os blueprints:

```python
app.register_blueprint(auth_bp,         url_prefix="/v1/auth")
app.register_blueprint(servidor_bp,     url_prefix="/v1/servidor")
app.register_blueprint(solicitacoes_bp, url_prefix="/v1/solicitacoes")
app.register_blueprint(upload_bp,       url_prefix="/v1/upload")
app.register_blueprint(tabelas_bp,      url_prefix="/v1/tabelas")
```

---

## Produção

- Substitua SQLite por PostgreSQL (`DATABASE_URL=postgresql://...`)
- Use **Gunicorn**: `gunicorn -w 4 "app:create_app()"`
- Configure um bucket S3/Cloudflare R2 para armazenar currículos e retorne a URL pública no endpoint `/upload/curriculo`
- Use variáveis de ambiente reais para `SECRET_KEY` e `JWT_SECRET_KEY`
- Configure CORS para liberar apenas o domínio do front-end
