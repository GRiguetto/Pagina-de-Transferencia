/**
 * ============================================================
 *  SMS RIO PRETO — CONFIGURAÇÃO CENTRAL DA API
 *  Arquivo: js/api.config.js
 *  Inclua este script em TODAS as páginas antes dos demais JS:
 *  <script src="js/api.config.js"></script>
 * ============================================================
 */

 const API = {
    // ── Troque pela URL real do seu servidor ──────────────────
    BASE_URL: 'https://api.sms-riopreto.sp.gov.br/v1',
    // BASE_URL: 'http://localhost:3000/v1',  // ← desenvolvimento local

    // ── Endpoints ─────────────────────────────────────────────
    ENDPOINTS: {
        // Auth
        LOGIN:              '/auth/login',
        LOGOUT:             '/auth/logout',
        REGISTER:           '/auth/register',
        REFRESH_TOKEN:      '/auth/refresh',

        // Servidor (usuário logado)
        PERFIL:             '/servidor/perfil',
        PERFIL_UPDATE:      '/servidor/perfil',          // PATCH
        CHANGE_PASSWORD:    '/servidor/senha',           // PATCH
        SOLICITACAO_ATUAL:  '/servidor/solicitacao',     // GET

        // Solicitações
        SOLICITACOES:       '/solicitacoes',             // GET (admin) / POST (user)
        SOLICITACAO_BY_ID:  '/solicitacoes/:id',         // GET / DELETE
        SOLICITACAO_STATUS: '/solicitacoes/:id/status',  // PATCH

        // Tabelas auxiliares (retornadas pelo back-end)
        CARGOS:             '/tabelas/cargos',
        UNIDADES:           '/tabelas/unidades',
    },

    // ── Tempo máximo por requisição (ms) ──────────────────────
    TIMEOUT: 10000,

    // ── Helpers ───────────────────────────────────────────────

    /**
     * Monta a URL completa, substituindo parâmetros de rota.
     * Ex: API.url('/solicitacoes/:id', { id: 42 })  → '.../solicitacoes/42'
     */
    url(endpoint, params = {}) {
        let path = endpoint;
        for (const [key, val] of Object.entries(params)) {
            path = path.replace(`:${key}`, encodeURIComponent(val));
        }
        return this.BASE_URL + path;
    },

    /**
     * Headers padrão (adiciona Authorization se houver token no sessionStorage)
     */
    headers(extra = {}) {
        const token = sessionStorage.getItem('sms_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...extra,
        };
    },

    /**
     * Wrapper fetch com timeout, tratamento de erros e renovação de token.
     * Retorna { ok, data, status, message }
     */
    async request(method, endpoint, body = null, routeParams = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.TIMEOUT);

        try {
            const options = {
                method,
                headers: this.headers(),
                signal: controller.signal,
            };
            if (body) options.body = JSON.stringify(body);

            const res = await fetch(this.url(endpoint, routeParams), options);
            clearTimeout(timer);

            // Token expirado → tenta renovar uma vez
            if (res.status === 401) {
                const renewed = await this._renewToken();
                if (renewed) return this.request(method, endpoint, body, routeParams);
                this._redirectLogin();
                return { ok: false, status: 401, message: 'Sessão expirada.' };
            }

            const data = res.headers.get('content-type')?.includes('application/json')
                ? await res.json()
                : await res.text();

            return { ok: res.ok, status: res.status, data, message: data?.message || '' };

        } catch (err) {
            clearTimeout(timer);
            if (err.name === 'AbortError') {
                return { ok: false, status: 408, message: 'Tempo de resposta excedido. Tente novamente.' };
            }
            console.error('[API] Erro de rede:', err);
            return { ok: false, status: 0, message: 'Sem conexão com o servidor.' };
        }
    },

    // Atalhos semânticos
    get:    (ep, params)       => API.request('GET',    ep, null, params),
    post:   (ep, body)         => API.request('POST',   ep, body),
    patch:  (ep, body, params) => API.request('PATCH',  ep, body, params),
    delete: (ep, params)       => API.request('DELETE', ep, null, params),

    // ── Upload de arquivo (multipart) ─────────────────────────
    async upload(endpoint, formData) {
        const token = sessionStorage.getItem('sms_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        try {
            const res = await fetch(this.BASE_URL + endpoint, {
                method: 'POST',
                headers, // SEM Content-Type: o browser define o boundary do multipart
                body: formData,
            });
            const data = await res.json();
            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            return { ok: false, status: 0, message: 'Falha no upload.' };
        }
    },

    // ── Internos ──────────────────────────────────────────────
    async _renewToken() {
        const refresh = sessionStorage.getItem('sms_refresh_token');
        if (!refresh) return false;
        try {
            const res = await fetch(this.BASE_URL + this.ENDPOINTS.REFRESH_TOKEN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refresh }),
            });
            if (!res.ok) return false;
            const { access_token } = await res.json();
            sessionStorage.setItem('sms_token', access_token);
            return true;
        } catch { return false; }
    },

    _redirectLogin() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    },
};