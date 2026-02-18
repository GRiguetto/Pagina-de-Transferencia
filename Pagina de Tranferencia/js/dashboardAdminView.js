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

// Dados Mockados para desenvolvimento (Substituir pela chamada da API no futuro)
let bancoDeDados = [
    {
        id: 1,
        nome: "Gabriel Fernandes Riguetto",
        email: "gabriel.riguetto@riopreto.sp.gov.br",
        matricula: "123.456-7",
        vinculo: "Prefeitura",
        cargo: "ANALISTA DE TI",
        unidade: "DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO",
        data: "2026-02-18",
        opcao1: "UBS SOLO SAGRADO",
        opcao2: "UBS CENTRAL",
        opcao3: "UBS ESTORIL",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma",
        status:"Deferido"
    },
    {
        id: 2,
        nome: "Ana Beatriz Costa",
        email: "anabc@gmail.com",
        matricula: "987.654-3",
        vinculo: "Funfarme",
        cargo: "ENFERMEIRO",
        unidade: "UPA JAGUARÉ",
        data: "2026-02-10",
        opcao1: "UBS CENTRAL",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma",
        status:"Deferido"

    },
    {
        id: 3,
        nome: "Ricardo Oliveira Santos",
        email: "ricardo.santos@saude.sp.gov.br",
        matricula: "456.789-0",
        vinculo: "Estadual",
        cargo: "MÉDICO PEDIATRA PLANTONISTA",
        unidade: "HOSPITAL DIA",
        data: "2026-01-25",
        opcao1: "UPA REGIÃO NORTE",
        opcao2: "UPA SANTO ANTÔNIO",
        opcao3: "UPA TANGARÁ/ESTORIL",
        opcao4: "PRONTO SOCORRO - PS VILA TONINHO",
        opcao5: "UBS SOLO SAGRADO",
        status:"Deferido "
    },
    {
        id: 4,
        nome: "Juliana Mendes",
        email: "juliana.mendes@riopreto.sp.gov.br",
        matricula: "111.222-3",
        vinculo: "Prefeitura",
        cargo: "AGENTE COMUNITARIO DE SAUDE",
        unidade: "UBS ANCHIETA",
        data: "2026-02-05",
        opcao1: "UBS FRATERNIDADE",
        opcao2: "UBS LEALDADE E AMIZADE",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma",
        status:"Indeferido"
    },
    {
        id: 5,
        nome: "Marcos Paulo Silva",
        email: "mpsilva88@outlook.com",
        matricula: "333.444-5",
        vinculo: "Federal",
        cargo: "FISIOTERAPEUTA",
        unidade: "CENTRO ESPECIALIZADO EM REABILITAÇÃO",
        data: "2026-02-12",
        opcao1: "CAE",
        opcao2: "UBS CENTRAL",
        opcao3: "UBS ELDORADO",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma",
        status:"Em Análise"
    },
    {
        id: 6,
        nome: "Carla Souza Ferraz",
        email: "carla.ferraz@riopreto.sp.gov.br",
        matricula: "555.666-7",
        vinculo: "Prefeitura",
        cargo: "ADMINISTRATIVO",
        unidade: "COORDENADORIA DE RECURSOS HUMANOS",
        data: "2026-02-14",
        opcao1: "GABINETE",
        opcao2: "OUVIDORIA",
        opcao3: "DEPARTAMENTO ADMINISTRATIVO",
        opcao4: "COMPLEXO REGULADOR",
        opcao5: "Nenhuma"
    },
    {
        id: 7,
        nome: "Fernando Henrique Lima",
        email: "fernando.h.lima@gmail.com",
        matricula: "777.888-9",
        vinculo: "Funfarme",
        cargo: "AUXILIAR E TÉCNICO EM ENFERMAGEM",
        unidade: "UPA SANTO ANTÔNIO",
        data: "2026-01-30",
        opcao1: "SAMU",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 8,
        nome: "Patrícia Amorim",
        email: "pamorim@riopreto.sp.gov.br",
        matricula: "222.333-4",
        vinculo: "Prefeitura",
        cargo: "PSICOLOGO",
        unidade: "CAPS II SUL",
        data: "2026-02-01",
        opcao1: "CAPS AD NORTE",
        opcao2: "CAPS I CENTRO",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 9,
        nome: "Roberto Carlos Nunes",
        email: "roberto.nunes@bol.com.br",
        matricula: "888.999-0",
        vinculo: "Estadual",
        cargo: "MÉDICO CLINICO GERAL HORISTA",
        unidade: "UBS SOLO SAGRADO",
        data: "2025-12-20",
        opcao1: "UBS CENTRAL",
        opcao2: "UBS VILA TONINHO",
        opcao3: "UBS SÃO DEOCLECIANO",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 10,
        nome: "Lúcia Helena Rocha",
        email: "lucia.rocha@riopreto.sp.gov.br",
        matricula: "101.202-3",
        vinculo: "Prefeitura",
        cargo: "FONOAUDIÓLOGO",
        unidade: "CAE",
        data: "2026-02-16",
        opcao1: "CAESM",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 11,
        nome: "Sérgio Vieira",
        email: "sergio.vieira@riopreto.sp.gov.br",
        matricula: "303.404-5",
        vinculo: "Prefeitura",
        cargo: "AGENTE DE COMBATE AS ENDEMIAS",
        unidade: "CENTRO DE CONTROLE DE ZOONOSES",
        data: "2026-02-17",
        opcao1: "VIGILÂNCIA AMBIENTAL",
        opcao2: "VIGILÂNCIA SANITÁRIA",
        opcao3: "VIGILÂNCIA EPIDEMIOLÓGICA",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 12,
        nome: "Beatriz Nogueira",
        email: "bea.nogueira@gmail.com",
        matricula: "505.606-7",
        vinculo: "Funfarme",
        cargo: "FARMACÊUTICO",
        unidade: "FARMÁCIA CENTRAL",
        data: "2026-01-15",
        opcao1: "FARMÁCIA MUNICIPAL NORTE",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 13,
        nome: "André Luiz Pereira",
        email: "andre.pereira@saude.gov.br",
        matricula: "707.808-9",
        vinculo: "Federal",
        cargo: "DENTISTA",
        unidade: "CEO CENTRO",
        data: "2026-02-10",
        opcao1: "CEO NORTE",
        opcao2: "UBS SOLO SAGRADO",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 14,
        nome: "Mônica Aparecida",
        email: "maparecida@riopreto.sp.gov.br",
        matricula: "909.101-1",
        vinculo: "Prefeitura",
        cargo: "ASSISTENTE SOCIAL",
        unidade: "UBS FRATERNIDADE",
        data: "2026-02-08",
        opcao1: "UBS ANCHIETA",
        opcao2: "UBS CENTRAL",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 15,
        nome: "Gustavo Rossi",
        email: "grossi_med@hotmail.com",
        matricula: "112.233-4",
        vinculo: "Estadual",
        cargo: "MEDICO SAUDE DA FAMILIA",
        unidade: "UBS CIDADE JARDIM",
        data: "2026-01-05",
        opcao1: "UBS SOLO SAGRADO",
        opcao2: "UBS ELDORADO",
        opcao3: "UBS JARDIM AMERICANO",
        opcao4: "UBS JARDIM GABRIELA",
        opcao5: "UBS JARDIM MARIA LUCIA"
    },
    {
        id: 16,
        nome: "Simone Toledo",
        email: "stoledo@riopreto.sp.gov.br",
        matricula: "445.566-7",
        vinculo: "Prefeitura",
        cargo: "TECNICO ADMINISTRATIVO EM SAUDE PUBLICA",
        unidade: "OUVIDORIA",
        data: "2026-02-11",
        opcao1: "GABINETE",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 17,
        nome: "Jorge Amado Silva",
        email: "jsilva@gmail.com",
        matricula: "778.899-0",
        vinculo: "Funfarme",
        cargo: "AUXILIAR VETERINÁRIO",
        unidade: "CENTRO DE CONTROLE DE ZOONOSES",
        data: "2026-01-20",
        opcao1: "VIGILÂNCIA AMBIENTAL",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 18,
        nome: "Daniela Regina",
        email: "dregina@riopreto.sp.gov.br",
        matricula: "111.000-2",
        vinculo: "Prefeitura",
        cargo: "NUTRICIONISTA",
        unidade: "UBS CENTRAL",
        data: "2026-02-18",
        opcao1: "CAE",
        opcao2: "UBS SOLO SAGRADO",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 19,
        nome: "Claudio Duarte",
        email: "cduarte@saude.sp.gov.br",
        matricula: "222.000-3",
        vinculo: "Estadual",
        cargo: "MÉDICO ESPECIALISTA",
        unidade: "CAESM",
        data: "2026-02-03",
        opcao1: "HOSPITAL DIA",
        opcao2: "UBS CENTRAL",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    },
    {
        id: 20,
        nome: "Paula Fernandes",
        email: "pfernandes@riopreto.sp.gov.br",
        matricula: "333.000-4",
        vinculo: "Prefeitura",
        cargo: "BIOMÉDICO",
        unidade: "LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA",
        data: "2026-01-10",
        opcao1: "VIGILÂNCIA SANITÁRIA",
        opcao2: "Nenhuma",
        opcao3: "Nenhuma",
        opcao4: "Nenhuma",
        opcao5: "Nenhuma"
    }
];

let dadosFiltrados = [...bancoDeDados];
let itensSelecionados = new Set();
let ordenacaoAtual = { coluna: 'data', direcao: 'desc' };

document.addEventListener('DOMContentLoaded', () => {
    renderizarTabela();
    atualizarStatusSelecao();
});

// --- RENDERIZAÇÃO ---
function renderizarTabela() {
    const tbody = document.getElementById('dbContent');
    if (!tbody) return;

    // Limpa a tabela e o contador antes de renderizar
    tbody.innerHTML = '';
    
    dadosFiltrados.forEach(item => {
        const tr = document.createElement('tr');
        
        // Mantém a classe se estiver selecionado
        if (itensSelecionados.has(item.id)) tr.classList.add('row-selected');

        tr.innerHTML = `
            <td><input type="checkbox" class="row-check" ${itensSelecionados.has(item.id) ? 'checked' : ''} onclick="selecionarLinha(event, ${item.id})"></td>
            <td>
                ${item.nome} 
                <span class="badge badge-${item.status}" style="font-size: 0.6rem; margin-left: 5px;">
                    ${item.status}
                </span>
            </td>
            <td>${item.email}</td>
            <td>${item.matricula}</td>
            <td>${item.vinculo}</td>
            <td>${item.cargo}</td>
            <td>${item.unidade}</td>
            <td><span class="opt-value">${item.opcao1}</span></td>
            <td><span class="opt-value">${item.opcao2 || '-'}</span></td>
            <td><span class="opt-value">${item.opcao3 || '-'}</span></td>
            <td><span class="opt-value">${item.opcao4 || '-'}</span></td>
            <td><span class="opt-value">${item.opcao5 || '-'}</span></td>
            <td>${item.data}</td>
            <td>${item.edição || "-"}</td>
        `;
        tbody.appendChild(tr);
    });

    // Atualiza o contador de registros encontrados
    document.getElementById('rowCount').innerText = dadosFiltrados.length;
}

// --- FILTROS E BUSCA (COM DEBOUNCE) ---
let timeoutBusca;
function debounceSearch() {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(aplicarFiltros, 300);
}

function aplicarFiltros() {
    // 1. Captura de todos os inputs
    const termo = document.getElementById('dbSearch').value.toLowerCase();
    const vinculo = document.getElementById('filterVinculo').value;
    const cargo = document.getElementById('filterCargo').value;
    const unidade = document.getElementById('filterUnidade').value;
    const interesse = document.getElementById('filterInteresse').value;
    const status = document.getElementById('filterStatus').value; // Novo capturador
    const dataInicio = document.getElementById('filterDateStart').value;
    const dataFim = document.getElementById('filterDateEnd').value;
    const ordem = document.getElementById('orderData').value;

    // 2. Filtragem
    dadosFiltrados = bancoDeDados.filter(item => {
        const matchesSearch = item.nome.toLowerCase().includes(termo) || 
                              item.matricula.includes(termo);
        
        const matchesVinculo = vinculo === 'todos' || item.vinculo === vinculo;
        const matchesCargo = cargo === 'todos' || item.cargo === cargo;
        const matchesUnidade = unidade === 'todos' || item.unidade === unidade;
        const matchesStatus = status === 'todos' || item.status === status; // Lógica do status
        
        const matchesInteresse = interesse === 'todos' || 
            [item.opcao1, item.opcao2, item.opcao3, item.opcao4, item.opcao5].includes(interesse);

        const matchesData = (!dataInicio || item.data >= dataInicio) && 
                            (!dataFim || item.data <= dataFim);

        return matchesSearch && matchesVinculo && matchesCargo && 
               matchesUnidade && matchesStatus && matchesInteresse && matchesData;
    });

    // 3. Ordenação (Mantendo a lógica de prioridade por interesse)
    dadosFiltrados.sort((a, b) => {
        if (interesse !== 'todos') {
            const nivelPrioridade = (item) => {
                if (item.opcao1 === interesse) return 1;
                if (item.opcao2 === interesse) return 2;
                if (item.opcao3 === interesse) return 3;
                if (item.opcao4 === interesse) return 4;
                if (item.opcao5 === interesse) return 5;
                return 99;
            };
            const pA = nivelPrioridade(a);
            const pB = nivelPrioridade(b);
            if (pA !== pB) return pA - pB;
        }

        switch (ordem) {
            case 'recente': return new Date(b.data) - new Date(a.data);
            case 'antigo': return new Date(a.data) - new Date(b.data);
            case 'nomeAZ': return a.nome.localeCompare(b.nome);
            case 'nomeZA': return b.nome.localeCompare(a.nome);
            case 'matricula': return a.matricula.localeCompare(b.matricula);
            default: return 0;
        }
    });

    renderizarTabela();
}

// Função auxiliar para popular os selects de filtros no carregamento
function popularFiltrosSelects() {
    const selCargo = document.getElementById('filterCargo');
    const selUnidade = document.getElementById('filterUnidade');

    if (selCargo && typeof cargosRaw !== 'undefined') {
        cargosRaw.sort().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            selCargo.appendChild(opt);
        });
    }

    if (selUnidade && typeof locaisRaw !== 'undefined') {
        locaisRaw.sort().forEach(l => {
            const opt = document.createElement('option');
            opt.value = l;
            opt.textContent = l;
            selUnidade.appendChild(opt);
        });
    }
}

// Função para resetar tudo
function limparFiltros() {
    document.getElementById('dbSearch').value = '';
    document.getElementById('filterVinculo').value = 'todos';
    document.getElementById('filterCargo').value = 'todos';
    document.getElementById('filterUnidade').value = 'todos';
    document.getElementById('filterDateStart').value = '';
    document.getElementById('filterDateEnd').value = '';
    document.getElementById('orderData').value = 'recente';
    
    aplicarFiltros();
}

// --- GESTÃO DE SELEÇÃO ---
function selecionarLinha(event, id) {
    if (event.target.checked) {
        itensSelecionados.add(id);
    } else {
        itensSelecionados.delete(id);
    }
    atualizarStatusSelecao();
}

function toggleSelectAll() {
    const isChecked = document.getElementById('selectAll').checked;
    if (isChecked) {
        dadosFiltrados.forEach(item => itensSelecionados.add(item.id));
    } else {
        itensSelecionados.clear();
    }
    renderizarTabela();
    atualizarStatusSelecao();
}

function atualizarStatusSelecao() {
    const count = itensSelecionados.size;
    const infoBar = document.getElementById('selectionCount');
    const bulkActions = document.querySelector('.bulk-actions');
    
    infoBar.innerText = `${count} itens selecionados`;
    bulkActions.style.display = count > 0 ? 'block' : 'none';
}

// --- EXCLUSÃO ---
function confirmarExclusao(id) {
    if (confirm("Tem certeza que deseja excluir permanentemente este registro?")) {
        bancoDeDados = bancoDeDados.filter(item => item.id !== id);
        aplicarFiltros();
        alert("Registro removido com sucesso.");
    }
}

function massaExcluir() {
    if (confirm(`Atenção: Você está prestes a excluir ${itensSelecionados.size} registros. Confirmar?`)) {
        bancoDeDados = bancoDeDados.filter(item => !itensSelecionados.has(item.id));
        itensSelecionados.clear();
        document.getElementById('selectAll').checked = false;
        aplicarFiltros();
    }
}

// --- EXPORTAÇÃO ---
function exportar(formato) {
    const cabecalho = ["Protocolo", "Data", "Servidor", "Matricula", "Cargo", "Unidade", "Status"];
    const rows = dadosFiltrados.map(i => [i.protocolo, i.data, i.nome, i.matricula, i.cargo, i.unidade, i.status]);

    if (formato === 'csv') {
        let csvContent = "data:text/csv;charset=utf-8," 
            + cabecalho.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "banco_de_dados_pedidos.csv");
        document.body.appendChild(link);
        link.click();
    } else {
        alert("Para exportação Excel nativa (.xlsx), é necessário integrar a biblioteca SheetJS (xlsx.min.js). Gerando CSV como alternativa.");
        exportar('csv');
    }
}

// Auxiliares
function formatarStatus(status) {
    const labels = { analise: 'Em Análise', deferido: 'Deferido', indeferido: 'Indeferido' };
    return labels[status] || status;
}

function popularFiltrosDinamicos() {
    const selCargo = document.getElementById('filterCargo');
    const selUnidade = document.getElementById('filterUnidade');
    const selInteresse = document.getElementById('filterInteresse');

    // Função auxiliar interna para preencher cada select
    const preencher = (selectElement, dados) => {
        if (!selectElement) return;
        const ordenados = [...new Set(dados)].sort(); // Remove duplicatas e ordena A-Z
        ordenados.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            selectElement.appendChild(opt);
        });
    };

    preencher(selCargo, cargosRaw);
    preencher(selUnidade, locaisRaw);
    preencher(selInteresse, locaisRaw);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Popula os menus de filtro com as constantes do topo do arquivo
    popularFiltrosDinamicos();

    // 2. Renderiza a tabela com os 20 pedidos iniciais
    renderizarTabela();

    // 3. Inicializa os contadores de registros
    document.getElementById('rowCount').innerText = bancoDeDados.length;

    // ... restante da sua lógica de menu/sidebar ...
});

// ==================================Analise de pedidos==============================================

let pedidoSelecionadoId = null;

function renderizarCardsAnalise() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    container.innerHTML = '';

    bancoDeDados.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'card card-pedido';
        card.innerHTML = `
            <div class="info-principal">
                <div class="cargo-tag">${pedido.cargo}</div>
                <div class="nome">${pedido.nome}</div>
                <p><strong>Unidade Atual:</strong> ${pedido.unidade}</p>
                <p><strong>1ª Opção:</strong> ${pedido.opcao1}</p>
            </div>
            <div class="status-badge ${pedido.status?.toLowerCase().replace(' ', '-') || 'em-analise'}">
                ${pedido.status || 'Em Análise'}
            </div>
            <button class="btn-primary" onclick="abrirDetalhes(${pedido.id})" style="width: 100%; margin-top: 15px;">
                Analisar Detalhes
            </button>
        `;
        container.appendChild(card);
    });
}

function abrirDetalhes(id) {
    const pedido = bancoDeDados.find(p => p.id === id);
    pedidoSelecionadoId = id;
    const body = document.getElementById('modalBody');
    
    body.innerHTML = `
        <div class="info-group">
            <h4 class="form-section-title">Dados do Servidor</h4>
            <p><strong>Matrícula:</strong> ${pedido.matricula}</p>
            <p><strong>Vínculo:</strong> ${pedido.vinculo}</p>
            <p><strong>E-mail:</strong> ${pedido.email}</p>
            <p><strong>Admissão:</strong> ${pedido.data}</p>
        </div>
        <div class="info-group">
            <h4 class="form-section-title">Prioridades Solicitadas</h4>
            <ol>
                <li>${pedido.opcao1}</li>
                <li>${pedido.opcao2 || '-'}</li>
                <li>${pedido.opcao3 || '-'}</li>
                <li>${pedido.opcao4 || '-'}</li>
                <li>${pedido.opcao5 || '-'}</li>
            </ol>
            <a href="#" class="link-documento">📄 Visualizar Currículo Anexado</a>
        </div>
    `;
    
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
    document.getElementById('justificativa').value = '';
}

function atualizarStatus(novoStatus) {
    const index = bancoDeDados.findIndex(p => p.id === pedidoSelecionadoId);
    if (index !== -1) {
        bancoDeDados[index].status = novoStatus;
        bancoDeDados[index].edicao = new Date().toLocaleDateString('pt-BR');
        
        const justificativa = document.getElementById('justificativa').value;
        console.log(`Pedido ${pedidoSelecionadoId} atualizado para ${novoStatus}. Justificativa: ${justificativa}`);
        
        alert(`Pedido atualizado para ${novoStatus} com sucesso!`);
        fecharModal();
        renderizarCardsAnalise(); // Atualiza a fila de cards
        renderizarTabela(); // Atualiza a tabela técnica se estiver visível
    }
}

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', () => {
    renderizarCardsAnalise();
    
    // Adicionar listener no menu para carregar os cards quando a aba for clicada
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            if(item.getAttribute('data-target') === 'analise-pedidos') renderizarCardsAnalise();
        });
    });
});