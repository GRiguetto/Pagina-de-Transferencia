const cargosRaw = ['MÉDICO PEDIATRA PLANTONISTA', 'MÉDICO ORTOPEDISTA PLANTONISTA', 'MÉDICO CLINICO GERAL PLANTONISTA', 'MÉDICO CLINICO GERAL HORISTA', 'MÉDICO ESPECIALISTA', 'INTERPRETE DE LIBRAS', 'FONOAUDIÓLOGO', 'FISIOTERAPEUTA', 'FARMACÊUTICO', 'ENGENHEIROS E ARQUITETOS', 'ENFERMEIRO', 'EDUCADOR FÍSICO', 'DIGITADOR E OPERADOR DE COMPUTADOR', 'DENTISTA', 'BIOMÉDICO', 'BIOLOGO', 'AUXILIAR E TÉCNICO EM LABORATÓRIO', 'AUXILIAR E TÉCNICO EM ENFERMAGEM', 'AUXILIAR VETERINÁRIO', 'AUXILIAR DE SAÚDE BUCAL', 'ASSISTENTE SOCIAL', 'ARTESÃO', 'ANALISTA EM VIGILÂNCIA SANITÁRIA', 'ANALISTA DE TI', 'AGENTE SOCIAL', 'AGENTE DE COMBATE AS ENDEMIAS', 'AGENTE COMUNITARIO DE SAUDE', 'ADVOGADO', 'ADMINISTRATIVO', 'ADMINISTRADOR HOSPITALAR', 'MEDICO SAUDE DA FAMILIA', 'MEDICO VETERINARIO', 'NUTRICIONISTA', 'PSICOLOGO', 'TECNICO ADMINISTRATIVO EM SAUDE PUBLICA', 'TECNICO EM FARMACIA', 'TECNICO EM RADIOLOGIA', 'TECNICO ENGESSADOR', 'TERAPEUTA OCUPACIONAL'];

const locaisRaw = ['AMBULATÓRIO DE DOENÇAS CRÔNICAS TRANSMISSÍVEIS', 'BANCO DE LEITE HUMANO', 'CAPS I NORTE', 'CAPS I SUL', 'CAPS AD NORTE', 'CAPS I CENTRO', 'CAPS II CENTRO', 'CAPS II SUL', 'CENTRO DE ATENDIMENTO ESPECIALIZADO (CAE)', 'CENTRO DE ATENDIMENTO ESPECIALIZADO NA SAÚDE DA MULHER (CAESM)', 'CENTRO DE CONTROLE DE ZOONOSES', 'CENTRO DE REFERÊNCIA NA SAÚDE DO TRABALHADOR (CEREST)', 'CENTRO DIAGNÓSTICO E HOSPITAL DIA (HOSPITAL DIA)', 'CENTRO ESPECIALIZADO DE ODONTOLOGIA CENTRO (CEO CENTRO)', 'CENTRO ESPECIALIZADO de ODONTOLOGIA NORTE (CEO NORTE)', 'CENTRO ESPECIALIZADO EM REABILITAÇÃO', 'CENTRO MÉDICO DE ESPECIALIDADES', 'COMPLEXO REGULADOR', 'CONSELHO MUNICIPAL DE SAUDE', 'COORDENADORIA DE ADMINISTRAÇÃO FINANCEIRA (FUNDO MUNICIPAL DE SAUDE)', 'COORDENADORIA DE ÁREA TÉCNICA', 'COORDENADORIA DE MONITORAMENTO E AVALIAÇÃO', 'COORDENADORIA DE RECURSOS HUMANOS', 'DEPARTAMENTO ADMINISTRATIVO', 'DEPARTAMENTO DE APOIO JURÍDICO', 'DEPARTAMENTO ASSISTÊNCIA FARMACÊUTICA', 'DEPARTAMENTO ATENÇÃO BÁSICA', 'DEPARTAMENTO ATENÇÃO ESPECIALIZADA', 'DEPARTAMENTO PLANEJAMENTO', 'DEPARTAMENTO DE ACOMPANHAMENTO DE OBRAS', 'DEPARTAMENTO DE REGULAÇÃO AVALIAÇÃO E CONTROLE (DERAC)', 'DEPARTAMENTO DE TÉCNOLOGIA E INFORMAÇÃO', 'DEPARTAMENTO DE URGÊNCIA E EMERGÊNCIA', 'DEPARTAMENTO DE VIGILÂNCIA EM SAÚDE (TODAS AS VIGILÂNCIAS)', 'FARMÁCIA CENTRAL', 'FARMÁCIA MUNICIPAL', 'FARMÁCIA MUNICIPAL NORTE', 'GABINETE', 'GERÊNCIA DE COMPRAS', 'GERÊNCIA DE IMUNIZAÇÃO', 'GERÊNCIA DE MANUTENÇÃO', 'GERÊNCIA DE SUPRIMENTOS', 'GERÊNCIA DE TRANSPORTES', 'LABORATÓRIO MUNICPAL DE PATOLOGIA CLÍNICA', 'NÚCLEO DE EDUCAÇÃO EM SAÚDE', 'OUVIDORIA', 'SERVIÇO DE ATENDIMENTO MOVÉL DE URGÊNCIA (SAMU)', 'SERVIÇO DE ATENDIMENTO DOMICILIAR (SAD)', 'SETOR CENTRAL DE REMOÇÃO', 'TELEMEDICINA', 'VIGILÂNCIA AMBIENTAL', 'VIGILÂNCIA EPIDEMIOLÓGICA', 'VIGILÂNCIA SANITÁRIA', 'UNIDADE BÁSICA DE SAÚDE - UBS ANCHIETA', 'UNIDADE BÁSICA DE SAÚDE - UBS ESTORIL', 'UNIDADE BÁSICA DE SAÚDE - UBS CAIC/CRISTO REI', 'UNIDADE BÁSICA DE SAÚDE - UBS CENTRAL', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADANIA', 'UNIDADE BÁSICA DE SAÚDE - UBS CIDADE JARDIM', 'UNIDADE BÁSICA DE SAÚDE - UBS ELDORADO', 'UNIDADE BÁSICA DE SAÚDE - UBS ENGENHEIRO SCHMITT', 'UNIDADE BÁSICA DE SAÚDE - UBS FRATERNIDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS GONZAGA DE CAMPOS', 'UNIDADE BÁSICA DE SAÚDE - UBS JOÃO PAULO II', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM AMERICANO', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM GABRIELA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM MARIA LUCIA', 'UNIDADE BÁSICA DE SAÚDE - UBS JARDIM SIMÕES/RENASCER', 'UNIDADE BÁSICA DE SAÚDE - UBS LEALDADE E AMIZADE', 'UNIDADE BÁSICA DE SAÚDE - UBS LUZ DA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS NOVA ESPERANÇA', 'UNIDADE BÁSICA DE SAÚDE - UBS PARQUE INDUSTRIAL', 'UNIDADE BÁSICA DE SAÚDE - UBS SANTO ANTÔNIO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO DEOCLECIANO', 'UNIDADE BÁSICA DE SAÚDE - UBS SÃO FRANCISCO', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLIDARIEDADE', 'UNIDADE BÁSICA DE SAÚDE - UBS SOLO SAGRADO', 'UNIDADE BÁSICA DE SAÚDE - UBS TALHADO', 'UNIDADE BÁSICA DE SAÚDE - UBS VETORAZZO', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA ELVIRA', 'UNIDADE BÁSICA DE SAÚDE - UBS VILA MAYOR', 'UNIDADE BASICA DE SAUDE - UBS VILA TONINHO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA JAGUARÉ', 'UNIDADE DE PRONTO ATENDIMENTO - UPA REGIÃO NORTE', 'UNIDADE DE PRONTO ATENDIMENTO - UPA SANTO ANTÔNIO', 'UNIDADE DE PRONTO ATENDIMENTO - UPA TANGARÁ/ESTORIL', 'PRONTO SOCORRO - PS VILA TONINHO', 'TODAS AS UNIDADES DA ATENÇÃO ESPECIALIZADA', 'TODOS OS SETORES DA SECRETARIA MUNICIPAL DE SAÚDE', 'TODAS AS UNIDADES BÁSICAS DE SAÚDE', 'TODAS AS UNIDADES DE PRONTO ATENDIMENTO', 'CENTRO DE ATENDIMENTO PEDIATRICO DA REGIÃO NORTE'];

function popularDropdown(idElemento, dados) {
    const select = document.getElementById(idElemento);
    if(!select) return;
    const dadosOrdenados = [...new Set(dados)].sort();
    dadosOrdenados.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

function popularDropdowns() {
    popularDropdown('cargo', cargosRaw);
    popularDropdown('unidade_atual', locaisRaw);

    const selectsPrioridade = ['opcao1', 'opcao2', 'opcao3', 'opcao4', 'opcao5'];
    selectsPrioridade.forEach(id => {
        const select = document.getElementById(id);
        if(!select) return;
        locaisRaw.sort().forEach(local => {
            const opt = document.createElement('option');
            opt.value = local;
            opt.textContent = local;
            select.appendChild(opt);
        });
        select.addEventListener('change', validarEscolhasUnicas);
    });
}

function validarEscolhasUnicas() {
    const selects = document.querySelectorAll('.select-unidade');
    const valoresSelecionados = Array.from(selects)
        .map(s => s.value)
        .filter(v => v !== "" && v !== "Nenhuma (Opcional)");

    selects.forEach(currentSelect => {
        const options = currentSelect.querySelectorAll('option');
        options.forEach(opt => {
            if (opt.value === "" || opt.textContent.includes("Nenhuma")) return;
            const jaEscolhidoEmOutro = Array.from(selects).some(s => 
                s !== currentSelect && s.value === opt.value
            );
            opt.disabled = jaEscolhidoEmOutro;
            opt.style.color = jaEscolhidoEmOutro ? "#ccc" : "initial";
        });
    });
}

function aplicarMascaraTelefone(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
        input.value = "(" + value.slice(0, 2) + ") " + value.slice(2, 7) + "-" + value.slice(7);
    } else if (value.length > 5) {
        input.value = "(" + value.slice(0, 2) + ") " + value.slice(2, 6) + "-" + value.slice(6);
    } else if (value.length > 2) {
        input.value = "(" + value.slice(0, 2) + ") " + value.slice(2);
    } else if (value.length > 0) {
        input.value = "(" + value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    popularDropdowns();
    document.getElementById('telefone').addEventListener('input', aplicarMascaraTelefone);
    
    document.getElementById('transferForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-submit');
        btn.textContent = "Enviando...";
        btn.disabled = true;

        setTimeout(() => {
            alert("Sua solicitação foi registrada com sucesso!");
            e.target.reset();
            btn.textContent = "Enviar Solicitação";
            btn.disabled = false;
        }, 1500);
    });
});