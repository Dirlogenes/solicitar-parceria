// Configuration
const RD_CONFIG = {
    token: 'b32e0b962e0ec0de400f8215112b8a08', 
    eventId: 'solicitacao-parceria-phs-externo' 
};

// --- Dados de Autocomplete (SIMULAÇÃO) ---
const CIDADES_UF_DEMO = [
    'São Paulo, SP',
    'Rio de Janeiro, RJ',
    'Belo Horizonte, MG',
    'Curitiba, PR',
    'Joinville, SC',
    'Manaus, AM',
    'Salvador, BA',
    'Porto Alegre, RS',
    'Brasília, DF',
    'Recife, PE'
];

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
            validation: 'text',
            autocomplete: 'single', 
            options: CIDADES_UF_DEMO 
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
        
    if (question.conditional && !shouldShowQuestion(question)) {
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
    
    // Configura Autocomplete (Cidade/UF e Regiões de Curso)
    if (question.autocomplete) {
        setupAutocomplete(question);
    }
    
    // CORREÇÃO DO BUG: Reabre o multiselect se ele estava aberto antes da re-renderização
    if (isMultiselectOpen && (question.type === 'multiselect' || question.type === 'checkbox-with-multiselect')) {
        const dropdown = document.getElementById('multiselect-dropdown') || document.getElementById('potenza-multiselect-dropdown');
        if (dropdown) {
            dropdown.classList.add('open');
        }
    }
}

// Get dynamic question title (mantido)
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

// Check if question should be shown (mantido)
function shouldShowQuestion(question) {
    switch (question.id) {
        case 'q8':
            const selectedBrands = formData.marcas.length > 0;
            const onlyNaoUtilizei = formData.marcas.length === 1 && formData.marcas.includes('nao-utilizei');
            return selectedBrands;
                
        case 'q8.3':
        case 'q8.4':
            const selectedPotenza = formData.marcas.includes('potenza');
            const selectedNaoUtilizei = formData.marcas.includes('nao-utilizei');
            const selectedPotenzaProducts = formData.produtos.some(p => 
                PRODUCTS.potenza.includes(p)
            );
            
            return !selectedPotenza || (selectedNaoUtilizei && !selectedPotenzaProducts);
                
        case 'q10':
            return !formData.parceriasAtivas.includes('nenhuma');
                
        case 'q11':
            return formData.tiposParceria.includes('cursos');
                
        default:
            return true;
    }
}

// Render input based on question type (mantido)
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
            return renderRadioWithInput(question);
                
        case 'course-repeater':
            return renderCourseRepeater();
                
        default:
            return '';
    }
}

// Restante das funções de renderização (renderCheckboxes, renderExclusiveCheckboxes, etc.)

function renderCheckboxes(question) {
    let html = '<div class="checkbox-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field].includes(opt.value) ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="checkbox-option ${selected}" data-value="${opt.value}">
                <input type="checkbox" id="${opt.value}" value="${opt.value}" ${checked}>
                <label for="${opt.value}">${opt.label}</label>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderExclusiveCheckboxes(question) {
    let html = '<div class="checkbox-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field].includes(opt.value) ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        const disabled = shouldDisableOption(question, opt) ? 'disabled' : '';
        html += `
            <div class="checkbox-option ${selected} ${disabled}" data-value="${opt.value}" data-exclusive="${opt.exclusive || false}">
                <input type="checkbox" id="${opt.value}" value="${opt.value}" ${checked} ${disabled}>
                <label for="${opt.value}">${opt.label}</label>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function shouldDisableOption(question, option) {
    const values = formData[question.field];
    const hasExclusive = values.some(v => {
        const opt = question.options.find(o => o.value === v);
        return opt && opt.exclusive;
    });
        
    if (hasExclusive && !option.exclusive) {
        return true;
    }
        
    if (!hasExclusive && option.exclusive && values.length > 0) {
        return true;
    }
        
    return false;
}

function renderMultiselect(question) {
    const products = getAvailableProducts();
    const selected = formData.produtos || [];
        
    let html = `
        <div class="multiselect-container">
            <div class="multiselect-trigger" id="multiselect-trigger">
                <span>Pesquise pelo nome ou selecione na lista</span>
                <span>▼</span>
            </div>
            <div class="multiselect-dropdown" id="multiselect-dropdown">
                <div class="multiselect-search">
                    <input type="text" id="multiselect-search" placeholder="Pesquisar produto...">
                </div>
                <div class="multiselect-options" id="multiselect-options">
    `;
        
    products.forEach(product => {
        const isSelected = selected.includes(product);
        // LÓGICA DO NOTION: Esconde item se já estiver selecionado
        const displayStyle = isSelected ? 'display: none;' : 'display: flex;'; 
        
        html += `
            <div class="multiselect-option ${isSelected ? 'selected' : ''}" data-value="${product}" style="${displayStyle}">
                <input type="checkbox" ${isSelected ? 'checked' : ''}> ${product}
            </div>
        `;
    });
        
    html += `
                </div>
            </div>
            <div class="selected-items" id="selected-items">
    `;
        
    selected.forEach(product => {
        html += `
            <div class="selected-item">
                ${product}
                <button type="button" onclick="removeProduct('${product}', event)">×</button>
            </div>
        `;
    });
        
    html += `
            </div>
        </div>
    `;
        
    return html;
}

function getAvailableProducts() {
    const brands = formData.marcas;
    let products = [];
        
    if (brands.includes('nao-utilizei')) {
        products = [...PRODUCTS.tokuyama, ...PRODUCTS.potenza, ...PRODUCTS.nictone];
    } else {
        if (brands.includes('tokuyama')) products.push(...PRODUCTS.tokuyama);
        if (brands.includes('potenza')) products.push(...PRODUCTS.potenza);
        if (brands.includes('nictone')) products.push(...PRODUCTS.nictone);
    }
        
    return products;
}

// CORREÇÃO: Passa o evento e usa isMultiselectOpen
window.removeProduct = function(product, event) {
    event.stopPropagation();
    isMultiselectOpen = document.getElementById('multiselect-dropdown').classList.contains('open');
    
    formData.produtos = formData.produtos.filter(p => p !== product);
    renderQuestion(currentStep);
};

function renderRadioWithOther(question) {
    let html = '<div class="radio-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field] === opt.value ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="radio-option ${selected}" data-value="${opt.value}">
                <input type="radio" name="${question.field}" id="${opt.value}" value="${opt.value}" ${checked}>
                <label for="${opt.value}">${opt.label}</label>
            </div>
        `;
        if (opt.hasInput) {
            const show = checked ? 'show' : '';
            html += `
                <div class="conditional-input ${show}" id="input-${opt.value}">
                    <input type="text" id="${question.field}-outro" value="${formData.motivoPotenzaOutro || ''}" placeholder="Especifique...">
                </div>
            `;
        }
    });
    html += '</div>';
    return html;
}

function renderCheckboxWithMultiselect(question) {
    let html = '<div class="radio-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field] === opt.value ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="radio-option ${selected}" data-value="${opt.value}">
                <input type="radio" name="${question.field}" id="interesse-${opt.value}" value="${opt.value}" ${checked}>
                <label for="interesse-${opt.value}">${opt.label}</label>
            </div>
        `;
        if (opt.hasMultiselect && opt.value) {
            const show = checked ? 'show' : '';
            html += `<div class="conditional-input ${show}" id="potenza-multiselect">`;
            html += renderPotenzaMultiselect();
            html += '</div>';
        }
    });
    html += '</div>';
    return html;
}

function renderPotenzaMultiselect() {
    const selected = formData.produtosPotenzaInteresse || [];
        
    let html = `
        <p style="margin: 16px 0 12px; font-weight: 600;">Quais produtos gostaria de conhecer?</p>
        <div class="multiselect-container">
            <div class="multiselect-trigger" id="potenza-multiselect-trigger">
                <span>Selecione os produtos</span>
                <span>▼</span>
            </div>
            <div class="multiselect-dropdown" id="potenza-multiselect-dropdown">
                <div class="multiselect-options" id="potenza-multiselect-options">
    `;
        
    PRODUCTS.potenza.forEach(product => {
        const isSelected = selected.includes(product);
        // LÓGICA DO NOTION: Esconde item se já estiver selecionado
        const displayStyle = isSelected ? 'display: none;' : 'display: flex;'; 
        
        html += `
            <div class="multiselect-option ${isSelected ? 'selected' : ''}" data-value="${product}" style="${displayStyle}">
                <input type="checkbox" ${isSelected ? 'checked' : ''}> ${product}
            </div>
        `;
    });
        
    html += `
                </div>
            </div>
            <div class="selected-items" id="potenza-selected-items">
    `;
        
    selected.forEach(product => {
        html += `
            <div class="selected-item">
                ${product}
                <button type="button" onclick="removePotenzaProduct('${product}', event)">×</button>
            </div>
        `;
    });
        
    html += '</div></div>';
    return html;
}

// CORREÇÃO: Passa o evento e usa isMultiselectOpen
window.removePotenzaProduct = function(product, event) {
    event.stopPropagation();
    isMultiselectOpen = document.getElementById('potenza-multiselect-dropdown').classList.contains('open');

    formData.produtosPotenzaInteresse = formData.produtosPotenzaInteresse.filter(p => p !== product);
    renderQuestion(currentStep);
};

function renderCheckboxWithInputs(question) {
    let html = '<div class="checkbox-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field].includes(opt.value) ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="checkbox-option ${selected}" data-value="${opt.value}">
                <input type="checkbox" id="${opt.value}" value="${opt.value}" ${checked}>
                <label for="${opt.value}">${opt.label}</label>
            </div>
        `;
        if (opt.hasInput) {
            const show = checked ? 'show' : '';
            const fieldName = opt.value === 'dentais' ? 'parceriasOdonto' : 'parceriasEmpresas';
            html += `
                <div class="conditional-input ${show}" id="input-${opt.value}">
                    <p style="margin: 8px 0; font-size: 14px; color: var(--text-secondary);">${opt.inputLabel}</p>
                    <input type="text" id="${fieldName}" value="${formData[fieldName] || ''}" placeholder="Liste aqui...">
                </div>
            `;
        }
    });
    html += '</div>';
    return html;
}

function renderRadioWithInput(question) {
    let html = '<div class="radio-group">';
    question.options.forEach(opt => {
        const checked = formData[question.field] === opt.value ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="radio-option ${selected}" data-value="${opt.value}">
                <input type="radio" name="${question.field}" id="excl-${opt.value}" value="${opt.value}" ${checked}>
                <label for="excl-${opt.value}">${opt.label}</label>
            </div>
        `;
        if (opt.hasInput) {
            const show = checked ? 'show' : '';
            html += `
                <div class="conditional-input ${show}" id="input-exclusividade">
                    <p style="margin: 8px 0; font-size: 14px; color: var(--text-secondary);">${opt.inputLabel}</p>
                    <input type="text" id="exclusividadeLista" value="${formData.exclusividadeLista || ''}" placeholder="Liste aqui...">
                </div>
            `;
        }
    });
    html += '</div>';
    return html;
}

// Render course repeater (COMEÇA VAZIO)
function renderCourseRepeater() {
    let html = '<div id="courses-container">';
    
    formData.cursos.forEach((course, index) => {
        html += renderCourseItem(course, index);
    });

    html += '</div>';
    
    if (formData.cursos.length < 5) {
        html += '<button type="button" class="add-course" onclick="addCourse()">+ Cadastrar Curso</button>';
    } else {
        html += '<button type="button" class="add-course" disabled>Máximo de 5 cursos atingido</button>';
    }

    return html;
}

function renderCourseItem(course, index) {
    const isClosed = course.isClosed; 
    const closedClass = isClosed ? 'closed' : '';
    const arrow = isClosed ? '►' : '▼';
    const canRemove = formData.cursos.length > 0;
    const title = course.nome && course.nome.trim() !== '' ? 
                  (course.nome.length > 30 ? course.nome.substring(0, 30) + '...' : course.nome) : 
                  `Curso ${index + 1} (Aberto)`;

    return `
        <div class="course-item ${closedClass}" data-index="${index}">
            <div class="course-header ${closedClass}" onclick="toggleCourse(${index})">
                <div class="course-title">
                    <span class="course-arrow">${arrow}</span> 
                    ${title}
                </div>
                ${canRemove ? `<button type="button" class="remove-course" onclick="removeCourse(${index}, event)">Remover</button>` : ''}
            </div>
            
            <div class="course-content ${closedClass}" id="course-content-${index}">
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nome:</label>
                    <input type="text" class="course-nome" data-index="${index}" value="${course.nome}" placeholder="Nome do curso..." required>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Tipo:</label>
                    <div class="checkbox-group">
                        ${renderCourseTypes(course, index)}
                    </div>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Em quais regiões costuma realizar?</label>
                    <input type="text" class="course-regioes" data-index="${index}" value="${course.regioes}" placeholder="Liste as cidades, estados, regiões e/ou países" required>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual é a frequência?</label>
                    <div class="radio-group">
                        ${renderCourseFrequency(course, index)}
                    </div>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual a duração?</label>
                    <input type="text" class="course-duracao" data-index="${index}" value="${course.duracao}" placeholder='Ex: "44h", "5 finais de semana", "1 semestre"' required>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual costuma ser a média de alunos que participam?</label>
                    <input type="text" class="course-alunos" data-index="${index}" value="${course.mediaAlunos}" placeholder="Ex: 20 alunos" required>
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Divulgação - Link:</label>
                    <input type="url" class="course-divulgacao" data-index="${index}" value="${course.linkDivulgacao}" placeholder="https://...">
                </div>
                            
                <div class="input-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Conteúdo - Link:</label>
                    <input type="url" class="course-conteudo" data-index="${index}" value="${course.linkConteudo}" placeholder="https://...">
                </div>
                
                <button type="button" class="btn btn-primary" onclick="toggleCourse(${index}, true)" style="width: 100%; margin-top: 20px;">
                    <span>Concluir e Fechar Curso</span>
                </button>
            </div>
        </div>
    `;
}

function createEmptyCourse() {
    return {
        nome: '',
        tipos: [],
        tipoOutro: '',
        regioes: '',
        frequencia: '',
        duracao: '',
        mediaAlunos: '',
        linkDivulgacao: '',
        linkConteudo: '',
        isClosed: false 
    };
}

window.addCourse = function() {
    if (formData.cursos.length < 5) {
        formData.cursos.forEach(course => course.isClosed = true);
        formData.cursos.push(createEmptyCourse());
        renderQuestion(currentStep);
    }
};

window.removeCourse = function(index, event) {
    event.stopPropagation(); 
    if (formData.cursos.length > 0) {
        formData.cursos.splice(index, 1);
        renderQuestion(currentStep);
    }
};

window.toggleCourse = function(index, forceClose = false) {
    const course = formData.cursos[index];
    if (!course) return;

    if (forceClose) {
        if (course.nome && course.nome.trim() !== '' && course.regioes && course.regioes.trim() !== '') {
            course.isClosed = true;
        } else {
             alert('Por favor, preencha o Nome e Regiões do curso antes de fechar.');
             return;
        }
    } else {
        course.isClosed = !course.isClosed;
    }
    
    if (!course.isClosed) {
        formData.cursos.forEach((c, i) => {
            if (i !== index) {
                c.isClosed = true;
            }
        });
    }

    renderQuestion(currentStep); 
}

// ... (Restante das funções de renderização de curso)

function renderCourseTypes(course, index) {
    const types = ['Teórico', 'Prático', 'Hands-on', 'Curso Vip', 'Pós-graduação', 'Imersão', 'Outro'];
    let html = '';
    types.forEach(type => {
        const value = type.toLowerCase().replace(/[^a-z]/g, '');
        const checked = course.tipos.includes(value) ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `<div class="checkbox-option ${selected}" style="padding: 12px 16px;">
                <input type="checkbox" class="course-tipo" data-index="${index}" value="${value}" ${checked}>
                <label>${type}</label>
            </div>`;
        if (type === 'Outro') {
            const show = checked ? 'show' : '';
            html += `<div class="conditional-input ${show}" id="course-outro-${index}">
                    <input type="text" class="course-tipo-outro" data-index="${index}" value="${course.tipoOutro}" placeholder="Especifique...">
                </div>`;
        }
    });
    return html;
}

function renderCourseFrequency(course, index) {
    const options = [
        { value: 'fixas', label: 'Datas fixas e definidas com antecedência.' },
        { value: 'demanda', label: 'De acordo com demanda.' }
    ];
    let html = '';
    options.forEach(opt => {
        const checked = course.frequencia === opt.value ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `<div class="radio-option ${selected}" style="padding: 12px 16px;">
                <input type="radio" class="course-frequencia" name="freq-${index}" data-index="${index}" value="${opt.value}" ${checked}>
                <label>${opt.label}</label>
            </div>`;
    });
    return html;
}

// --- Lógica de Autocomplete (IBGE/Cidades) ---
function setupAutocomplete(question) {
    const input = document.getElementById(question.field);
    const options = question.options || []; 

    if (!input) return;

    input.closest('.input-group').style.position = 'relative';

    let listContainer = document.getElementById(`autocomplete-list-${question.field}`);
    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.className = 'autocomplete-list';
        listContainer.id = `autocomplete-list-${question.field}`;
        input.parentNode.insertBefore(listContainer, input.nextSibling);
    }
    
    let activeItem = -1;

    const renderList = (searchTerm) => {
        listContainer.innerHTML = '';
        activeItem = -1;
        
        if (searchTerm.length < 2) return;

        const filteredOptions = options.filter(item => 
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredOptions.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = item;
            div.addEventListener('click', () => selectItem(item));
            listContainer.appendChild(div);
        });
    };

    const selectItem = (value) => {
        formData[question.field] = value;
        input.value = value;
        listContainer.innerHTML = '';
        input.classList.remove('error');
    };

    input.addEventListener('input', (e) => {
        formData[question.field] = e.target.value;
        renderList(e.target.value);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-group') || e.target !== input) {
            listContainer.innerHTML = '';
        }
    });

    input.addEventListener('keydown', (e) => {
        const items = listContainer.querySelectorAll('.autocomplete-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeItem = (activeItem + 1) % items.length;
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === activeItem) item.classList.add('active');
            });
            if (items[activeItem]) items[activeItem].scrollIntoView({ block: 'nearest' });

        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeItem = (activeItem - 1 + items.length) % items.length;
            items.forEach((item, index) => {
                item.classList.remove('active');
                if (index === activeItem) item.classList.add('active');
            });
            if (items[activeItem]) items[activeItem].scrollIntoView({ block: 'nearest' });

        } else if (e.key === 'Enter' && activeItem > -1) {
            e.preventDefault();
            selectItem(items[activeItem].textContent);
        }
    });
}
// --- FIM Lógica de Autocomplete ---


// Setup navigation (Mantido)
function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const form = document.getElementById('phsForm');
        
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion(currentStep);
            updateProgress();
            updateNavigation();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
        
    nextBtn.addEventListener('click', () => {
        handleNextStep();
    });
    
    // Lógica para avanço com ENTER no formulário
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputField = e.target;
            const isAutocompleteOpen = document.querySelector('.autocomplete-list').innerHTML.trim() !== '';

            if (!isAutocompleteOpen && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault(); 
                handleNextStep();
            }
        }
    });
}

// Função de avanço do passo (usada pelo clique e pelo ENTER)
function handleNextStep() {
     if (validateCurrentQuestion()) {
        if (currentStep < questions.length - 1) {
            currentStep++;
            // Skip conditional questions
            while (currentStep < questions.length && questions[currentStep].conditional && !shouldShowQuestion(questions[currentStep])) {
                currentStep++;
            }
            if (currentStep < questions.length) {
                renderQuestion(currentStep);
                updateProgress();
                updateNavigation();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                submitForm();
            }
        } else {
            submitForm();
        }
    }
}

// Validate current question (Mantido)
function validateCurrentQuestion() {
    const question = questions[currentStep];
    const errorDiv = document.getElementById(`error-${question.id}`);
    let isValid = true;
    const input = document.getElementById(question.field);
        
    errorDiv.classList.remove('show');
    if (input) input.classList.remove('error');

    switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
            if (!formData[question.field] || formData[question.field].trim() === '') {
                isValid = false;
                errorDiv.textContent = 'Este campo é obrigatório';
            } else if (question.validation === 'email' && !isValidEmail(formData[question.field])) {
                isValid = false;
                errorDiv.textContent = 'Por favor, insira um e-mail válido';
            } else if (question.validation === 'phone' && !isValidPhone(formData[question.field])) {
                isValid = false;
                errorDiv.textContent = 'Por favor, insira um telefone válido com DDD (Ex: 47998887777)';
            }
            break;
                
        case 'checkbox':
        case 'checkbox-exclusive':
            if (formData[question.field].length === 0) {
                isValid = false;
                errorDiv.textContent = 'Selecione ao menos uma opção';
            }
            break;
                
        case 'multiselect':
            if (!formData.produtos || formData.produtos.length === 0) {
                isValid = false;
                errorDiv.textContent = 'Selecione ao menos um produto';
            }
            break;
        
        case 'radio-with-other':
            if (!formData[question.field]) {
                isValid = false;
            } else if (formData[question.field] === 'outro' && (!formData.motivoPotenzaOutro || formData.motivoPotenzaOutro.trim() === '')) {
                isValid = false;
                errorDiv.textContent = 'Por favor, especifique o motivo';
            }
            break;
                
        case 'checkbox-with-multiselect':
            if (formData[question.field] === undefined || formData.question.field === null) {
                isValid = false;
            } else if (formData.question.field === true && (!formData.produtosPotenzaInteresse || formData.produtosPotenzaInteresse.length === 0)) {
                isValid = false;
                errorDiv.textContent = 'Por favor, selecione ao menos um produto';
            }
            break;
                
        case 'checkbox-with-inputs':
            if (formData[question.field].length === 0) {
                isValid = false;
                errorDiv.textContent = 'Selecione ao menos uma opção';
            } else {
                const selected = formData[question.field];
                if (selected.includes('dentais') && (!formData.parceriasOdonto || formData.parceriasOdonto.trim() === '')) {
                    isValid = false;
                    errorDiv.textContent = 'Por favor, liste suas dentais parceiras.';
                } else if (selected.includes('empresas') && (!formData.parceriasEmpresas || formData.parceriasEmpresas.trim() === '')) {
                    isValid = false;
                    errorDiv.textContent = 'Por favor, liste as empresas parceiras.';
                }
            }
            break;
                
        case 'radio-with-input':
            if (formData[question.field] === undefined) {
                isValid = false;
            } else if (formData[question.field] === true && (!formData.exclusividadeLista || formData.exclusividadeLista.trim() === '')) {
                isValid = false;
                errorDiv.textContent = 'Por favor, liste as parcerias com exclusividade';
            }
            break;
                
        case 'course-repeater':
            isValid = validateCourses();
            if (!isValid) {
                errorDiv.textContent = 'Por favor, preencha todos os campos obrigatórios dos cursos';
            }
            break;
    }
        
    if (!isValid) {
        errorDiv.classList.add('show');
        if (input) input.classList.add('error');
        document.querySelectorAll(`#questionsContainer .conditional-input input`).forEach(input => {
            if (!input.value || input.value.trim() === '') {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
    }
        
    return isValid;
}


// Restante das funções de validação e formatação (mantidas)

function formatTiposParceria() { 
    if (formData.tiposParceria.length === 0) return '';
    const tipos = formData.tiposParceria.map(t => { if (t === 'conteudos') return 'Conteúdos para redes sociais'; if (t === 'cursos') return 'Cursos, treinamentos e/ou Hands-on'; return t; }).join(', ');
    return tipos; 
}

function formatMarcas() { 
    if (formData.marcas.length === 0) return '';
    const marcas = formData.marcas.map(m => { if (m === 'tokuyama') return 'Tokuyama'; if (m === 'potenza') return 'Potenza'; if (m === 'nictone') return 'Nic Tone'; if (m === 'nao-utilizei') return 'Ainda não utilizei'; return m; }).join(', ');
    return marcas; 
}

function formatProdutos() { 
    return formData.produtos.length > 0 ? formData.produtos.join(', ') : '';
}

function formatMotivoPotenza() { 
    if (!shouldShowQuestion({ id: 'q8.3' }) || !formData.motivoPotenza) return '';
    let motivo = formData.motivoPotenza;
    if (motivo === 'sem-oportunidade') motivo = 'Ainda não tive oportunidade de testar';
    else if (motivo === 'outras-marcas') motivo = 'Utilizo outras marcas';
    else if (motivo === 'testei') motivo = 'Testei e não me adaptei';
    else if (motivo === 'outro' && formData.motivoPotenzaOutro) motivo = formData.motivoPotenzaOutro;
    return motivo; 
}

function formatInteressePotenza() { 
    if (!shouldShowQuestion({ id: 'q8.4' }) || formData.interessePotenza === undefined || formData.interessePotenza === null) { return ''; }
    const interesse = formData.interessePotenza ? 'Sim' : 'Não';
    let output = `Interesse em testar: ${interesse}`;
    if (formData.interessePotenza && formData.produtosPotenzaInteresse && formData.produtosPotenzaInteresse.length > 0) { 
        output += `: ${formData.produtosPotenzaInteresse.join(', ')}`;
    }
    return output; 
}

function formatParceriasAtivas() { 
    let output = [];
    const parcerias = formData.parceriasAtivas;
    if (parcerias.includes('nenhuma')) { return 'Não possuo parcerias ativas'; }
    if (parcerias.includes('dentais') && formData.parceriasOdonto) { output.push(`Dentais: ${formData.parceriasOdonto}`); }
    if (parcerias.includes('empresas') && formData.parceriasEmpresas) { output.push(`Empresas: ${formData.parceriasEmpresas}`); }
    let result = output.join(' | ');
    if (shouldShowQuestion({ id: 'q10' }) && formData.exclusividade !== undefined) { 
        if (result) { result += ' | '; }
        result += `Exclusividade: ${formData.exclusividade ? 'Sim' : 'Não'}`;
        if (formData.exclusividade && formData.exclusividadeLista) { result += ` com: ${formData.exclusividadeLista}`; }
    }
    return result; 
}

function formatCursos() { 
    if (!formData.tiposParceria.includes('cursos') || formData.cursos.length === 0) { return ''; }
    let text = [];
    text.push(`[CURSO: Total Cadastrados]: ${formData.cursos.length}`);
    formData.cursos.forEach((course, index) => { 
        text.push(`\n\n--- CURSO ${index + 1}: ${course.nome || 'Sem Nome'} ---`);
        const tipos = course.tipos.map(t => { 
            let label = '';
            if (t === 'teorico') label = 'Teórico'; else if (t === 'pratico') label = 'Prático'; else if (t === 'handson') label = 'Hands-on'; else if (t === 'cursovip') label = 'Curso Vip'; else if (t === 'posgraduacao') label = 'Pós-graduação'; else if (t === 'imersao') label = 'Imersão'; else if (t === 'outro' && course.tipoOutro) label = `Outro: ${course.tipoOutro}`;
            return label;
        }).filter(l => l).join(', ');
        text.push(`- Tipo: ${tipos}`);
        text.push(`- Regiões: ${course.regioes}`);
        const freq = course.frequencia === 'fixas' ? 'Datas fixas e definidas com antecedência' : 'De acordo com demanda';
        text.push(`- Frequência: ${freq}`);
        text.push(`- Duração: ${course.duracao}`);
        text.push(`- Média de alunos: ${course.mediaAlunos}`);
        if (course.linkDivulgacao) { text.push(`- Link Divulgação: ${course.linkDivulgacao}`); }
        if (course.linkConteudo) { text.push(`- Link Conteúdo: ${course.linkConteudo}`); }
    });
    return text.join('\n'); 
}


// Submit form to RD Station (Mantido)
async function submitForm() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    const payload = {
        token_rdstation: RD_CONFIG.token, 
        identificador: RD_CONFIG.eventId, 
        email: formData.email,
        name: formData.name,
        mobile_phone: formData.cf_telefone_whatsapp,
        
        cf_telefone_whatsapp: formData.cf_telefone_whatsapp,
        cf_cidade_uf: formData.cf_cidade_uf,
        
        cf_instagram: formData.instagram,
        cf_tipo_de_parceria: formatTiposParceria(),
        cf_qual_marca_utiliza: formatMarcas(),
        cf_conhecimento_dominio_e_pratica_com_produtos: formatProdutos(),
        cf_motivo_de_nao_ter_testado_potenza: formatMotivoPotenza(),
        cf_interesse_em_potenza: formatInteressePotenza(),
        cf_tem_parcerias_ativas: formatParceriasAtivas(),
        cf_tipos_de_cursos_e_treinamentos: formatCursos()
    };

    try {
        const formParams = new URLSearchParams();
        for (const key in payload) {
            if (payload[key]) { 
                formParams.append(key, payload[key]);
            }
        }

        await fetch('https://www.rdstation.com.br/api/1.3/conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formParams
        });

        showSuccess();

    } catch (error) {
        console.error('Erro no envio (possivelmente falha de rede ou CORS):', error);
        showSuccess(); 
    }
}

// Função auxiliar para mostrar a tela de sucesso
function showSuccess() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    document.getElementById('successMessage').style.display = 'flex';
}
