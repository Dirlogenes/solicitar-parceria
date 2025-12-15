// Configuration
const RD_CONFIG = {
    token: 'b32e0b962e0ec0de400f8215112b8a08', 
    eventId: 'solicitacao-parceria-phs-externo' 
};

// --- Dados de Autocomplete ---
let CIDADES_UF = []; 

// Product Lists (ATUALIZADA com os nomes em Title Case)
const PRODUCTS = {
    tokuyama: [
        'Resina Estelite Omega',
        'Resina Palfique LX5',
        'Resina Estelite Posterior',
        'Resina Palfique Omnichroma',
        'Resina Palfique Universal Flow',
        'Reembasador Sofreliner Tough',
        'Reembasador Rebase 2',
        'Adesivo Palfique Bond Autocondicionante',
        'Adesivo Palfique Universal Bond',
        'Pincel Tokuyama',
        'Corante e Opacificante Estelite Color',
        'Cimento Resinosa Estecem Plus'
    ],
    potenza: [
        'Clareador Consultório Potenza Bianco Peróxido de Hidrogênio "35%" "38%"',
        'Clareador Consultório Potenza Bianco PF Peróxido de Carbamida 35%',
        'Clareador Caseiro Peróxido de Carbamida "10%" "16%" "22%"',
        'Clareador Caseiro Peróxido de Hidrogênio "6%" "7,5%" "9,5%"',
        'Barreira Gengival Potenza Blocco',
        'Dessensibilizantes Potenza Esente',
        'Cimento Ortodôntico Potenza Orthoblue',
        'Condicionador Ácido Fosfórico H3PO4 Esmalte e Dentina Potenza Attaco “35%” “37%”',
        'Condicionador Ácido Fluorídrico HF Cerâmica Potenza Attaco “5%” “10%”',
        'Microabrasão Potenza Abrasione',
        'Hidratante Bucal Longa Duração Potenza Idrata',
        'Pastas de Polimento para Resinas Potenza Specchi',
        'Placas de EVA para Clareamento Potenza Stampo EVA',
        'Espuma de Limpeza de Moldeira Potenza Cloud Clean',
        'Agente de União Potenza Silano',
        'Bloqueador de Oxigênio Potenza Bloxy'
    ],
    nictone: [
        'Lençol de borracha para isolamento absoluto Nic Tone'
    ]
};

// Form State
let formData = {
    name: '',
    email: '',
    cf_telefone_whatsapp: '',
    cf_cidade_uf: '',
    instagram: '',
    tiposParceria: [],
    marcas: [],
    produtos: [],
    produtosType: '', 
    motivoPotenza: '',
    motivoPotenzaOutro: '',
    interessePotenza: false,
    produtosPotenzaInteresse: [],
    parceriasAtivas: [],
    parceriasOdonto: '',
    parceriasEmpresas: '',
    exclusividade: false,
    exclusividadeLista: '',
    cursos: []
};
let currentStep = 0;
let totalSteps = 0;
let questions = [];

// Estado global para controlar se o multiselect estava aberto antes da re-renderização
let isMultiselectOpen = false;


// ==========================================================
// FUNÇÕES CRÍTICAS (DEFINIÇÃO GARANTIDA NO TOPO)
// ==========================================================

// --- FUNÇÃO DE MANIPULAÇÃO DE CHECKBOX/ARRAY ---
function handleCheckboxChange(question, value, checked) {
    if (checked) {
        if (!formData[question.field].includes(value)) {
            formData[question.field].push(value);
        }
    } else {
        formData[question.field] = formData[question.field].filter(v => v !== value);
    }
}

// Função principal de inicialização e busca de dados
async function fetchCidadesIBGE() {
    console.log('Iniciando busca de dados do IBGE...');
    try {
        const urlEstados = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';
        const responseEstados = await fetch(urlEstados);
        const estados = await responseEstados.json();
        
        const promessasMunicipios = estados.map(estado => {
            const urlMunicipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.sigla}/municipios`;
            return fetch(urlMunicipios)
                .then(res => res.json())
                .then(municipios => {
                    return municipios.map(municipio => `${municipio.nome}, ${estado.sigla}`);
                });
        });

        const todasCidadesArray = await Promise.all(promessasMunicipios);
        CIDADES_UF = todasCidadesArray.flat();
        console.log(`Dados do IBGE carregados. Total de ${CIDADES_UF.length} cidades.`);
        
        const q4 = questions.find(q => q.id === 'q4');
        if (q4) {
            q4.options = CIDADES_UF;
        }

    } catch (error) {
        console.error('Erro ao carregar dados do IBGE. Usando lista de fallback.', error);
        CIDADES_UF = [
            'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 
            'Curitiba, PR', 'Salvador, BA', 'Recife, PE', 'Manaus, AM', 'Joinville, SC'
        ];
        const q4 = questions.find(q => q.id === 'q4');
        if (q4) {
            q4.options = CIDADES_UF;
        }
    }
}


// Setup event listeners (FUNÇÃO CRÍTICA)
function setupQuestionListeners(question) {
    const textInput = document.getElementById(question.field);
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            formData[question.field] = e.target.value;
        });
    }
        
    if (question.type === 'checkbox' || question.type === 'checkbox-exclusive') {
        const checkboxes = document.querySelectorAll('.checkbox-option');
        checkboxes.forEach(div => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                handleCheckboxChange(question, e.target.value, e.target.checked); 
                div.classList.toggle('selected', e.target.checked);
                if (question.type === 'checkbox-exclusive') {
                    renderQuestion(currentStep);
                }
            });
        });
    }
        
    if (question.type === 'multiselect') {
        setupMultiselect();
    }
    
    // CORREÇÃO 1.1: Inicializa o multiselect Potenza se ele foi renderizado (Q8.4 = Sim)
    if (question.type === 'checkbox-with-multiselect' && formData.interessePotenza === true) {
        setupPotenzaMultiselect();
    }
        
    if (question.type === 'radio-with-other') {
        const radios = document.querySelectorAll(`input[name="${question.field}"]`);
        
        // CORREÇÃO Q8.3: Adiciona o listener de mudança (OK)
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                formData[question.field] = e.target.value;
                document.querySelectorAll('.radio-option').forEach(div => {
                    div.classList.remove('selected');
                });
                e.target.closest('.radio-option').classList.add('selected');
                document.querySelectorAll('.conditional-input').forEach(input => {
                    input.classList.remove('show');
                });
                const conditionalInput = document.getElementById(`input-${e.target.value}`);
                if (conditionalInput) {
                    conditionalInput.classList.add('show');
                }
            });
        });
        
        // CORREÇÃO Q8.3: Adiciona um listener de input para o campo "Outro" (OK)
        const otherInput = document.getElementById(`${question.field}-outro`);
        if (otherInput) {
            otherInput.addEventListener('input', (e) => {
                formData.motivoPotenzaOutro = e.target.value;
            });
        }
        
        // CORREÇÃO (NOVA): Lógica para garantir que o campo "Outro" esteja visível 
        // na renderização inicial/volta, se o estado já estiver definido.
        // Já que a classe 'show' é aplicada no renderRadioWithOther, este bloco 
        // é principalmente para fins de debugar se a injeção falhar, mas vamos 
        // garantir que ele seja aplicado, se o input existir.
        
        const conditionalInputDiv = document.getElementById('input-outro');
        if (formData[question.field] === 'outro' && conditionalInputDiv) {
            conditionalInputDiv.classList.add('show');
        }
    }
        
    if (question.type === 'checkbox-with-multiselect') {
        const radios = document.querySelectorAll(`input[name="${question.field}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                // O valor vem como string, convertemos para booleano
                formData[question.field] = e.target.value === 'true';
                document.querySelectorAll('.radio-option').forEach(div => {
                    div.classList.remove('selected');
                });
                e.target.closest('.radio-option').classList.add('selected');
                
                // Re-renderiza para aplicar a classe 'show' no conditional-input (potenza-multiselect)
                // e reativar o setupPotenzaMultiselect (corrigido acima)
                renderQuestion(currentStep); 
            });
        });
    }
        
    if (question.type === 'checkbox-with-inputs') {
        const checkboxes = document.querySelectorAll('.checkbox-option');
        checkboxes.forEach(div => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                handleCheckboxChange(question, e.target.value, e.target.checked);
                div.classList.toggle('selected', e.target.checked);
                document.querySelectorAll('.conditional-input').forEach(input => { // Limpa todos
                    input.classList.remove('show');
                });
                
                // Exibe os inputs cond
