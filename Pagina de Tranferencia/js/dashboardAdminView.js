/**
 * SMS RIO PRETO — DASHBOARD DO ADMINISTRADOR
 * js/dashboardAdminView.js  |  Depende de: js/Api.config.js
 */

 (function guardaRota() {
    const token   = sessionStorage.getItem('sms_token');
    const usuario = JSON.parse(sessionStorage.getItem('sms_usuario') || '{}');
    if (!token || usuario.papel !== 'admin') window.location.href = 'index.html';
})();

// ── Estado ────────────────────────────────────────────────────
let registros          = [];
let registrosFiltrados = [];
let paginaAtual        = 1;
let tamanhoPagina      = 15;
let pedidoSelecionadoId = null;
let _debounceTimer     = null;
let unidadesLista      = [];

// ── Carregar solicitações ─────────────────────────────────────
async function carregarSolicitacoes() {
    const res = await API.get(API.ENDPOINTS.SOLICITACOES);
    if (!res.ok) { console.error('Erro ao carregar solicitações:', res.message); return; }
    registros = Array.isArray(res.data) ? res.data : (res.data?.items || []);
    aplicarFiltros();
    renderizarCardsAnalise();
}

// ── Filtros ───────────────────────────────────────────────────
function aplicarFiltros() {
    const status    = document.getElementById('filterStatus')?.value    || 'todos';
    const vinculo   = document.getElementById('filterVinculo')?.value   || 'todos';
    const cargo     = document.getElementById('filterCargo')?.value     || 'todos';
    const unidade   = document.getElementById('filterUnidade')?.value   || 'todos';
    const interesse = document.getElementById('filterInteresse')?.value || 'todos';
    const dataIni   = document.getElementById('filterDateStart')?.value || '';
    const dataFim   = document.getElementById('filterDateEnd')?.value   || '';
    const ordem     = document.getElementById('orderData')?.value       || 'recente';
    const busca     = ((document.getElementById('dbSearch')?.value || '') +
                       (document.getElementById('searchAnalise')?.value || '')).toLowerCase().trim();

    registrosFiltrados = registros.filter(r => {
        if (status    !== 'todos' && r.status  !== status)   return false;
        if (vinculo   !== 'todos' && r.vinculo !== vinculo)  return false;
        if (cargo     !== 'todos' && r.cargo   !== cargo)    return false;
        if (unidade   !== 'todos' && r.unidade !== unidade)  return false;
        if (interesse !== 'todos' &&
            ![r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5].includes(interesse)) return false;
        if (dataIni && r.data_criacao && r.data_criacao < dataIni) return false;
        if (dataFim && r.data_criacao && r.data_criacao > dataFim + 'T23:59:59') return false;
        if (busca) {
            const campos = [r.nome,r.matricula,r.email,r.vinculo,r.cargo,r.unidade,
                            r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5,r.status]
                           .map(v => (v||'').toLowerCase());
            if (!campos.some(c => c.includes(busca))) return false;
        }
        return true;
    });

    const ordens = {
        recente:  (a,b) => new Date(b.data_criacao) - new Date(a.data_criacao),
        antigo:   (a,b) => new Date(a.data_criacao) - new Date(b.data_criacao),
        nomeAZ:   (a,b) => (a.nome||'').localeCompare(b.nome||''),
        nomeZA:   (a,b) => (b.nome||'').localeCompare(a.nome||''),
        matricula:(a,b) => (a.matricula||'').localeCompare(b.matricula||''),
    };
    registrosFiltrados.sort(ordens[ordem] || ordens.recente);
    paginaAtual = 1;
    renderizarTabela();
    renderizarCardsAnalise();
}

// Filtros da aba análise (status + ordem independentes)
function aplicarFiltrosAnalise() {
    const statusA = document.getElementById('filterStatusAnalise')?.value || 'todos';
    const ordemA  = document.getElementById('orderAnalise')?.value        || 'recente';
    const busca   = (document.getElementById('searchAnalise')?.value || '').toLowerCase().trim();

    let lista = [...registros];

    if (statusA !== 'todos') lista = lista.filter(r => r.status === statusA);
    if (busca) {
        lista = lista.filter(r => {
            const campos = [r.nome,r.matricula,r.email,r.cargo,r.unidade,
                            r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5,r.status]
                           .map(v => (v||'').toLowerCase());
            return campos.some(c => c.includes(busca));
        });
    }

    const ordens = {
        recente: (a,b) => new Date(b.data_criacao) - new Date(a.data_criacao),
        antigo:  (a,b) => new Date(a.data_criacao) - new Date(b.data_criacao),
    };
    lista.sort(ordens[ordemA] || ordens.recente);

    renderizarCardsAnalise(lista);
}

function debounceSearch() {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(() => { aplicarFiltros(); aplicarFiltrosAnalise(); }, 280);
}

function debounceAnalise() {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(aplicarFiltrosAnalise, 280);
}

function limparFiltros() {
    ['filterStatus','filterVinculo','filterCargo','filterUnidade','filterInteresse','orderData']
        .forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    ['filterDateStart','filterDateEnd','dbSearch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    aplicarFiltros();
}

// ── Tabela com paginação ──────────────────────────────────────
function renderizarTabela() {
    const tbody  = document.getElementById('dbContent');
    if (!tbody) return;
    const inicio = (paginaAtual - 1) * tamanhoPagina;
    const pagina = registrosFiltrados.slice(inicio, inicio + tamanhoPagina);
    tbody.innerHTML = '';

    if (!pagina.length) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;padding:30px;color:#888">Nenhum registro encontrado.</td></tr>';
        atualizarPaginacao(); document.getElementById('rowCount').innerText = '0'; return;
    }

    const badgeCls = { 'Em Análise':'badge-em-analise','Deferido':'badge-deferido','Indeferido':'badge-indeferido','Contemplado':'badge-contemplado' };

    pagina.forEach(r => {
        const tr = document.createElement('tr');
        tr.dataset.id = r.id;
        tr.innerHTML = `
            <td class="col-check"><input type="checkbox" class="row-check" value="${r.id}" onchange="verificarSelecao()"></td>
            <td>${r.nome||'—'}</td><td>${r.email||'—'}</td><td>${r.matricula||'—'}</td>
            <td>${r.vinculo||'—'}</td><td>${r.cargo||'—'}</td><td>${r.unidade||'—'}</td>
            <td>${r.opcao1||'—'}</td><td>${r.opcao2||'—'}</td><td>${r.opcao3||'—'}</td>
            <td>${r.opcao4||'—'}</td><td>${r.opcao5||'—'}</td>
            <td><span class="status-mini ${badgeCls[r.status]||'badge-em-analise'}">${r.status||'—'}</span></td>
            <td>${r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '—'}</td>
            <td>${r.data_edicao  ? new Date(r.data_edicao).toLocaleDateString('pt-BR')  : '—'}</td>`;
        tbody.appendChild(tr);
    });

    document.getElementById('rowCount').innerText = registrosFiltrados.length;
    atualizarPaginacao();
}

function atualizarPaginacao() {
    const total = Math.ceil(registrosFiltrados.length / tamanhoPagina) || 1;
    const info  = document.getElementById('pageInfo');
    if (info) info.textContent = `Página ${paginaAtual} de ${total}`;
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if (prev) prev.disabled = paginaAtual <= 1;
    if (next) next.disabled = paginaAtual >= total;
    const nums = document.getElementById('pageNumbers');
    if (!nums) return;
    nums.innerHTML = '';
    const max = Math.min(total, 5);
    let ini = Math.max(1, paginaAtual - 2);
    let fim = Math.min(total, ini + max - 1);
    if (fim - ini < max - 1) ini = Math.max(1, fim - max + 1);
    for (let i = ini; i <= fim; i++) {
        const btn = document.createElement('button');
        btn.className = `btn-page${i === paginaAtual ? ' active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { paginaAtual = i; renderizarTabela(); };
        nums.appendChild(btn);
    }
}

function paginaAnterior()     { if (paginaAtual > 1) { paginaAtual--; renderizarTabela(); } }
function proximaPagina()      { const t = Math.ceil(registrosFiltrados.length / tamanhoPagina); if (paginaAtual < t) { paginaAtual++; renderizarTabela(); } }
function mudarTamanhoPagina() { tamanhoPagina = parseInt(document.getElementById('pageSize').value); paginaAtual = 1; renderizarTabela(); }

// ── Seleção em massa ──────────────────────────────────────────
function toggleSelectAll() {
    const m = document.getElementById('selectAll');
    document.querySelectorAll('.row-check').forEach(c => c.checked = m.checked);
    verificarSelecao();
}
function verificarSelecao() {
    const n = document.querySelectorAll('.row-check:checked').length;
    const b = document.getElementById('bulkActions');
    if (b) b.style.display = n > 0 ? 'flex' : 'none';
}
async function massaExcluir() {
    const ids = [...document.querySelectorAll('.row-check:checked')].map(c => parseInt(c.value));
    if (!ids.length) return;
    if (!confirm(`⚠️ Você está prestes a EXCLUIR PERMANENTEMENTE ${ids.length} registro(s).\n\nEsta ação NÃO PODE SER DESFEITA e você é responsável pela exclusão de dados oficiais.\n\nTem certeza absoluta?`)) return;
    const res = await Promise.all(ids.map(id => API.delete(API.ENDPOINTS.SOLICITACAO_BY_ID, { id })));
    const falhas = res.filter(r => !r.ok).length;
    if (falhas) alert(`${falhas} exclusão(ões) falharam.`);
    await carregarSolicitacoes();
    document.getElementById('bulkActions').style.display = 'none';
    document.getElementById('selectAll').checked = false;
}

// ── Exportar ──────────────────────────────────────────────────
function exportarCSV() {
    const cab = ['Nome','E-mail','Matrícula','Vínculo','Cargo','Unidade Atual',
                 'Prioridade 1','Prioridade 2','Prioridade 3','Prioridade 4','Prioridade 5',
                 'Status','Data Pedido','Data Edição','Data Contemplação','Unidade Deferida'];
    const rows = registrosFiltrados.map(r => [
        r.nome,r.email,r.matricula,r.vinculo,r.cargo,r.unidade,
        r.opcao1||'',r.opcao2||'',r.opcao3||'',r.opcao4||'',r.opcao5||'',r.status||'',
        r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '',
        r.data_edicao  ? new Date(r.data_edicao).toLocaleDateString('pt-BR')  : '',
        r.data_contemplacao ? new Date(r.data_contemplacao).toLocaleDateString('pt-BR') : '',
        r.unidade_deferida||'',
    ]);
    const esc = v => `"${String(v).replace(/"/g,'""')}"`;
    const csv = [cab, ...rows].map(r => r.map(esc).join(',')).join('\n');
    const uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv);
    const a = Object.assign(document.createElement('a'), { href: uri, download: `solicitacoes_sms_${new Date().toISOString().slice(0,10)}.csv` });
    document.body.appendChild(a); a.click(); a.remove();
}

function exportarXLSX() {
    if (typeof XLSX === 'undefined') { alert('Biblioteca XLSX não carregada. Verifique sua conexão.'); return; }
    const cab = ['Nome','E-mail','Matrícula','Vínculo','Cargo','Unidade Atual',
                 'Prioridade 1','Prioridade 2','Prioridade 3','Prioridade 4','Prioridade 5',
                 'Status','Data Pedido','Data Edição','Data Contemplação','Unidade Deferida'];
    const rows = registrosFiltrados.map(r => [
        r.nome,r.email,r.matricula,r.vinculo,r.cargo,r.unidade,
        r.opcao1||'',r.opcao2||'',r.opcao3||'',r.opcao4||'',r.opcao5||'',r.status||'',
        r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '',
        r.data_edicao  ? new Date(r.data_edicao).toLocaleDateString('pt-BR')  : '',
        r.data_contemplacao ? new Date(r.data_contemplacao).toLocaleDateString('pt-BR') : '',
        r.unidade_deferida||'',
    ]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([cab, ...rows]);
    ws['!cols'] = [{wch:30},{wch:35},{wch:12},{wch:12},{wch:28},{wch:40},
                   {wch:40},{wch:40},{wch:25},{wch:25},{wch:25},
                   {wch:14},{wch:14},{wch:14},{wch:20},{wch:40}];
    XLSX.utils.book_append_sheet(wb, ws, 'Solicitações');
    XLSX.writeFile(wb, `solicitacoes_sms_${new Date().toISOString().slice(0,10)}.xlsx`);
}

function exportarRelatorio(fmt) { fmt === 'csv' ? exportarCSV() : exportarXLSX(); }

// ── Cards de análise ──────────────────────────────────────────
function renderizarCardsAnalise(lista) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    const dados = lista || registrosFiltrados;
    container.innerHTML = '';
    if (!dados.length) {
        container.innerHTML = '<p style="color:#888;grid-column:1/-1">Nenhuma solicitação encontrada.</p>';
        return;
    }
    const badgeCls = { 'Em Análise':'em-analise','Deferido':'deferido','Indeferido':'indeferido','Contemplado':'contemplado' };
    dados.forEach(r => {
        const cls = badgeCls[r.status] || 'em-analise';
        const card = document.createElement('div');
        card.className = 'card card-pedido';
        card.innerHTML = `
            <div class="info-principal">
                <div class="cargo-tag">${r.cargo||''}</div>
                <div class="nome">${r.nome||'—'}</div>
                <p><strong>Matrícula:</strong> ${r.matricula||'—'}</p>
                <p><strong>Unidade Atual:</strong> ${r.unidade||'—'}</p>
                <p><strong>1ª Opção:</strong> ${r.opcao1||'—'}</p>
                <p style="font-size:.8rem;color:#999;margin-top:6px;">
                    Pedido: ${r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '—'}
                    ${r.data_edicao ? ` · Editado: ${new Date(r.data_edicao).toLocaleDateString('pt-BR')}` : ''}
                </p>
            </div>
            <div class="status-badge ${cls}" style="margin-top:12px;">${r.status||'Em Análise'}</div>
            <div style="display:flex;gap:8px;margin-top:12px;">
                <button class="btn-primary" style="flex:1" onclick="abrirDetalhes(${r.id})">Analisar</button>
                <button class="btn-excluir-card" onclick="excluirPedidoCard(${r.id})" title="Excluir pedido">🗑</button>
            </div>`;
        container.appendChild(card);
    });
}

// ── Excluir na análise ────────────────────────────────────────
async function excluirPedidoCard(id) {
    const r = registros.find(p => p.id === id);
    if (!confirm(`⚠️ EXCLUSÃO PERMANENTE DE DADO OFICIAL\n\nVocê está prestes a excluir o pedido de "${r?.nome || 'servidor'}" (${r?.protocolo || ''}).\n\nEsta ação é IRREVERSÍVEL e você é responsável pela exclusão.\n\nTem certeza absoluta?`)) return;
    const res = await API.delete(API.ENDPOINTS.SOLICITACAO_BY_ID, { id });
    if (!res.ok) { alert('Erro ao excluir. Tente novamente.'); return; }
    alert('Pedido excluído com sucesso.');
    await carregarSolicitacoes();
}

// ── Modal de análise ──────────────────────────────────────────
function abrirDetalhes(id) {
    const r = registros.find(p => p.id === id);
    if (!r) return;
    pedidoSelecionadoId = id;

    document.getElementById('modalBody').innerHTML = `
        <div class="info-group">
            <h4 class="form-section-title">Dados do Servidor</h4>
            <p><strong>Nome:</strong> ${r.nome||'—'}</p>
            <p><strong>Matrícula:</strong> ${r.matricula||'—'}</p>
            <p><strong>Cargo:</strong> ${r.cargo||'—'}</p>
            <p><strong>Vínculo:</strong> ${r.vinculo||'—'}</p>
            <p><strong>Unidade Atual:</strong> ${r.unidade||'—'}</p>
            <p><strong>E-mail:</strong> ${r.email||'—'}</p>
            <p><strong>Data Pedido:</strong> ${r.data_criacao ? new Date(r.data_criacao).toLocaleDateString('pt-BR') : '—'}</p>
            ${r.data_edicao ? `<p><strong>Última Edição:</strong> ${new Date(r.data_edicao).toLocaleDateString('pt-BR')}</p>` : ''}
        </div>
        <div class="info-group">
            <h4 class="form-section-title">Prioridades Solicitadas</h4>
            <ol style="padding-left:18px;">
                ${[r.opcao1,r.opcao2,r.opcao3,r.opcao4,r.opcao5].filter(Boolean).map(o=>`<li style="margin-bottom:6px">${o}</li>`).join('') || '<li>—</li>'}
            </ol>
            ${r.curriculo_url ? `<a href="${r.curriculo_url}" target="_blank" class="link-documento" style="display:inline-block;margin-top:10px">📄 Ver Currículo</a>` : ''}
            ${r.justificativa ? `<div style="margin-top:12px;padding:10px;background:#f8fafc;border-radius:6px;font-size:.9rem"><strong>Justificativa anterior:</strong><br>${r.justificativa}</div>` : ''}
        </div>`;

    // Campos de deferimento
    const dcVal = r.data_contemplacao ? new Date(r.data_contemplacao).toISOString().slice(0,10) : '';
    document.getElementById('inputDataContemplacao').value = dcVal;
    document.getElementById('inputUnidadeDeferida').value  = r.unidade_deferida || '';
    if (r.unidade_deferida || dcVal) {
        document.getElementById('modalDeferimento').style.display = 'block';
    } else {
        document.getElementById('modalDeferimento').style.display = 'none';
    }

    document.getElementById('justificativa').value = r.justificativa || '';
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
    pedidoSelecionadoId = null;
}

async function atualizarStatus(novoStatus) {
    if (!pedidoSelecionadoId) return;
    const justificativa = document.getElementById('justificativa')?.value.trim() || '';

    const payload = { status: novoStatus, justificativa: justificativa || undefined };

    if (novoStatus === 'Deferido') {
        const dc = document.getElementById('inputDataContemplacao')?.value;
        const ud = document.getElementById('inputUnidadeDeferida')?.value?.trim();
        if (!dc) { alert('Por favor, informe a data prevista de contemplação antes de deferir.'); return; }
        payload.data_contemplacao = dc;
        if (ud) payload.unidade_deferida = ud;
    }

    const res = await API.patch(API.ENDPOINTS.SOLICITACAO_STATUS, payload, { id: pedidoSelecionadoId });
    if (!res.ok) { alert(res.data?.message || 'Erro ao atualizar status.'); return; }

    const idx = registros.findIndex(p => p.id === pedidoSelecionadoId);
    if (idx !== -1) {
        registros[idx] = { ...registros[idx], ...res.data,
            justificativa: justificativa || registros[idx].justificativa };
    }

    alert(`✅ Pedido atualizado para "${novoStatus}" com sucesso!`);
    fecharModal();
    aplicarFiltros();
    aplicarFiltrosAnalise();
}

// Mostrar/ocultar campos de deferimento ao clicar em Deferir
function prepararDeferimento() {
    const area = document.getElementById('modalDeferimento');
    if (area) area.style.display = area.style.display === 'none' ? 'block' : 'block';
    atualizarStatus('Deferido');
}

// ── Histórico de um servidor (admin olha no modal) ────────────
async function verHistoricoServidor(usuarioId, nomeServidor) {
    const res = await API.get(API.ENDPOINTS.HISTORICO_BY_USUARIO, { id: usuarioId });
    if (!res.ok) { alert('Erro ao carregar histórico.'); return; }

    const itens = res.data;
    const html = itens.length
        ? itens.map(s => `
            <div style="border:1px solid #eee;border-radius:8px;padding:12px;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                    <span class="status-mini badge-${(s.status||'em-analise').toLowerCase().replace(' ','-')}">${s.status}</span>
                    <span style="font-size:.85rem;color:#888">${s.protocolo} — ${s.data_criacao ? new Date(s.data_criacao).toLocaleDateString('pt-BR') : '—'}</span>
                </div>
                <p style="margin:3px 0;font-size:.9rem"><strong>1ª Opção:</strong> ${s.opcao1||'—'}</p>
                ${s.unidade_deferida ? `<p style="margin:3px 0;font-size:.9rem"><strong>Unidade Deferida:</strong> ${s.unidade_deferida}</p>` : ''}
                ${s.data_contemplacao ? `<p style="margin:3px 0;font-size:.9rem"><strong>Contemplação:</strong> ${new Date(s.data_contemplacao).toLocaleDateString('pt-BR')}</p>` : ''}
                ${s.justificativa ? `<p style="margin:3px 0;font-size:.85rem;color:#666">${s.justificativa}</p>` : ''}
            </div>`).join('')
        : '<p style="color:#888">Nenhum pedido encontrado.</p>';

    // Usa o modal de detalhes para exibir o histórico
    document.getElementById('modalBody').innerHTML = `<div class="info-group" style="grid-column:1/-1"><h4 class="form-section-title">Histórico de ${nomeServidor}</h4>${html}</div>`;
    document.getElementById('modalDeferimento').style.display = 'none';
    document.querySelector('.modal-footer').style.display = 'none';
    pedidoSelecionadoId = null;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

// ── Perfil do admin ───────────────────────────────────────────
async function carregarPerfil() {
    const res = await API.get(API.ENDPOINTS.PERFIL);
    if (!res.ok) return;
    const p = res.data;
    ['edit-nome','edit-matricula','edit-email','edit-telefone','edit-admissao','vinculo']
        .forEach(id => { const el = document.getElementById(id.replace('edit-','')==='matricula'?id:id); if (el && p[id.replace('edit-','')]) el.value = p[id.replace('edit-','')]; });
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set('edit-nome', p.nome); set('edit-matricula', p.matricula);
    set('edit-email', p.email); set('edit-telefone', p.telefone);
    set('edit-admissao', p.admissao); set('vinculo', p.vinculo);
    window._adminPerfil = p;
}

async function salvarPerfil(e) {
    e.preventDefault();
    const senha = document.getElementById('new-pass')?.value || '';
    const conf  = document.getElementById('confirm-new-pass')?.value || '';
    if (senha && senha !== conf) { alert('As senhas não coincidem!'); return; }
    if (senha && senha.length < 6) { alert('Mínimo 6 caracteres.'); return; }
    const btn = e.target.querySelector('.btn-secondary');
    if (btn) { btn.textContent = 'Salvando...'; btn.disabled = true; }
    const res = await API.patch(API.ENDPOINTS.PERFIL_UPDATE, {
        nome:     document.getElementById('edit-nome')?.value.trim(),
        email:    document.getElementById('edit-email')?.value.trim(),
        telefone: document.getElementById('edit-telefone')?.value.trim(),
        cargo:    document.getElementById('edit-cargo')?.value,
        vinculo:  document.getElementById('vinculo')?.value,
        unidade:  document.getElementById('edit-unidade')?.value,
        admissao: document.getElementById('edit-admissao')?.value,
        ...(senha ? { novaSenha: senha } : {}),
    });
    if (btn) { btn.textContent = 'Salvar Alterações'; btn.disabled = false; }
    if (!res.ok) { alert(res.data?.message || 'Erro ao salvar.'); return; }
    alert('✅ Perfil atualizado!');
}

// ── Populações auxiliares ─────────────────────────────────────
async function popularFiltros() {
    let cargos = [], unidades = [];
    try {
        const [rc, ru] = await Promise.all([API.get(API.ENDPOINTS.CARGOS), API.get(API.ENDPOINTS.UNIDADES)]);
        if (rc.ok) cargos = rc.data;
        if (ru.ok) { unidades = ru.data; unidadesLista = unidades; }
    } catch {}
    const preencher = (id, lista) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        [...lista].sort().forEach(item => {
            const opt = document.createElement('option');
            opt.value = item; opt.textContent = item; sel.appendChild(opt);
        });
    };
    preencher('filterCargo', cargos);
    preencher('filterUnidade', unidades);
    preencher('filterInteresse', unidades);
    preencher('edit-cargo', cargos);
    preencher('edit-unidade', unidades);

    // Preencher select de unidade deferida no modal
    const selUD = document.getElementById('inputUnidadeDeferida');
    // Deixar como input texto (mais flexível para admin)
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
            document.getElementById(item.dataset.target)?.classList.add('active');
            if (item.dataset.target === 'analise-pedidos') {
                document.querySelector('.modal-footer') && (document.querySelector('.modal-footer').style.display = '');
                aplicarFiltrosAnalise();
            }
        });
    });
}

function iniciarFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const a = btn.nextElementSibling;
            const ab = a.style.display === 'block';
            document.querySelectorAll('.faq-answer').forEach(x => x.style.display = 'none');
            a.style.display = ab ? 'none' : 'block';
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
    await popularFiltros();
    await Promise.all([carregarSolicitacoes(), carregarPerfil()]);
    if (window._adminPerfil) {
        const sc = document.getElementById('edit-cargo');
        const su = document.getElementById('edit-unidade');
        if (sc && window._adminPerfil.cargo)   sc.value = window._adminPerfil.cargo;
        if (su && window._adminPerfil.unidade) su.value = window._adminPerfil.unidade;
    }
    document.getElementById('updateProfileForm')?.addEventListener('submit', salvarPerfil);
    iniciarNavegacao(); iniciarFAQ(); iniciarMenuMobile();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { fecharModal(); } });
});