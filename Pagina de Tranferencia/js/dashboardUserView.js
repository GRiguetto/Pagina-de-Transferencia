// Listas extraídas do seu projeto original para manter a consistência
const cargosRaw = ['MÉDICO PEDIATRA PLANTONISTA', 'MÉDICO ORTOPEDISTA PLANTONISTA', 'MÉDICO CLINICO GERAL PLANTONISTA', 'MÉDICO CLINICO GERAL HORISTA', 'MÉDICO ESPECIALISTA', 'INTERPRETE DE LIBRAS', 'FONOAUDIÓLOGO', 'FISIOTERAPEUTA', 'FARMACÊUTICO', 'ENGENHEIROS E ARQUITETOS', 'ENFERMEIRO', 'EDUCADOR FÍSICO', 'DIGITADOR E OPERADOR DE COMPUTADOR', 'DENTISTA', 'BIOMÉDICO', 'BIOLOGO', 'AUXILIAR E TÉCNICO EM LABORATÓRIO', 'AUXILIAR E TÉCNICO EM ENFERMAGEM', 'AUXILIAR VETERINÁRIO', 'AUXILIAR DE SAÚDE BUCAL', 'ASSISTENTE SOCIAL', 'ARTESÃO', 'ANALISTA EM VIGILÂNCIA SANITÁRIA', 'ANALISTA DE TI', 'AGENTE SOCIAL', 'AGENTE DE COMBATE AS ENDEMIAS', 'AGENTE COMUNITARIO DE SAUDE', 'ADVOGADO', 'ADMINISTRATIVO', 'ADMINISTRADOR HOSPITALAR', 'MEDICO SAUDE DA FAMILIA', 'MEDICO VETERINARIO', 'NUTRICIONISTA', 'PSICOLOGO', 'TECNICO ADMINISTRATIVO EM SAUDE PUBLICA', 'TECNICO EM FARMACIA', 'TECNICO EM RADIOLOGIA', 'TECNICO ENGESSADOR', 'TERAPEUTA OCUPACIONAL'];

const locaisRaw = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS', 'BANCO DE LEITE HUMANO', 'CAPS I NORTE', 'CAPS I SUL', 'CAPS AD NORTE', 'CAPS I CENTRO', 'CAPS II CENTRO', 'CAPS II SUL', 'CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)', 'CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)', 'CENTRO DE CONTROLE DE ZOONOSES', 'CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)', 'CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)', 'CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)', 'CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)', 'CENTRO ESPECIALIZADO EM REABILITAÇÃO', 'CENTRO MÉDICO DE ESPECIALIDADES', 'COMPLEXO REGULADOR', 'CONSELHO MUNICIPAL DE SAUDE', 'COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)', 'COORDENADORIA DE ÁREA TÉCNICA', 'COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO', 'COORDENADORIA DE RECURSOS HUMANOS', 'DEPARTAMENTO ADMINISTRATIVO', 'DEPARTAMENTO DE APOIO JURÍDICO', 'DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA', 'DEPARTAMENTO ATENÇÃO BÁSICA', 'DEPARTAMENTO ATENÇÃO ESPECIALIZADA', 'DEPARTAMENTO PLANEJAMENTO', 'DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS', 'DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)', 'DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO', 'DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA', 'DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)', 'FARMÁCIA CENTRAL', 'FARMÁCIA MUNICIPAL', 'FARMÁCIA MUNICIPAL NORTE', 'GABINETE', 'GERÊNCIA DE COMPRAS', 'GERÊNCIA DE IMUNIZAÇÃO', 'GERÊNCIA DE MANUTENÇÃO', 'GERÊNCIA DE SUPRIMENTOS', 'GERÊNCIA DE TRANSPORTES', 'LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA', 'NÚCLEO DE EDUCAÇÃO EM SAÚDE', 'OUVIDORIA', 'SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)', 'SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)', 'SETOR CENTRAL DE REMOÇÃO', 'TELEMEDICINA', 'VIGILÂNCIA AMBIENTAL', 'VIGILÂNCIA EPIDEMIOLÓGICA', 'VIGILÂNCIA SANITÁRIA', 'UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA', 'UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL', 'UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI', 'UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM', 'UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO', 'UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT', 'UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS', 'UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER', 'UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE', 'UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL', 'UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO', 'UNIDADE BÁSICA DE SAÚDE - UBS TALHADO', 'UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR', 'UNIDADE BASICA DE SAUDE - UBS VILA TONINHO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ', 'UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE', 'UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL', 'PRONTO SOCORRO - PS VILA TONINHO', 'TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA', 'TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE', 'TODAS AS UNIDADES BÁSICAS DE SAÚDE', 'TODAS AS UNIDADES DE PRONTO ATENDIMENTO', 'CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE'];

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. POPULAR DROPDOWNS DO PERFIL
    const selectCargo = document.getElementById('edit-cargo');
    const selectUnidade = document.getElementById('edit-unidade');

    function popular(select, dados) {
        if (!select) return;
        const ordenados = [...new Set(dados)].sort();
        ordenados.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
    }

    popular(selectCargo, cargosRaw);
    popular(selectUnidade, locaisRaw);

    // 2. NAVEGAÇÃO ENTRE ABAS (SIDEBAR)
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('logout')) return; // Deixa o link de sair funcionar normal
            e.preventDefault();

            // Alternar classes
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            item.classList.add('active');
            const target = item.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // 3. FAQ ACCORDION (ABRIR/FECHAR)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const isOpen = answer.style.display === 'block';

            // Fecha todos antes de abrir o atual
            document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
            
            answer.style.display = isOpen ? 'none' : 'block';
        });
    });

    // 4. SIMULAÇÃO DE ATUALIZAÇÃO DE PERFIL
    const profileForm = document.getElementById('updateProfileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validação simples de senha
            const senha = document.getElementById('new-pass').value;
            const confirma = document.getElementById('confirm-new-pass').value;

            if (senha !== confirma) {
                alert("As novas senhas não coincidem!");
                return;
            }

            // Objeto pronto para o Back-end
            const dadosAtualizados = {
                nome: document.getElementById('edit-nome').value,
                matricula: document.getElementById('edit-matricula').value,
                email: document.getElementById('edit-email').value,
                telefone: document.getElementById('edit-telefone').value,
                cargo: document.getElementById('edit-cargo').value,
                vinculo: document.getElementById('edit-vinculo').value,
                unidade: document.getElementById('edit-unidade').value,
                admissao: document.getElementById('edit-admissao').value,
                novaSenha: senha || null // Só envia se preenchido
            };

            console.log("Dados prontos para atualização:", dadosAtualizados);
            alert("Perfil atualizado com sucesso! (Simulação)");
            
            // Limpar campos de senha após sucesso
            document.getElementById('new-pass').value = '';
            document.getElementById('confirm-new-pass').value = '';
        });
    }
});

// Adicione isso dentro do seu document.addEventListener('DOMContentLoaded', ...)
const menuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');

// Criar um overlay dinamicamente para fechar o menu ao clicar fora
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Pequena animação no ícone do sanduíche (opcional)
        menuToggle.classList.toggle('open');
    });
}

// Fechar o menu ao clicar no overlay ou em um item do menu
[overlay, ...document.querySelectorAll('.menu-item')].forEach(el => {
    el.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});