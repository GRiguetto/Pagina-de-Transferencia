/**
 * ============================================================
 *  SMS RIO PRETO — FORMULÁRIO DE SOLICITAÇÃO DE TRANSFERÊNCIA
 *  Arquivo: js/formulario.js
 *  Depende de: js/api.config.js
 * ============================================================
 */

// ── Fallbacks das listas (caso o back-end não responda) ───────
const CARGOS_FALLBACK = ['ADMINISTRADOR HOSPITALAR','ADMINISTRATIVO','ADVOGADO','AGENTE COMUNITARIO DE SAUDE','AGENTE DE COMBATE AS ENDEMIAS','AGENTE SOCIAL','ANALISTA DE TI','ANALISTA EM VIGILÂNCIA SANITÁRIA','ARTESÃO','ASSISTENTE SOCIAL','AUXILIAR DE SAÚDE BUCAL','AUXILIAR E TÉCNICO EM ENFERMAGEM','AUXILIAR E TÉCNICO EM LABORATÓRIO','AUXILIAR VETERINÁRIO','BIOMÉDICO','BIOLOGO','DENTISTA','DIGITADOR E OPERADOR DE COMPUTADOR','EDUCADOR FÍSICO','ENFERMEIRO','ENGENHEIROS E ARQUITETOS','FARMACÊUTICO','FISIOTERAPEUTA','FONOAUDIÓLOGO','INTERPRETE DE LIBRAS','MEDICO SAUDE DA FAMILIA','MEDICO VETERINARIO','MÉDICO CLINICO GERAL HORISTA','MÉDICO CLINICO GERAL PLANTONISTA','MÉDICO ESPECIALISTA','MÉDICO ORTOPEDISTA PLANTONISTA','MÉDICO PEDIATRA PLANTONISTA','NUTRICIONISTA','PSICOLOGO','TECNICO ADMINISTRATIVO EM SAUDE PUBLICA','TECNICO EM FARMACIA','TECNICO EM RADIOLOGIA','TECNICO ENGESSADOR','TERAPEUTA OCUPACIONAL'];
const UNIDADES_FALLBACK = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS','BANCO DE LEITE HUMANO','CAPS AD NORTE','CAPS I CENTRO','CAPS I NORTE','CAPS I SUL','CAPS II CENTRO','CAPS II SUL','CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)','CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)','CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE','CENTRO DE CONTROLE DE ZOONOSES','CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)','CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)','CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)','CENTRO ESPECIALIZADO DE REABILITAÇÃO','CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)','CENTRO MÉDICO DE ESPECIALIDADES','COMPLEXO REGULADOR','CONSELHO MUNICIPAL DE SAUDE','COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)','COORDENADORIA DE ÁREA TÉCNICA','COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO','COORDENADORIA DE RECURSOS HUMANOS','DEPARTAMENTO ADMINISTRATIVO','DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA','DEPARTAMENTO ATENÇÃO BÁSICA','DEPARTAMENTO ATENÇÃO ESPECIALIZADA','DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS','DEPARTAMENTO DE APOIO JURÍDICO','DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)','DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO','DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA','DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)','DEPARTAMENTO PLANEJAMENTO','FARMÁCIA CENTRAL','FARMÁCIA MUNICIPAL','FARMÁCIA MUNICIPAL NORTE','GABINETE','GERÊNCIA DE COMPRAS','GERÊNCIA DE IMUNIZAÇÃO','GERÊNCIA DE MANUTENÇÃO','GERÊNCIA DE SUPRIMENTOS','GERÊNCIA DE TRANSPORTES','LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA','NÚCLEO DE EDUCAÇÃO EM SAÚDE','OUVIDORIA','PRONTO SOCORRO - PS VILA TONINHO','SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)','SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)','SETOR CENTRAL DE REMOÇÃO','TELEMEDICINA','TODAS AS UNIDADES BÁSICAS DE SAÚDE','TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA','TODAS AS UNIDADES DE PRONTO ATENDIMENTO','TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE','UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA','UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI','UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL','UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA','UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM','UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO','UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT','UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL','UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE','UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA','UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER','UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II','UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE','UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA','UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL','UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO','UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO','UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE','UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO','UNIDADE BÁSICA DE SAÚDE - UBS TALHADO','UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO','UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA','UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR','UNIDADE BASICA DE SAUDE - UBS VILA TONINHO','UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ','UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE','UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO','UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL','VIGILÂNCIA AMBIENTAL','VIGILÂNCIA EPIDEMIOLÓGICA','VIGILÂNCIA SANITÁRIA'];

// ── População de dropdowns ────────────────────────────────────
function popularSelect(id, lista, primeiraOpcao = null) {
    const sel = document.getElementById(id);
    if (!sel) return;
    if (primeiraOpcao !== null) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = primeiraOpcao;
        opt.selected = true;
        sel.appendChild(opt);
    }
    [...lista].sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        sel.appendChild(opt);
    });
}

async function carregarDropdowns() {
    let cargos = CARGOS_FALLBACK;
    let unidades = UNIDADES_FALLBACK;

    try {
        const [rc, ru] = await Promise.all([
            API.get(API.ENDPOINTS.CARGOS),
            API.get(API.ENDPOINTS.UNIDADES),
        ]);
        if (rc.ok) cargos = rc.data;
        if (ru.ok) unidades = ru.data;
    } catch {
        console.warn('[Formulário] Usando fallback de listas.');
    }

    popularSelect('cargo', cargos);
    popularSelect('unidade_atual', unidades);
    ['opcao1','opcao2','opcao3','opcao4','opcao5'].forEach(id => {
        popularSelect(id, unidades);
        document.getElementById(id)?.addEventListener('change', validarEscolhasUnicas);
    });
}

// ── Validação: impede selecionar a mesma unidade em duas opções
function validarEscolhasUnicas() {
    const selects = document.querySelectorAll('.select-unidade');
    selects.forEach(current => {
        current.querySelectorAll('option').forEach(opt => {
            if (!opt.value) return;
            const duplicado = [...selects].some(s => s !== current && s.value === opt.value);
            opt.disabled = duplicado;
            opt.style.color = duplicado ? '#ccc' : '';
        });
    });
}

// ── Máscara de telefone ───────────────────────────────────────
function aplicarMascaraTelefone(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 5) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    e.target.value = v;
}

// ── Pré-preencher formulário com dados do servidor logado ─────
async function preencherComPerfil() {
    /*
     * GET /servidor/perfil
     * 200 OK: { nome, matricula, email, telefone, cargo, vinculo, unidade, admissao }
     */
    const res = await API.get(API.ENDPOINTS.PERFIL);
    if (!res.ok) return;

    const p = res.data;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };

    set('nome',          p.nome);
    set('matricula',     p.matricula);
    set('email',         p.email);
    set('telefone',      p.telefone);
    set('admissao',      p.admissao);
    set('cargo',         p.cargo);
    set('vinculo',       p.vinculo);
    set('unidade_atual', p.unidade);
}

// ── Envio do formulário ───────────────────────────────────────
async function enviarSolicitacao(e) {
    e.preventDefault();

    const btn = e.target.querySelector('.btn-submit');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const curriculo = document.getElementById('curriculo').files[0];
    let curriculo_url = null;

    // 1. Upload do currículo, se houver
    if (curriculo) {
        const formData = new FormData();
        formData.append('curriculo', curriculo);
        /*
         * POST /solicitacoes  (multipart/form-data com campo "curriculo")
         * 200 OK: { url: "https://storage.../curriculo_xyz.pdf" }
         */
        const upRes = await API.upload('/upload/curriculo', formData);
        if (!upRes.ok) {
            alert('Falha no upload do currículo. Tente novamente.');
            btn.textContent = 'Enviar Solicitação';
            btn.disabled = false;
            return;
        }
        curriculo_url = upRes.data.url;
    }

    // 2. Enviar dados da solicitação
    /*
     * POST /solicitacoes
     * Body: { nome, matricula, vinculo, cargo, admissao, email, telefone,
     *         unidade_atual, opcao1, opcao2?, opcao3?, opcao4?, opcao5?, curriculo_url? }
     * 201 Created: { id, protocolo, status, data_criacao }
     * 409 Conflict: { message: "Servidor já possui solicitação ativa no período." }
     */
    const payload = {
        nome:          document.getElementById('nome').value.trim(),
        matricula:     document.getElementById('matricula').value.trim(),
        vinculo:       document.getElementById('vinculo').value,
        cargo:         document.getElementById('cargo').value,
        admissao:      document.getElementById('admissao').value,
        email:         document.getElementById('email').value.trim(),
        telefone:      document.getElementById('telefone').value.trim(),
        unidade_atual: document.getElementById('unidade_atual').value,
        opcao1:        document.getElementById('opcao1').value,
        opcao2:        document.getElementById('opcao2').value || null,
        opcao3:        document.getElementById('opcao3').value || null,
        opcao4:        document.getElementById('opcao4').value || null,
        opcao5:        document.getElementById('opcao5').value || null,
        curriculo_url,
    };

    const res = await API.post(API.ENDPOINTS.SOLICITACOES, payload);

    btn.textContent = 'Enviar Solicitação';
    btn.disabled = false;

    if (!res.ok) {
        const msg = res.data?.message || res.message || 'Erro ao enviar solicitação.';
        alert(`Erro: ${msg}`);
        return;
    }

    alert(`Solicitação registrada com sucesso!\nProtocolo: ${res.data.protocolo}`);
    e.target.reset();
}

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await carregarDropdowns();
    await preencherComPerfil();

    document.getElementById('telefone')?.addEventListener('input', aplicarMascaraTelefone);
    document.getElementById('transferForm')?.addEventListener('submit', enviarSolicitacao);
});