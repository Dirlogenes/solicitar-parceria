// Configuration
const RD_CONFIG = {
    token: 'b32e0b962e0ec0de400f8215112b8a08', // SUBSTITUIR PELO SEU TOKEN PÚBLICO REAL
    eventId: 'solicitar-parceria'
};

// Product Lists
const PRODUCTS = {
    tokuyama: [
        'RESINA ESTELITE OMEGA',
        'RESINA PALFIQUE LX5',
        'RESINA ESTELITE POSTERIOR',
        'RESINA PALFIQUE OMNICHROMA',
        'RESINA PALFIQUE UNIVERSAL FLOW',
        'REEMBASADOR SOFRELINER TOUGH',
        'REEMBASADOR REBASE 2',
        'ADESIVO PALFIQUE BOND AUTOCONDICIONANTE',
        'ADESIVO PALFIQUE UNIVERSAL BOND',
        'PINCEL TOKUYAMA',
        'CORANTE E OPACIFICANTE ESTELITE COLOR',
        'CIMENTO RESINOSO ESTECEM PLUS'
    ],
    potenza: [
        'CLAREADOR CONSULTÓRIO POTENZA BIANCO PERÓXIDO DE HIDROGÊNIO PRO "35%" "38%"',
        'CLAREADOR CONSULTÓRIO POTENZA BIANCO PF PERÓXIDO DE CARBAMIDA 35%',
        'CLAREADOR CASEIRO PERÓXIDO DE CARBAMIDA "10%"  "16%"  "22%"',
        'CLAREADOR CASEIRO - PERÓXIDO DE HIDROGÊNIO - "6%"  "7,5%"  "9,5%"',
        'BARREIRA GENGIVAL POTENZA BLOCCO',
        'DESSENSIBILIZANTES POTENZA ESENTE',
        'CIMENTO ORTODONTICO POTENZA ORTHOBLUE',
        'CONDICIONADOR ÁCIDO FOSFÓRICO H3PO4 ESMALTE E DENTINA POTENZA ATTACO "35%" "37%"',
        'CONDICIONADOR ÁCIDO FLUORÍDRICO HF CERÂMICA POTENZA ATTACO "5%" "10%"',
        'MICROABRASÃO POTENZA ABRASIONE',
        'HIDRATANTE BUCAL LONGA DURAÇAO POTENZA IDRATA',
        'PASTAS DE POLIMENTO PARA RESINAS POTENZA SPECCHI',
        'PLACAS DE EVA PARA CLAREAMENTO POTENZA STAMPO EVA',
        'ESPUMA DE LIMPEZA DE MOLDEIRA POTENZA CLOUD CLEAN',
        'AGENTE DE UNIAO POTENZA SILANO',
        'BLOQUEADOR DE OXIGENIO POTENZA BLOXY'
    ],
    nictone: [
        'LENÇOL DE BORRACHA PARA ISOLAMENTO ABSOLUTO NICTONE'
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
    produtosType: '', // '8.1' or '8.2'
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

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    buildQuestions();
    renderQuestion(currentStep);
    updateProgress();
    setupNavigation();
});

// Build questions array based on logic
function buildQuestions() {
    questions = [
        {
            id: 'q1',
            number: 'Etapa 1',
            title: 'Qual é o seu nome?',
            type: 'text',
            field: 'name',
            required: true,
            validation: 'text'
        },
        {
            id: 'q2',
            number: 'Etapa 1',
            title: 'Qual é o seu e-mail?',
            type: 'email',
            field: 'email',
            required: true,
            validation: 'email'
        },
        {
            id: 'q3',
            number: 'Etapa 1',
            title: 'Qual é o seu Telefone/Whatsapp?',
            subtitle: 'Informe com DDD',
            type: 'tel',
            field: 'cf_telefone_whatsapp',
            required: true,
            validation: 'phone'
        },
        {
            id: 'q4',
            number: 'Etapa 1',
            title: 'Qual sua Cidade/UF?',
            type: 'text',
            field: 'cf_cidade_uf',
            required: true,
            validation: 'text'
        },
        {
            id: 'q5',
            number: 'Etapa 1',
            title: 'Qual o seu @ usuário do instagram?',
            type: 'text',
            field: 'instagram',
            required: true,
            validation: 'text'
        },
        {
            id: 'q6',
            number: 'Etapa 1',
            title: 'Qual tipo de parceria têm interesse?',
            subtitle: 'Selecione uma ou mais opções',
            type: 'checkbox',
            field: 'tiposParceria',
            required: true,
            options: [
                { value: 'conteudos', label: 'Conteúdos para redes sociais.' },
                { value: 'cursos', label: 'Cursos, treinamentos e/ou Hands-on.' }
            ]
        },
        {
            id: 'q7',
            number: 'Etapa 2',
            title: 'Quais marcas da PHS você utiliza ou já utilizou na sua prática clínica ou em aulas?',
            subtitle: 'Selecione uma ou mais opções',
            type: 'checkbox-exclusive',
            field: 'marcas',
            required: true,
            options: [
                { value: 'tokuyama', label: 'Tokuyama' },
                { value: 'potenza', label: 'Potenza' },
                { value: 'nictone', label: 'Nic Tone' },
                { value: 'nao-utilizei', label: 'Ainda não utilizei, será meu primeiro contato as marcas da PHS.', exclusive: true }
            ]
        },
        {
            id: 'q8',
            number: 'Etapa 2',
            title: '',
            type: 'multiselect',
            field: 'produtos',
            required: true,
            conditional: true
        },
        {
            id: 'q8.3',
            number: 'Etapa 2',
            title: 'Qual o principal motivo de você ainda não ter utilizado nossa linha de produtos Potenza?',
            subtitle: '(Clareadores, Dessensibilizantes, Condicionadores Ácidos, Pastas de Polimento, etc..)',
            type: 'radio-with-other',
            field: 'motivoPotenza',
            required: true,
            conditional: true,
            options: [
                { value: 'sem-oportunidade', label: 'Ainda não tive oportunidade de testar.' },
                { value: 'outras-marcas', label: 'Utilizo outras marcas.' },
                { value: 'testei', label: 'Testei e não me adaptei.' },
                { value: 'outro', label: 'Outro', hasInput: true }
            ]
        },
        {
            id: 'q8.4',
            number: 'Etapa 2',
            title: 'Você teria interesse em testar os produtos da linha Potenza?',
            type: 'checkbox-with-multiselect',
            field: 'interessePotenza',
            required: true,
            conditional: true,
            options: [
                { value: true, label: 'Sim, tenho interesse.', hasMultiselect: true },
                { value: false, label: 'Não tenho interesse.' }
            ]
        },
        {
            id: 'q9',
            number: 'Etapa 3',
            title: 'Atualmente, você possuí parceria com ativas no nosso segmento?',
            type: 'checkbox-with-inputs',
            field: 'parceriasAtivas',
            required: true,
            options: [
                { value: 'dentais', label: 'Tenho parceria com Dentais.', hasInput: true, inputLabel: 'Liste suas dentais parceiras:' },
                { value: 'empresas', label: 'Tenho parcerias com outras empresas.', hasInput: true, inputLabel: 'Lista as empresas parceiras:' },
                { value: 'nenhuma', label: 'Não possuo parcerias ativas.' }
            ]
        },
        {
            id: 'q10',
            number: 'Etapa 3',
            title: 'Possuí exclusividade com algum desses parceiros?',
            type: 'radio-with-input',
            field: 'exclusividade',
            required: true,
            conditional: true,
            options: [
                { value: true, label: 'Sim possuo exclusividade.', hasInput: true, inputLabel: 'Lista parcerias com exclusividade:' },
                { value: false, label: 'Não possuo exclusividade.' }
            ]
        },
        {
            id: 'q11',
            number: 'Etapa 4',
            title: 'Cadastre um ou mais cursos/treinamentos que já realizou ou ainda irá realizar.',
            subtitle: 'Se tiver mais de um tipo, cadastre ao menos um de cada como exemplo. Queremos entender melhor sobre o formato e como podemos ajudá-lo.',
            type: 'course-repeater',
            field: 'cursos',
            required: true,
            conditional: true
        }
    ];
}

// Render current question
function renderQuestion(step) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
        
    const question = questions[step];
        
    // Check conditional visibility
    if (question.conditional && !shouldShowQuestion(question)) {
        // Skip to next question
        if (currentStep < questions.length - 1) {
            currentStep++;
            renderQuestion(currentStep);
        } else {
            submitForm();
        }
        return;
    }
        
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question active';
    questionDiv.id = question.id;
        
    let html = `
        <div class="question-number">${question.number}</div>
        <h2 class="question-title">${getQuestionTitle(question)}</h2>
    `;
        
    if (question.subtitle) {
        html += `<p class="question-subtitle">${question.subtitle}</p>`;
    }
        
    html += `<div class="input-group">${renderInput(question)}</div>`;
    html += `<div class="error-message" id="error-${question.id}">Este campo é obrigatório</div>`;
        
    questionDiv.innerHTML = html;
    container.appendChild(questionDiv);
        
    // Setup event listeners
    setupQuestionListeners(question);
}

// Get dynamic question title
function getQuestionTitle(question) {
    if (question.id === 'q8') {
        const usedBrands = formData.marcas.includes('nao-utilizei');
        if (usedBrands) {
            return 'Qual dos nossos produtos você gostaria de utilizar?';
        } else {
            return 'Dos produtos que utiliza ou já utilizou, quais você possuí mais conhecimento, prática e domínio técnico?';
        }
    }
    return question.title;
}

// Check if question should be shown
function shouldShowQuestion(question) {
    switch (question.id) {
        case 'q8':
            // Show if brands were selected and not just 'nao-utilizei'
            const selectedBrands = formData.marcas.length > 0;
            const onlyNaoUtilizei = formData.marcas.length === 1 && formData.marcas.includes('nao-utilizei');
            return selectedBrands;
                
        case 'q8.3':
        case 'q8.4':
            // Show if Potenza was NOT selected OR if 'nao-utilizei' was selected AND no Potenza products were picked in Q8
            const selectedPotenza = formData.marcas.includes('potenza');
            const selectedNaoUtilizei = formData.marcas.includes('nao-utilizei');
            const selectedPotenzaProducts = formData.produtos.some(p => 
                PRODUCTS.potenza.includes(p)
            );
            
            // Show Q8.3/Q8.4 if user didn't select Potenza brand OR if they selected 'nao-utilizei' and skipped Potenza products in Q8
            return !selectedPotenza || (selectedNaoUtilizei && !selectedPotenzaProducts);
                
        case 'q10':
            // Don't show if selected "nenhuma" partnership
            return !formData.parceriasAtivas.includes('nenhuma');
                
        case 'q11':
            // Only show if selected "cursos" in partnership type
            return formData.tiposParceria.includes('cursos');
                
        default:
            return true;
    }
}

// Render input based on question type
function renderInput(question) {
    switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
            return `<input type="${question.type}" id="${question.field}" value="${formData[question.field] || ''}" placeholder="Digite sua resposta...">`;
                
        case 'checkbox':
            return renderCheckboxes(question);
                
        case 'checkbox-exclusive':
            return renderExclusiveCheckboxes(question);
                
        case 'multiselect':
            return renderMultiselect(question);
                
        case 'radio-with-other':
            return renderRadioWithOther(question);
                
        case 'checkbox-with-multiselect':
            return renderCheckboxWithMultiselect(question);
                
        case 'checkbox-with-inputs':
            return renderCheckboxWithInputs(question);
                
        case 'radio-with-input':
            return
