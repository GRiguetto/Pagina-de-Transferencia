/**
 * SMS RIO PRETO — DASHBOARD DO SERVIDOR
 * js/dashboardUserView.js  |  Depende de: js/Api.config.js
 */

 (function guardaRota() {
    if (!sessionStorage.getItem('sms_token')) window.location.href = 'index.html';
})();

const CARGOS_FB   = ['ADMINISTRATIVO','ADVOGADO','AGENTE COMUNITARIO DE SAUDE','AGENTE DE COMBATE AS ENDEMIAS','AGENTE SOCIAL','ANALISTA DE TI','ASSISTENTE SOCIAL','AUXILIAR DE SAÚDE BUCAL','AUXILIAR E TÉCNICO EM ENFERMAGEM','BIOMÉDICO','DENTISTA','EDUCADOR FÍSICO','ENFERMEIRO','FARMACÊUTICO','FISIOTERAPEUTA','FONOAUDIÓLOGO','MÉDICO CLINICO GERAL HORISTA','MÉDICO CLINICO GERAL PLANTONISTA','MÉDICO ESPECIALISTA','NUTRICIONISTA','PSICOLOGO','TECNICO EM FARMACIA','TECNICO EM RADIOLOGIA','TERAPEUTA OCUPACIONAL'];
const UNIDADES_FB = ['CAPS AD NORTE','CAPS I CENTRO','CAPS I NORTE','CAPS I SUL','CAPS II CENTRO','CAPS II SUL','CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)','CENTRO MÉDICO DE ESPECIALIDADES','DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO','FARMÁCIA CENTRAL','PRONTO SOCORRO - PS VILA TONINHO','SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)','UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA','UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL','UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL','UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO','UNIDADE BÁSICA DE SAÚDE - UBS TALHADO','UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ','UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE','UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO'];

const PRAZO_DIAS = 180;
let solicitacaoAtual = null;
let unidadesLista    = UNIDADES_FB;

// ── Helpers ───────────────────────────────────────────────────
function popularSelect(id, lista, valorAtual) {
    const sel = document.getElementById(id);
    if (!sel) return;
    [...lista].sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item; opt.textContent = item;
        if (item === valorAtual) opt.selected = true;
        sel.appendChild(opt);
    });
}

const STATUS_CLS = { 'Em Análise':'em-analise', 'Deferido':'deferido', 'Indeferido':'indeferido', 'Contemplado':'contemplado' };

function calcularDiasRestantes(dataCriacao) {
    const liberado = new Date(dataCriacao).getTime() + PRAZO_DIAS * 86400000;
    return Math.ceil((liberado - Date.now()) / 86400000);
}

function fmt(dateStr) {
    return dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') : '—';
}

// ── Solicitação atual ─────────────────────────────────────────
function renderizarSolicitacao(s) {
    const container = document.getElementById('pedido-info');
    if (!container) return;

    if (!s) {
        container.innerHTML = `
            <p style="color:#555;margin-bottom:10px;">Você não possui solicitação ativa no momento.</p>
            <p style="font-size:.9rem;color:#888;">Use o botão <strong>"+ Nova Solicitação"</strong> para registrar um pedido.</p>`;
        return;
    }

    const cls          = STATUS_CLS[s.status] || 'em-analise';
    const diasRest     = calcularDiasRestantes(s.data_criacao);
    const podeEditar   = s.status === 'Em Análise';

    let aviso = '';
    if (s.status === 'Indeferido') {
        aviso = `<div class="aviso-prazo aviso-info">ℹ️ Pedido indeferido. Você pode solicitar uma nova transferência a qualquer momento.</div>`;
    } else if (diasRest > 0 && s.status !== 'Contemplado') {
        aviso = `<div class="aviso-prazo">⏳ Próximo pedido liberado em <strong>${diasRest} dia(s)</strong>.</div>`;
    }

    let contemplacao = '';
    if (s.status === 'Deferido' && s.data_contemplacao) {
        const dc = new Date(s.data_contemplacao);
        contemplacao = `<p><strong>📅 Data prevista de contemplação:</strong> ${dc.toLocaleDateString('pt-BR')}</p>`;
        if (s.unidade_deferida) {
            contemplacao += `<p><strong>🏥 Unidade deferida:</strong> ${s.unidade_deferida}</p>`;
        }
    }

    container.innerHTML = `
        <p class="status-badge ${cls}">${s.status}</p>
        <div class="pedido-detalhes">
            <p><strong>Protocolo:</strong> ${s.protocolo}</p>
            <p><strong>Data do Pedido:</strong> ${fmt(s.data_criacao)}</p>
            ${s.data_edicao ? `<p><strong>Última Edição:</strong> ${fmt(s.data_edicao)}</p>` : ''}
            ${contemplacao}
            <p><strong>1ª Opção:</strong> ${s.opcao1 || '—'}</p>
            ${s.opcao2 ? `<p><strong>2ª Opção:</strong> ${s.opcao2}</p>` : ''}
            ${s.opcao3 ? `<p><strong>3ª Opção:</strong> ${s.opcao3}</p>` : ''}
            ${s.opcao4 ? `<p><strong>4ª Opção:</strong> ${s.opcao4}</p>` : ''}
            ${s.opcao5 ? `<p><strong>5ª Opção:</strong> ${s.opcao5}</p>` : ''}
            ${s.justificativa ? `<p><strong>Justificativa:</strong> ${s.justificativa}</p>` : ''}
        </div>
        ${aviso}
        ${podeEditar ? `<button class="btn-editar-pedido" onclick="abrirEdicaoPedido()">✏️ Editar Pedido</button>` : ''}`;
}

function verificarNovoPedido(e) {
    if (!solicitacaoAtual) return;
    // Indeferido = pode fazer novo sem espera
    if (solicitacaoAtual.status === 'Indeferido' || solicitacaoAtual.status === 'Contemplado') return;
    const dias = calcularDiasRestantes(solicitacaoAtual.data_criacao);
    if (dias > 0) {
        e.preventDefault(); e.stopPropagation();
        alert(`⏳ Você ainda não pode fazer um novo pedido.\n\nFaltam ${dias} dia(s) para o prazo de 6 meses (Portaria 02/2022, Art. 3º §2º).`);
    }
}

async function carregarSolicitacaoAtual() {
    const res = await API.get(API.ENDPOINTS.SOLICITACAO_ATUAL);
    solicitacaoAtual = (res.ok && res.data) ? res.data : null;
    renderizarSolicitacao(solicitacaoAtual);
}

// ── Modal edição do pedido ────────────────────────────────────
function abrirEdicaoPedido() {
    if (!solicitacaoAtual) return;
    const modal = document.getElementById('modalEditarPedido');
    if (!modal) return;

    const vals = [solicitacaoAtual.opcao1, solicitacaoAtual.opcao2,
                  solicitacaoAtual.opcao3, solicitacaoAtual.opcao4, solicitacaoAtual.opcao5];
    [1,2,3,4,5].forEach((n, i) => {
        const sel = document.getElementById(`edit-opcao${n}`);
        if (!sel) return;
        sel.innerHTML = '<option value="">— Nenhuma —</option>';
        [...unidadesLista].sort().forEach(u => {
            const opt = document.createElement('option');
            opt.value = u; opt.textContent = u;
            if (u === vals[i]) opt.selected = true;
            sel.appendChild(opt);
        });
    });
    modal.style.display = 'flex';
}

function fecharEdicaoPedido() {
    const m = document.getElementById('modalEditarPedido');
    if (m) m.style.display = 'none';
}

async function salvarEdicaoPedido() {
    if (!solicitacaoAtual) return;
    const opcao1 = document.getElementById('edit-opcao1')?.value;
    if (!opcao1) { alert('A 1ª opção é obrigatória.'); return; }

    const btn = document.getElementById('btnSalvarEdicao');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

    const res = await API.patch(API.ENDPOINTS.SOLICITACAO_EDITAR,
        { opcao1, opcao2: document.getElementById('edit-opcao2')?.value || null,
                  opcao3: document.getElementById('edit-opcao3')?.value || null,
                  opcao4: document.getElementById('edit-opcao4')?.value || null,
                  opcao5: document.getElementById('edit-opcao5')?.value || null },
        { id: solicitacaoAtual.id });

    if (btn) { btn.textContent = 'Salvar Alterações'; btn.disabled = false; }
    if (!res.ok) { alert(res.data?.message || 'Erro ao salvar.'); return; }

    solicitacaoAtual = { ...solicitacaoAtual, ...res.data };
    renderizarSolicitacao(solicitacaoAtual);
    fecharEdicaoPedido();
    alert('✅ Pedido atualizado! A data de edição foi registrada.');
}

// ── Histórico do servidor ─────────────────────────────────────
async function carregarHistorico() {
    const container = document.getElementById('historico-lista');
    if (!container) return;
    container.innerHTML = '<p style="color:#888">Carregando...</p>';

    const res = await API.get(API.ENDPOINTS.HISTORICO_USUARIO);
    if (!res.ok || !res.data?.length) {
        container.innerHTML = '<p style="color:#888">Nenhum pedido no histórico ainda.</p>';
        return;
    }

    container.innerHTML = res.data.map(s => {
        const cls = STATUS_CLS[s.status] || 'em-analise';
        let contemplacao = '';
        if (s.data_contemplacao) {
            contemplacao = `<p><strong>📅 Data de contemplação:</strong> ${fmt(s.data_contemplacao)}</p>`;
        }
        if (s.unidade_deferida) {
            contemplacao += `<p><strong>🏥 Unidade:</strong> ${s.unidade_deferida}</p>`;
        }
        return `
        <div class="historico-item">
            <div class="historico-header">
                <span class="status-badge ${cls}" style="font-size:.75rem;padding:4px 12px;">${s.status}</span>
                <span style="font-size:.85rem;color:#888;">${s.protocolo} &mdash; ${fmt(s.data_criacao)}</span>
            </div>
            <div class="historico-body">
                ${contemplacao}
                <p><strong>1ª Opção:</strong> ${s.opcao1 || '—'}</p>
                ${s.opcao2 ? `<p><strong>2ª Opção:</strong> ${s.opcao2}</p>` : ''}
                ${s.justificativa ? `<p><strong>Justificativa:</strong> ${s.justificativa}</p>` : ''}
                ${s.data_edicao ? `<p style="font-size:.8rem;color:#aaa;">Editado em ${fmt(s.data_edicao)}</p>` : ''}
            </div>
        </div>`;
    }).join('');
}

// ── Perfil ────────────────────────────────────────────────────
async function carregarPerfil() {
    const res = await API.get(API.ENDPOINTS.PERFIL);
    if (!res.ok) return;
    const p = res.data;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set('edit-nome', p.nome); set('edit-matricula', p.matricula);
    set('edit-email', p.email); set('edit-telefone', p.telefone);
    set('edit-admissao', p.admissao); set('vinculo', p.vinculo);
    window._perfil = p;
}

async function salvarPerfil(e) {
    e.preventDefault();
    const senha = document.getElementById('new-pass').value;
    const conf  = document.getElementById('confirm-new-pass').value;
    if (senha && senha !== conf) { alert('As senhas não coincidem!'); return; }
    if (senha && senha.length < 6) { alert('Mínimo 6 caracteres.'); return; }

    const btn = e.target.querySelector('.btn-secondary');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }

    const res = await API.patch(API.ENDPOINTS.PERFIL_UPDATE, {
        nome:     document.getElementById('edit-nome').value.trim(),
        email:    document.getElementById('edit-email').value.trim(),
        telefone: document.getElementById('edit-telefone').value.trim(),
        cargo:    document.getElementById('edit-cargo').value,
        vinculo:  document.getElementById('vinculo')?.value,
        unidade:  document.getElementById('edit-unidade').value,
        admissao: document.getElementById('edit-admissao').value,
        ...(senha ? { novaSenha: senha } : {}),
    });

    if (btn) { btn.textContent = 'Salvar Alterações'; btn.disabled = false; }
    if (!res.ok) { alert(res.data?.message || 'Erro ao salvar.'); return; }
    alert('✅ Perfil atualizado com sucesso!');
    document.getElementById('new-pass').value = '';
    document.getElementById('confirm-new-pass').value = '';
}

// ── Navegação ─────────────────────────────────────────────────
function iniciarNavegacao() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', e => {
            if (item.classList.contains('logout')) { sessionStorage.clear(); return; }
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            const target = document.getElementById(item.dataset.target);
            if (target) target.classList.add('active');
            if (item.dataset.target === 'historico') carregarHistorico();
        });
    });
}

function iniciarFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const a = btn.nextElementSibling;
            const aberto = a.style.display === 'block';
            document.querySelectorAll('.faq-answer').forEach(x => x.style.display = 'none');
            a.style.display = aberto ? 'none' : 'block';
        });
    });
}

function iniciarMenuMobile() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    const fechar = () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); toggle?.classList.remove('open'); };
    toggle?.addEventListener('click', () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); toggle.classList.toggle('open'); });
    overlay.addEventListener('click', fechar);
    document.querySelectorAll('.menu-item').forEach(i => i.addEventListener('click', fechar));
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    let cargos = CARGOS_FB;
    try {
        const [rc, ru] = await Promise.all([API.get(API.ENDPOINTS.CARGOS), API.get(API.ENDPOINTS.UNIDADES)]);
        if (rc.ok) cargos = rc.data;
        if (ru.ok) unidadesLista = ru.data;
    } catch {}

    popularSelect('edit-cargo', cargos);
    popularSelect('edit-unidade', unidadesLista);

    await Promise.all([carregarSolicitacaoAtual(), carregarPerfil()]);

    if (window._perfil) {
        const sc = document.getElementById('edit-cargo');
        const su = document.getElementById('edit-unidade');
        if (sc && window._perfil.cargo)   sc.value = window._perfil.cargo;
        if (su && window._perfil.unidade) su.value = window._perfil.unidade;
    }

    document.querySelectorAll('[onclick*="formulario.html"]').forEach(btn => {
        btn.addEventListener('click', verificarNovoPedido);
    });
    document.getElementById('updateProfileForm')?.addEventListener('submit', salvarPerfil);
    iniciarNavegacao();
    iniciarFAQ();
    iniciarMenuMobile();
});