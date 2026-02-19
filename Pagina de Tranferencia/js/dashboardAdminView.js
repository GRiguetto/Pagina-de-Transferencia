/**
 * ============================================================
 *  SMS RIO PRETO — DASHBOARD DO ADMINISTRADOR
 *  Arquivo: js/dashboardAdminView.js
 *  Depende de: js/api.config.js
 * ============================================================
 */

// ── Verificação de sessão e papel ─────────────────────────────
(function guardaRota() {
    const token   = sessionStorage.getItem('sms_token');
    const usuario = JSON.parse(sessionStorage.getItem('sms_usuario') || '{}');
    if (!token || usuario.papel !== 'admin') {
        window.location.href = 'index.html';
    }
})();

// ── Estado local da tabela ────────────────────────────────────
let registros      = [];   // dados vindos da API
let registrosFiltrados = [];
let paginaAtual    = 1;
let tamanhoPagina  = 15;
let pedidoSelecionadoId = null;

// ── Carregar todas as solicitações ────────────────────────────
async function carregarSolicitacoes(params = {}) {
    /*
     * GET /solicitacoes?status=&cargo=&vinculo=&unidade=&interesse=&dataInicio=&dataFim=&ordem=
     * 200 OK: [ { id, nome, email, matricula, vinculo, cargo, unidade,
     *             opcao1..5, status, data_criacao, data_edicao } ]
     */
    const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'todos'))
    ).toString();

    const endpoint = API.ENDPOINTS.SOLICITACOES + (query ? `?${query}` : '');
    const res = await API.get(endpoint);

    if (!res.ok) {
        console.error('[Admin] Erro ao carregar solicitações:', res.message);
        return;
    }

    registros = res.data;
    registrosFiltrados = [...registros];
    paginaAtual = 1;
    renderizarTabela();
    renderizarCardsAnalise();
    document.getElementById('rowCount').innerText = registros.length;
}

// ── Renderizar tabela com paginação ───────────────────────────
function renderizarTabela() {
    const tbody   = document.getElementById('dbContent');
    const inicio  = (paginaAtual - 1) * tamanhoPagina;
    const pagina  = registrosFiltrados.slice(inicio, inicio + tamanhoPagina);

    tbody.innerHTML = '';

    if (!pagina.length) {
        tbody.innerHTML = '<tr><td colspan="14" style="text-align:center;padding:30px;color:#888;">Nenhum registro encontrado.</td></tr>';
        atualizarPaginacao();
        return;
    }

    pagina.forEach(r => {
        const tr = document.createElement('tr');
        tr.dataset.id = r.id;
        tr.innerHTML = `
            <td class="col-check"><input type="checkbox" class="row-check" value="${r.id}"></td>
            <td>${r.nome}</td>
            <td>${r.email}</td>
            <td>${r.matricula}</td>
            <td>${r.vinculo}</td>
            <td>${r.cargo}</td>
            <td>${r.unidade}</td>
            <td>${r.opcao1 || '—'}</td>
            <td>${r.opcao2 || '—'}</td>
            <td>${r.opcao3 || '—'}</td>
            <td>${r.opcao4 || '—'}</td>
            <td>${r.opcao5 || '—'}</td>
            <td>${r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '—'}</td>
            <td>${r.data_edicao  ? new Date(r.data_edicao).toLocaleDateString('pt-BR')  : '—'}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('rowCount').innerText = registrosFiltrados.length;
    atualizarPaginacao();
}

function atualizarPaginacao() {
    const total  = Math.ceil(registrosFiltrados.length / tamanhoPagina) || 1;
    document.getElementById('pageInfo').textContent    = `Página ${paginaAtual} de ${total}`;
    document.getElementById('prevPage').disabled       = paginaAtual <= 1;
    document.getElementById('nextPage').disabled       = paginaAtual >= total;

    const nums = document.getElementById('pageNumbers');
    nums.innerHTML = '';
    const mostrar = Math.min(total, 5);
    let inicio = Math.max(1, paginaAtual - 2);
    let fim    = Math.min(total, inicio + mostrar - 1);
    if (fim - inicio < mostrar - 1) inicio = Math.max(1, fim - mostrar + 1);

    for (let i = inicio; i <= fim; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-page${i === paginaAtual ? ' active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { paginaAtual = i; renderizarTabela(); };
        nums.appendChild(btn);
    }
}

function paginaAnterior()   { if (paginaAtual > 1) { paginaAtual--; renderizarTabela(); } }
function proximaPagina()    { const t = Math.ceil(registrosFiltrados.length / tamanhoPagina); if (paginaAtual < t) { paginaAtual++; renderizarTabela(); } }
function mudarTamanhoPagina() { tamanhoPagina = parseInt(document.getElementById('pageSize').value); paginaAtual = 1; renderizarTabela(); }

// ── Filtros ───────────────────────────────────────────────────
function aplicarFiltros() {
    const status    = document.getElementById('filterStatus')?.value   || 'todos';
    const vinculo   = document.getElementById('filterVinculo')?.value  || 'todos';
    const cargo     = document.getElementById('filterCargo')?.value    || 'todos';
    const unidade   = document.getElementById('filterUnidade')?.value  || 'todos';
    const interesse = document.getElementById('filterInteresse')?.value || 'todos';
    const dataIni   = document.getElementById('filterDateStart')?.value;
    const dataFim   = document.getElementById('filterDateEnd')?.value;
    const ordem     = document.getElementById('orderData')?.value || 'recente';
    const busca     = document.getElementById('searchInput')?.value.toLowerCase() || '';

    registrosFiltrados = registros.filter(r => {
        if (status    !== 'todos' && r.status   !== status)   return false;
        if (vinculo   !== 'todos' && r.vinculo  !== vinculo)  return false;
        if (cargo     !== 'todos' && r.cargo    !== cargo)    return false;
        if (unidade   !== 'todos' && r.unidade  !== unidade)  return false;
        if (interesse !== 'todos' &&
            ![r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5].includes(interesse)) return false;

        if (dataIni && r.data_criacao && r.data_criacao < dataIni) return false;
        if (dataFim && r.data_criacao && r.data_criacao > dataFim + 'T23:59:59') return false;

        if (busca && !r.nome.toLowerCase().includes(busca) &&
                     !r.matricula.toLowerCase().includes(busca) &&
                     !r.email.toLowerCase().includes(busca)) return false;
        return true;
    });

    const ordens = {
        recente:  (a,b) => new Date(b.data_criacao) - new Date(a.data_criacao),
        antigo:   (a,b) => new Date(a.data_criacao) - new Date(b.data_criacao),
        nomeAZ:   (a,b) => a.nome.localeCompare(b.nome),
        nomeZA:   (a,b) => b.nome.localeCompare(a.nome),
        matricula:(a,b) => a.matricula.localeCompare(b.matricula),
    };
    registrosFiltrados.sort(ordens[ordem] || ordens.recente);

    paginaAtual = 1;
    renderizarTabela();
}

function limparFiltros() {
    ['filterStatus','filterVinculo','filterCargo','filterUnidade','filterInteresse','orderData']
        .forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    ['filterDateStart','filterDateEnd','searchInput']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    registrosFiltrados = [...registros];
    paginaAtual = 1;
    renderizarTabela();
}

// ── Seleção em massa ──────────────────────────────────────────
function toggleSelectAll() {
    const master  = document.getElementById('selectAll');
    const checks  = document.querySelectorAll('.row-check');
    checks.forEach(c => c.checked = master.checked);
    document.getElementById('bulkActions').style.display =
        master.checked && checks.length ? 'flex' : 'none';
}

async function massaExcluir() {
    const ids = [...document.querySelectorAll('.row-check:checked')].map(c => parseInt(c.value));
    if (!ids.length) return;
    if (!confirm(`Excluir ${ids.length} registro(s)?`)) return;

    /*
     * DELETE /solicitacoes/:id  — chamada para cada id selecionado
     * 204 No Content
     */
    const resultados = await Promise.all(
        ids.map(id => API.delete(API.ENDPOINTS.SOLICITACAO_BY_ID, { id }))
    );

    const falhas = resultados.filter(r => !r.ok).length;
    if (falhas) alert(`${falhas} exclusão(ões) falharam. Verifique e tente novamente.`);

    await carregarSolicitacoes();
    document.getElementById('bulkActions').style.display = 'none';
    document.getElementById('selectAll').checked = false;
}

// ── Exportar ──────────────────────────────────────────────────
function exportar(formato) {
    const cabecalho = ['Nome','E-mail','Matrícula','Vínculo','Cargo','Unidade Atual',
                       'Prioridade 1','Prioridade 2','Prioridade 3','Prioridade 4','Prioridade 5',
                       'Status','Data Pedido','Data Edição'];

    const rows = registrosFiltrados.map(r => [
        r.nome, r.email, r.matricula, r.vinculo, r.cargo, r.unidade,
        r.opcao1||'', r.opcao2||'', r.opcao3||'', r.opcao4||'', r.opcao5||'',
        r.status||'',
        r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '',
        r.data_edicao  ? new Date(r.data_edicao).toLocaleDateString('pt-BR')  : '',
    ]);

    const esc = v => `"${String(v).replace(/"/g,'""')}"`;
    const csv = [cabecalho, ...rows].map(r => r.map(esc).join(',')).join('\n');
    const uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
    const a   = Object.assign(document.createElement('a'), { href: uri, download: 'solicitacoes.csv' });
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// ── Cards de análise ──────────────────────────────────────────
function renderizarCardsAnalise() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!registros.length) {
        container.innerHTML = '<p style="color:#888">Nenhuma solicitação para analisar.</p>';
        return;
    }

    registros.forEach(r => {
        const statusClass = (r.status || 'Em Análise').toLowerCase().replace(' ','-');
        const card = document.createElement('div');
        card.className = 'card card-pedido';
        card.innerHTML = `
            <div class="info-principal">
                <div class="cargo-tag">${r.cargo}</div>
                <div class="nome">${r.nome}</div>
                <p><strong>Unidade Atual:</strong> ${r.unidade}</p>
                <p><strong>1ª Opção:</strong> ${r.opcao1}</p>
            </div>
            <div class="status-badge ${statusClass}">${r.status || 'Em Análise'}</div>
            <button class="btn-primary" onclick="abrirDetalhes(${r.id})" style="width:100%;margin-top:15px;">
                Analisar Detalhes
            </button>`;
        container.appendChild(card);
    });
}

// ── Modal de detalhes ─────────────────────────────────────────
function abrirDetalhes(id) {
    const r = registros.find(p => p.id === id);
    if (!r) return;
    pedidoSelecionadoId = id;

    document.getElementById('modalBody').innerHTML = `
        <div class="info-group">
            <h4 class="form-section-title">Dados do Servidor</h4>
            <p><strong>Nome:</strong> ${r.nome}</p>
            <p><strong>Matrícula:</strong> ${r.matricula}</p>
            <p><strong>Vínculo:</strong> ${r.vinculo}</p>
            <p><strong>E-mail:</strong> ${r.email}</p>
            <p><strong>Data Pedido:</strong> ${r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '—'}</p>
        </div>
        <div class="info-group">
            <h4 class="form-section-title">Prioridades Solicitadas</h4>
            <ol>
                ${[r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5]
                    .map(o => `<li>${o || '—'}</li>`).join('')}
            </ol>
            ${r.curriculo_url
                ? `<a href="${r.curriculo_url}" target="_blank" class="link-documento">📄 Ver Currículo</a>`
                : ''}
        </div>`;

    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
    document.getElementById('justificativa').value = '';
    pedidoSelecionadoId = null;
}

async function atualizarStatus(novoStatus) {
    if (!pedidoSelecionadoId) return;
    const justificativa = document.getElementById('justificativa').value.trim();

    /*
     * PATCH /solicitacoes/:id/status
     * Body: { status: "Em Análise" | "Deferido" | "Indeferido", justificativa?: "..." }
     * 200 OK: { id, status, data_edicao }
     */
    const res = await API.patch(
        API.ENDPOINTS.SOLICITACAO_STATUS,
        { status: novoStatus, justificativa: justificativa || undefined },
        { id: pedidoSelecionadoId }
    );

    if (!res.ok) {
        alert(res.data?.message || 'Erro ao atualizar status. Tente novamente.');
        return;
    }

    // Atualizar localmente para evitar recarga completa
    const idx = registros.findIndex(p => p.id === pedidoSelecionadoId);
    if (idx !== -1) {
        registros[idx].status     = novoStatus;
        registros[idx].data_edicao = res.data.data_edicao;
    }

    alert(`Pedido atualizado para "${novoStatus}" com sucesso!`);
    fecharModal();
    renderizarTabela();
    renderizarCardsAnalise();
}

// ── Populações auxiliares ─────────────────────────────────────
async function popularFiltros() {
    const cargosEl   = document.getElementById('filterCargo');
    const unidadesEl = document.getElementById('filterUnidade');
    const interEl    = document.getElementById('filterInteresse');

    let cargos = [], unidades = [];
    try {
        const [rc, ru] = await Promise.all([
            API.get(API.ENDPOINTS.CARGOS),
            API.get(API.ENDPOINTS.UNIDADES),
        ]);
        if (rc.ok) cargos = rc.data;
        if (ru.ok) unidades = ru.data;
    } catch { /* silencioso */ }

    const preencher = (sel, lista) => {
        [...lista].sort().forEach(item => {
            const opt = document.createElement('option');
            opt.value = item; opt.textContent = item;
            sel?.appendChild(opt);
        });
    };
    preencher(cargosEl,   cargos);
    preencher(unidadesEl, unidades);
    preencher(interEl,    unidades);

    // Perfil — selects do formulário de edição
    const profCargo   = document.getElementById('edit-cargo');
    const profUnidade = document.getElementById('edit-unidade');
    preencher(profCargo,   cargos);
    preencher(profUnidade, unidades);
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

// ── Navegação entre seções ────────────────────────────────────
function iniciarNavegacao() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections  = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', e => {
            if (item.classList.contains('logout')) { sessionStorage.clear(); return; }
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(item.dataset.target)?.classList.add('active');
            // Recarregar cards ao entrar na aba de análise
            if (item.dataset.target === 'analise-pedidos') renderizarCardsAnalise();
        });
    });
}

// ── FAQ ───────────────────────────────────────────────────────
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

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await popularFiltros();
    await carregarSolicitacoes();

    iniciarNavegacao();
    iniciarFAQ();
    iniciarMenuMobile();
});