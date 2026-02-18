// Lista de locais (reutilizada para o cadastro)
const locaisRaw = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS', 'BANCO DE LEITE HUMANO', 'CAPS I NORTE', 'CAPS I SUL', 'CAPS AD NORTE', 'CAPS I CENTRO', 'CAPS II CENTRO', 'CAPS II SUL', 'CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)', 'CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)', 'CENTRO DE CONTROLE DE ZOONOSES', 'CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)', 'CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)', 'CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)', 'CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)', 'CENTRO ESPECIALIZADO EM REABILITAÇÃO', 'CENTRO MÉDICO DE ESPECIALIDADES', 'COMPLEXO REGULADOR', 'CONSELHO MUNICIPAL DE SAUDE', 'COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)', 'COORDENADORIA DE ÁREA TÉCNICA', 'COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO', 'COORDENADORIA DE RECURSOS HUMANOS', 'DEPARTAMENTO ADMINISTRATIVO', 'DEPARTAMENTO DE APOIO JURÍDICO', 'DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA', 'DEPARTAMENTO ATENÇÃO BÁSICA', 'DEPARTAMENTO ATENÇÃO ESPECIALIZADA', 'DEPARTAMENTO PLANEJAMENTO', 'DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS', 'DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)', 'DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO', 'DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA', 'DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)', 'FARMÁCIA CENTRAL', 'FARMÁCIA MUNICIPAL', 'FARMÁCIA MUNICIPAL NORTE', 'GABINETE', 'GERÊNCIA DE COMPRAS', 'GERÊNCIA DE IMUNIZAÇÃO', 'GERÊNCIA DE MANUTENÇÃO', 'GERÊNCIA DE SUPRIMENTOS', 'GERÊNCIA DE TRANSPORTES', 'LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA', 'NÚCLEO DE EDUCAÇÃO EM SAÚDE', 'OUVIDORIA', 'SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)', 'SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)', 'SETOR CENTRAL DE REMOÇÃO', 'TELEMEDICINA', 'VIGILÂNCIA AMBIENTAL', 'VIGILÂNCIA EPIDEMIOLÓGICA', 'VIGILÂNCIA SANITÁRIA', 'UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA', 'UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL', 'UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI', 'UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM', 'UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO', 'UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT', 'UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS', 'UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER', 'UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE', 'UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL', 'UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO', 'UNIDADE BÁSICA DE SAÚDE - UBS TALHADO', 'UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR', 'UNIDADE BASICA DE SAUDE - UBS VILA TONINHO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ', 'UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE', 'UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL', 'PRONTO SOCORRO - PS VILA TONINHO', 'TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA', 'TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE', 'TODAS AS UNIDADES BÁSICAS DE SAÚDE', 'TODAS AS UNIDADES DE PRONTO ATENDIMENTO', 'CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE'];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Popular unidades no cadastro
    const selectUnidade = document.getElementById('reg_unidade');
    locaisRaw.sort().forEach(loc => {
        let opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        selectUnidade.appendChild(opt);
    });

    // 2. Alternar entre Login e Cadastro
    document.getElementById('showRegister').onclick = (e) => {
        e.preventDefault();
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('registerBox').style.display = 'block';
    };

    document.getElementById('showLogin').onclick = (e) => {
        e.preventDefault();
        document.getElementById('registerBox').style.display = 'none';
        document.getElementById('loginBox').style.display = 'block';
    };

    // 3. Simulação de Login
    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const user = document.getElementById('login_user').value;
        const pass = document.getElementById('login_pass').value;
        
        console.log("Tentativa de Login:", { user, pass });
        alert("Integrar com Back-end agora! Usuário: " + user);
        // window.location.href = "formulario.html"; // Redirecionar após sucesso
    };

    // 4. Simulação de Cadastro
    document.getElementById('registerForm').onsubmit = (e) => {
        e.preventDefault();
        const senha = document.getElementById('reg_pass').value;
        const confirma = document.getElementById('reg_pass_confirm').value;

        if(senha !== confirma) {
            alert("As senhas não coincidem!");
            return;
        }

        const dados = {
            nome: document.getElementById('reg_nome').value,
            matricula: document.getElementById('reg_matricula').value,
            email: document.getElementById('reg_email').value,
            unidade: document.getElementById('reg_unidade').value,
            senha: senha
        };

        console.log("Dados para Cadastro:", dados);
        alert("Cadastro realizado com sucesso! (Simulação)");
        document.getElementById('showLogin').click(); // Volta para o login
    };
});