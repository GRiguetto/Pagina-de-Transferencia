/**
 * ============================================================
 *  SMS RIO PRETO — DASHBOARD DO SERVIDOR (USER VIEW)
 *  Arquivo: js/dashboardUserView.js
 *  Depende de: js/api.config.js
 * ============================================================
 */

// ── Verificação de sessão ─────────────────────────────────────
(function guardaRota() {
    if (!sessionStorage.getItem('sms_token')) {
        window.location.href = 'index.html';
    }
})();

// ── Fallbacks das listas ──────────────────────────────────────
const CARGOS_FALLBACK = ['ADMINISTRADOR HOSPITALAR','ADMINISTRATIVO','ADVOGADO','AGENTE COMUNITARIO DE SAUDE','AGENTE DE COMBATE AS ENDEMIAS','AGENTE SOCIAL','ANALISTA DE TI','ANALISTA EM VIGILÂNCIA SANITÁRIA','ARTESÃO','ASSISTENTE SOCIAL','AUXILIAR DE SAÚDE BUCAL','AUXILIAR E TÉCNICO EM ENFERMAGEM','AUXILIAR E TÉCNICO EM LABORATÓRIO','AUXILIAR VETERINÁRIO','BIOMÉDICO','BIOLOGO','DENTISTA','DIGITADOR E OPERADOR DE COMPUTADOR','EDUCADOR FÍSICO','ENFERMEIRO','ENGENHEIROS E ARQUITETOS','FARMACÊUTICO','FISIOTERAPEUTA','FONOAUDIÓLOGO','INTERPRETE DE LIBRAS','MEDICO SAUDE DA FAMILIA','MEDICO VETERINARIO','MÉDICO CLINICO GERAL HORISTA','MÉDICO CLINICO GERAL PLANTONISTA','MÉDICO ESPECIALISTA','MÉDICO ORTOPEDISTA PLANTONISTA','MÉDICO PEDIATRA PLANTONISTA','NUTRICIONISTA','PSICOLOGO','TECNICO ADMINISTRATIVO EM SAUDE PUBLICA','TECNICO EM FARMACIA','TECNICO EM RADIOLOGIA','TECNICO ENGESSADOR','TERAPEUTA OCUPACIONAL'];
const UNIDADES_FALLBACK = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS','BANCO DE LEITE HUMANO','CAPS AD NORTE','CAPS I CENTRO','CAPS I NORTE','CAPS I SUL','CAPS II CENTRO','CAPS II SUL','CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)','CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)','CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE','CENTRO DE CONTROLE DE ZOONOSES','CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)','CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)','CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)','CENTRO ESPECIALIZADO DE REABILITAÇÃO','CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)','CENTRO MÉDICO DE ESPECIALIDADES','COMPLEXO REGULADOR','CONSELHO MUNICIPAL DE SAUDE','COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)','COORDENADORIA DE ÁREA TÉCNICA','COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO','COORDENADORIA DE RECURSOS HUMANOS','DEPARTAMENTO ADMINISTRATIVO','DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA','DEPARTAMENTO ATENÇÃO BÁSICA','DEPARTAMENTO ATENÇÃO ESPECIALIZADA','DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS','DEPARTAMENTO DE APOIO JURÍDICO','DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)','DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO','DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA','DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)','DEPARTAMENTO PLANEJAMENTO','FARMÁCIA CENTRAL','FARMÁCIA MUNICIPAL','FARMÁCIA MUNICIPAL NORTE','GABINETE','GERÊNCIA DE COMPRAS','GERÊNCIA DE IMUNIZAÇÃO','GERÊNCIA DE MANUTENÇÃO','GERÊNCIA DE SUPRIMENTOS','GERÊNCIA DE TRANSPORTES','LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA','NÚCLEO DE EDUCAÇÃO EM SAÚDE','OUVIDORIA','PRONTO SOCORRO - PS VILA TONINHO','SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)','SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)','SETOR CENTRAL DE REMOÇÃO','TELEMEDICINA','TODAS AS UNIDADES BÁSICAS DE SAÚDE','TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA','TODAS AS UNIDADES DE PRONTO ATENDIMENTO','TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE','UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA','UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI','UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL','UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA','UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM','UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO','UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT','UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL','UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE','UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER','UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II','UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE','UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL','UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO','UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE','UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO','UNIDADE BÁSICA DE SAÚDE - UBS TALHADO','UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO','UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA','UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR','UNIDADE BASICA DE SAUDE - UBS VILA TONINHO','UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ','UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE','UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO','UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL','VIGILÂNCIA AMBIENTAL','VIGILÂNCIA EPIDEMIOLÓGICA','VIGILÂNCIA SANITÁRIA'];

// ── Helpers de UI ─────────────────────────────────────────────
function popularSelect(id, lista) {
    const sel = document.getElementById(id);
    if (!sel) return;
    [...lista].sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        sel.appendChild(opt);
    });
}

const STATUS_CLASSES = {
    'Em Análise': 'em-analise',
    'Deferido':   'deferido',
    'Indeferido': 'indeferido',
};

// ── Carregar solicitação atual do servidor ────────────────────
async function carregarSolicitacaoAtual() {
    /*
     * GET /servidor/solicitacao
     * 200 OK: { protocolo, data_criacao, status, opcao1, opcao2?, ... }
     * 404:    { message: "Nenhuma solicitação ativa." }
     */
    const res = await API.get(API.ENDPOINTS.SOLICITACAO_ATUAL);
    const container = document.getElementById('pedido-info');
    if (!container) return;

    if (!res.ok || !res.data) {
        container.innerHTML = `
            <p class="text-muted">Você não possui solicitação ativa no momento.</p>
            <p style="margin-top:8px;font-size:.9rem;color:#666;">
                Use o botão <strong>"+ Nova Solicitação"</strong> para registrar um pedido.
            </p>`;
        return;
    }

    const s = res.data;
    const statusClass = STATUS_CLASSES[s.status] || 'em-analise';
    const dataFormatada = s.data_criacao
        ? new Date(s.data_criacao).toLocaleDateString('pt-BR')
        : '—';

    container.innerHTML = `
        <p class="status-badge ${statusClass}">${s.status}</p>
        <div class="pedido-detalhes">
            <p><strong>Protocolo:</strong> ${s.protocolo}</p>
            <p><strong>Data do Pedido:</strong> ${dataFormatada}</p>
            <p><strong>1ª Opção Solicitada:</strong> ${s.opcao1}</p>
            ${s.justificativa ? `<p><strong>Justificativa:</strong> ${s.justificativa}</p>` : ''}
        </div>`;
}

// ── Carregar e preencher perfil do servidor ───────────────────
async function carregarPerfil() {
    /*
     * GET /servidor/perfil
     * 200 OK: { nome, matricula, email, telefone, cargo, vinculo, unidade, admissao }
     */
    const res = await API.get(API.ENDPOINTS.PERFIL);
    if (!res.ok) return;

    const p = res.data;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };

    set('edit-nome',      p.nome);
    set('edit-matricula', p.matricula);
    set('edit-email',     p.email);
    set('edit-telefone',  p.telefone);
    set('edit-admissao',  p.admissao);
    set('edit-cargo',     p.cargo);
    set('vinculo',        p.vinculo);
    set('edit-unidade',   p.unidade);
}

// ── Atualizar perfil ──────────────────────────────────────────
async function salvarPerfil(e) {
    e.preventDefault();

    const senha    = document.getElementById('new-pass').value;
    const confirma = document.getElementById('confirm-new-pass').value;

    if (senha && senha !== confirma) {
        alert('As novas senhas não coincidem!');
        return;
    }
    if (senha && senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    const btn = e.target.querySelector('.btn-secondary');
    btn.textContent = 'Salvando...';
    btn.disabled = true;

    /*
     * PATCH /servidor/perfil
     * Body: { nome, email, telefone, cargo, vinculo, unidade, admissao, novaSenha? }
     * 200 OK: { message: "Perfil atualizado com sucesso." }
     */
    const payload = {
        nome:      document.getElementById('edit-nome').value.trim(),
        matricula: document.getElementById('edit-matricula').value.trim(),
        email:     document.getElementById('edit-email').value.trim(),
        telefone:  document.getElementById('edit-telefone').value.trim(),
        cargo:     document.getElementById('edit-cargo').value,
        vinculo:   document.getElementById('vinculo')?.value,
        unidade:   document.getElementById('edit-unidade').value,
        admissao:  document.getElementById('edit-admissao').value,
        ...(senha ? { novaSenha: senha } : {}),
    };

    const res = await API.patch(API.ENDPOINTS.PERFIL_UPDATE, payload);
    btn.textContent = 'Salvar Alterações';
    btn.disabled = false;

    if (!res.ok) {
        alert(res.data?.message || res.message || 'Erro ao salvar. Tente novamente.');
        return;
    }

    alert('Perfil atualizado com sucesso!');
    document.getElementById('new-pass').value = '';
    document.getElementById('confirm-new-pass').value = '';
}

// ── Navegação entre seções ────────────────────────────────────
function iniciarNavegacao() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections  = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', e => {
            if (item.classList.contains('logout')) {
                // Limpar sessão ao sair
                sessionStorage.clear();
                return;
            }
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(item.dataset.target)?.classList.add('active');
        });
    });
}

// ── FAQ Accordion ─────────────────────────────────────────────
function iniciarFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const aberto = answer.style.display === 'block';
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            answer.style.display = aberto ? 'none' : 'block';
        });
    });
}

// ── Menu mobile ───────────────────────────────────────────────
function iniciarMenuMobile() {
    const toggle  = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const fechar = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        toggle?.classList.remove('open');
    };

    toggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        toggle.classList.toggle('open');
    });

    overlay.addEventListener('click', fechar);
    document.querySelectorAll('.menu-item').forEach(i => i.addEventListener('click', fechar));
}

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    // Carregar listas para o formulário de perfil
    let cargos = CARGOS_FALLBACK, unidades = UNIDADES_FALLBACK;
    try {
        const [rc, ru] = await Promise.all([
            API.get(API.ENDPOINTS.CARGOS),
            API.get(API.ENDPOINTS.UNIDADES),
        ]);
        if (rc.ok) cargos = rc.data;
        if (ru.ok) unidades = ru.data;
    } catch { /* usa fallback */ }

    popularSelect('edit-cargo',   cargos);
    popularSelect('edit-unidade', unidades);

    // Dados do servidor
    await Promise.all([
        carregarSolicitacaoAtual(),
        carregarPerfil(),
    ]);

    // Eventos
    document.getElementById('updateProfileForm')?.addEventListener('submit', salvarPerfil);
    iniciarNavegacao();
    iniciarFAQ();
    iniciarMenuMobile();
});