/**
 * ============================================================
 *  SMS RIO PRETO — CONFIGURAÇÃO CENTRAL DA API
 *  Arquivo: js/Api.config.js
 * ============================================================
 */
 const API = (() => {

    const BASE_URL = 'http://127.0.0.1:5000';

    const ENDPOINTS = {
        LOGIN:              '/auth/login',
        REGISTER:           '/auth/register',
        REFRESH:            '/auth/refresh',
        LOGOUT:             '/auth/logout',

        PERFIL:             '/servidor/perfil',
        PERFIL_UPDATE:      '/servidor/perfil',
        SOLICITACAO_ATUAL:  '/servidor/solicitacao',
        HISTORICO_USUARIO:  '/servidor/historico',

        SOLICITACOES:             '/solicitacoes',
        SOLICITACAO_BY_ID:        '/solicitacoes/:id',
        SOLICITACAO_EDITAR:       '/solicitacoes/:id',
        SOLICITACAO_STATUS:       '/solicitacoes/:id/status',
        HISTORICO_BY_USUARIO:     '/solicitacoes/historico-usuario/:id',

        UPLOAD_CURRICULO:   '/upload/curriculo',
        CARGOS:             '/tabelas/cargos',
        UNIDADES:           '/tabelas/unidades',
    };

    const getToken   = () => sessionStorage.getItem('sms_token');
    const getRefresh = () => sessionStorage.getItem('sms_refresh_token');

    function setTokens(access, refresh) {
        if (access)  sessionStorage.setItem('sms_token', access);
        if (refresh) sessionStorage.setItem('sms_refresh_token', refresh);
    }

    function clearSession() {
        sessionStorage.removeItem('sms_token');
        sessionStorage.removeItem('sms_refresh_token');
        sessionStorage.removeItem('sms_usuario');
    }

    function resolveUrl(endpoint, params = {}) {
        let url = BASE_URL + endpoint;
        Object.entries(params).forEach(([k, v]) => {
            url = url.replace(`:${k}`, encodeURIComponent(v));
        });
        return url;
    }

    function headers(extra = {}) {
        const token = getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...extra,
        };
    }

    async function request(method, endpoint, body = null, routeParams = {}) {
        const url  = resolveUrl(endpoint, routeParams);
        const opts = {
            method,
            headers: headers(),
            signal:  AbortSignal.timeout(15000),
        };
        if (body && method !== 'GET') opts.body = JSON.stringify(body);

        let res = await fetch(url, opts);

        if (res.status === 401 && endpoint !== ENDPOINTS.LOGIN && endpoint !== ENDPOINTS.REFRESH) {
            const rt = getRefresh();
            if (rt) {
                const rr = await fetch(BASE_URL + ENDPOINTS.REFRESH, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: rt }),
                });
                if (rr.ok) {
                    const { access_token } = await rr.json();
                    setTokens(access_token, null);
                    opts.headers = headers();
                    res = await fetch(url, opts);
                } else {
                    clearSession();
                    window.location.href = 'index.html';
                    return { ok: false, status: 401, data: null, message: 'Sessão expirada.' };
                }
            } else {
                clearSession();
                window.location.href = 'index.html';
                return { ok: false, status: 401, data: null, message: 'Sessão expirada.' };
            }
        }

        let data = null;
        const ct = res.headers.get('Content-Type') || '';
        if (ct.includes('application/json')) {
            try { data = await res.json(); } catch { data = null; }
        }

        return { ok: res.ok, status: res.status, data, message: data?.message || '' };
    }

    // Upload multipart
    async function uploadFile(endpoint, formData) {
        const token = getToken();
        const res = await fetch(BASE_URL + endpoint, {
            method:  'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body:    formData,
            signal:  AbortSignal.timeout(30000),
        });
        let data = null;
        try { data = await res.json(); } catch { data = null; }
        return { ok: res.ok, status: res.status, data, message: data?.message || '' };
    }

    return {
        BASE_URL, ENDPOINTS,
        setTokens, clearSession,
        get:    (ep, params = {})       => request('GET',    ep, null, params),
        post:   (ep, body, params = {}) => request('POST',   ep, body, params),
        patch:  (ep, body, params = {}) => request('PATCH',  ep, body, params),
        delete: (ep, params = {})       => request('DELETE', ep, null, params),
        upload: uploadFile,       // alias para retro-compatibilidade com formulario.js
        uploadFile,               // nome oficial
    };
})();