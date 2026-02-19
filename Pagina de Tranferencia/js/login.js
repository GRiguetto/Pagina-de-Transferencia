/**
 * ============================================================
 *  SMS RIO PRETO — LOGIN & CADASTRO
 *  Arquivo: js/login.js
 *  Depende de: js/api.config.js
 * ============================================================
 */

// ── Listas (idealmente virão do back-end via /tabelas) ────────
// Mantidas aqui como fallback offline
const CARGOS_FALLBACK = ['ADMINISTRADOR HOSPITALAR','ADMINISTRATIVO','ADVOGADO','AGENTE COMUNITARIO DE SAUDE','AGENTE DE COMBATE AS ENDEMIAS','AGENTE SOCIAL','ANALISTA DE TI','ANALISTA EM VIGILÂNCIA SANITÁRIA','ARTESÃO','ASSISTENTE SOCIAL','AUXILIAR DE SAÚDE BUCAL','AUXILIAR E TÉCNICO EM ENFERMAGEM','AUXILIAR E TÉCNICO EM LABORATÓRIO','AUXILIAR VETERINÁRIO','BIOMÉDICO','BIOLOGO','DENTISTA','DIGITADOR E OPERADOR DE COMPUTADOR','EDUCADOR FÍSICO','ENFERMEIRO','ENGENHEIROS E ARQUITETOS','FARMACÊUTICO','FISIOTERAPEUTA','FONOAUDIÓLOGO','INTERPRETE DE LIBRAS','MEDICO SAUDE DA FAMILIA','MEDICO VETERINARIO','MÉDICO CLINICO GERAL HORISTA','MÉDICO CLINICO GERAL PLANTONISTA','MÉDICO ESPECIALISTA','MÉDICO ORTOPEDISTA PLANTONISTA','MÉDICO PEDIATRA PLANTONISTA','NUTRICIONISTA','PSICOLOGO','TECNICO ADMINISTRATIVO EM SAUDE PUBLICA','TECNICO EM FARMACIA','TECNICO EM RADIOLOGIA','TECNICO ENGESSADOR','TERAPEUTA OCUPACIONAL'];
const UNIDADES_FALLBACK = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS','BANCO DE LEITE HUMANO','CAPS AD NORTE','CAPS I CENTRO','CAPS I NORTE','CAPS I SUL','CAPS II CENTRO','CAPS II SUL','CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)','CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)','CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE','CENTRO DE CONTROLE DE ZOONOSES','CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)','CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)','CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)','CENTRO ESPECIALIZADO DE REABILITAÇÃO','CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)','CENTRO MÉDICO DE ESPECIALIDADES','COMPLEXO REGULADOR','CONSELHO MUNICIPAL DE SAUDE','COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)','COORDENADORIA DE ÁREA TÉCNICA','COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO','COORDENADORIA DE RECURSOS HUMANOS','DEPARTAMENTO ADMINISTRATIVO','DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA','DEPARTAMENTO ATENÇÃO BÁSICA','DEPARTAMENTO ATENÇÃO ESPECIALIZADA','DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS','DEPARTAMENTO DE APOIO JURÍDICO','DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)','DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO','DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA','DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)','DEPARTAMENTO PLANEJAMENTO','FARMÁCIA CENTRAL','FARMÁCIA MUNICIPAL','FARMÁCIA MUNICIPAL NORTE','GABINETE','GERÊNCIA DE COMPRAS','GERÊNCIA DE IMUNIZAÇÃO','GERÊNCIA DE MANUTENÇÃO','GERÊNCIA DE SUPRIMENTOS','GERÊNCIA DE TRANSPORTES','LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA','NÚCLEO DE EDUCAÇÃO EM SAÚDE','OUVIDORIA','PRONTO SOCORRO - PS VILA TONINHO','SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)','SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)','SETOR CENTRAL DE REMOÇÃO','TELEMEDICINA','TODAS AS UNIDADES BÁSICAS DE SAÚDE','TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA','TODAS AS UNIDADES DE PRONTO ATENDIMENTO','TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE','UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA','UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI','UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL','UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA','UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM','UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO','UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT','UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL','UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE','UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER','UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II','UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE','UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL','UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO','UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE','UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO','UNIDADE BÁSICA DE SAÚDE - UBS TALHADO','UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO','UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA','UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR','UNIDADE BASICA DE SAUDE - UBS VILA TONINHO','UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ','UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE','UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO','UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL','VIGILÂNCIA AMBIENTAL','VIGILÂNCIA EPIDEMIOLÓGICA','VIGILÂNCIA SANITÁRIA'];

// ── Utilitários de UI ─────────────────────────────────────────
function setLoading(btn, loading, label = 'Aguarde...') {
    btn.disabled = loading;
    btn.textContent = loading ? label : btn.dataset.originalText;
}

function showError(formId, msg) {
    const form = document.getElementById(formId);
    let el = form.querySelector('.api-error');
    if (!el) {
        el = document.createElement('p');
        el.className = 'api-error';
        el.style.cssText = 'color:#c0392b;background:#fdecea;padding:10px 14px;border-radius:6px;margin-bottom:12px;font-size:.9rem;';
        form.prepend(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
}

function hideError(formId) {
    const el = document.getElementById(formId)?.querySelector('.api-error');
    if (el) el.style.display = 'none';
}

function popularSelect(selectEl, lista) {
    [...lista].sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        selectEl.appendChild(opt);
    });
}

// ── Carregar tabelas do back-end (com fallback) ───────────────
async function carregarTabelas() {
    let cargos = CARGOS_FALLBACK;
    let unidades = UNIDADES_FALLBACK;

    try {
        const [resCargos, resUnidades] = await Promise.all([
            API.get(API.ENDPOINTS.CARGOS),
            API.get(API.ENDPOINTS.UNIDADES),
        ]);
        if (resCargos.ok)   cargos   = resCargos.data;
        if (resUnidades.ok) unidades = resUnidades.data;
    } catch {
        console.warn('[Login] Usando listas de fallback (offline).');
    }

    popularSelect(document.getElementById('reg_cargo'),   cargos);
    popularSelect(document.getElementById('reg_unidade'), unidades);
}

// ── Lógica principal ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    // Salvar textos originais dos botões para restaurar após loading
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
        btn.dataset.originalText = btn.textContent;
    });

    await carregarTabelas();

    // ── Alternar Login / Cadastro ──────────────────────────────
    document.getElementById('showRegister').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('registerBox').style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('registerBox').style.display = 'none';
        document.getElementById('loginBox').style.display = 'block';
    });

    // ── LOGIN ──────────────────────────────────────────────────
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('loginForm');

        const btn = e.target.querySelector('button[type="submit"]');
        setLoading(btn, true, 'Entrando...');

        const payload = {
            login: document.getElementById('login_user').value.trim(),
            senha: document.getElementById('login_pass').value,
        };

        /*
         * POST /auth/login
         * Body:  { login: "matricula_ou_email", senha: "..." }
         * 200 OK: { access_token, refresh_token, usuario: { id, nome, papel } }
         *         papel: "servidor" | "admin"
         */
        const res = await API.post(API.ENDPOINTS.LOGIN, payload);
        setLoading(btn, false);

        if (!res.ok) {
            showError('loginForm', res.data?.message || res.message || 'Credenciais inválidas.');
            return;
        }

        // Persistir tokens e dados básicos do usuário
        sessionStorage.setItem('sms_token',         res.data.access_token);
        sessionStorage.setItem('sms_refresh_token', res.data.refresh_token);
        sessionStorage.setItem('sms_usuario',       JSON.stringify(res.data.usuario));

        // Redirecionar conforme papel
        const papel = res.data.usuario.papel;
        window.location.href = papel === 'admin'
            ? 'dashboardAdminView.html'
            : 'dashboardUserView.html';
    });

    // ── CADASTRO ───────────────────────────────────────────────
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('registerForm');

        const senha    = document.getElementById('reg_pass').value;
        const confirma = document.getElementById('reg_pass_confirm').value;

        if (senha !== confirma) {
            showError('registerForm', 'As senhas não coincidem.');
            return;
        }
        if (senha.length < 6) {
            showError('registerForm', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        setLoading(btn, true, 'Cadastrando...');

        /*
         * POST /auth/register
         * Body:  { nome, matricula, email, telefone, cargo, vinculo, unidade, admissao, senha }
         * 201 Created: { message: "Cadastro realizado com sucesso." }
         * 409 Conflict: { message: "Matrícula ou e-mail já cadastrado." }
         */
        const payload = {
            nome:      document.getElementById('reg_nome').value.trim(),
            matricula: document.getElementById('reg_matricula').value.trim(),
            email:     document.getElementById('reg_email').value.trim(),
            telefone:  document.getElementById('reg_telefone').value.trim(),
            cargo:     document.getElementById('reg_cargo').value,
            vinculo:   document.getElementById('vinculo').value,
            admissao:  document.getElementById('reg_admissao').value,
            unidade:   document.getElementById('reg_unidade').value,
            senha,
        };

        const res = await API.post(API.ENDPOINTS.REGISTER, payload);
        setLoading(btn, false);

        if (!res.ok) {
            showError('registerForm', res.data?.message || res.message || 'Erro ao cadastrar.');
            return;
        }

        alert('Cadastro realizado com sucesso! Faça seu login.');
        document.getElementById('showLogin').click();
    });
});