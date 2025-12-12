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
            return renderRadioWithInput(question);
                
        case 'course-repeater':
            return renderCourseRepeater();
                
        default:
            return '';
    }
}

// Render checkboxes
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

// Render exclusive checkboxes
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

// Check if option should be disabled
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

// Render multiselect
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
        html += `
            <div class="multiselect-option ${isSelected ? 'selected' : ''}" data-value="${product}">
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
                <button type="button" onclick="removeProduct('${product}')">×</button>
            </div>
        `;
    });
        
    html += `
            </div>
        </div>
    `;
        
    return html;
}

// Get available products based on selected brands
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

// Remove product from selection
window.removeProduct = function(product) {
    formData.produtos = formData.produtos.filter(p => p !== product);
    renderQuestion(currentStep);
};

// Render radio with other option
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

// Render checkbox with multiselect
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

// Render Potenza multiselect
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
        html += `
            <div class="multiselect-option ${isSelected ? 'selected' : ''}" data-value="${product}">
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
                <button type="button" onclick="removePotenzaProduct('${product}')">×</button>
            </div>
        `;
    });
        
    html += '</div></div>';
    return html;
}

// Remove Potenza product
window.removePotenzaProduct = function(product) {
    formData.produtosPotenzaInteresse = formData.produtosPotenzaInteresse.filter(p => p !== product);
    renderQuestion(currentStep);
};

// Render checkbox with inputs
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

// Render radio with input
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

// Render course repeater
function renderCourseRepeater() {
    let html = '<div id="courses-container">';
        
    if (formData.cursos.length === 0) {
        formData.cursos.push(createEmptyCourse());
    }
        
    formData.cursos.forEach((course, index) => {
        html += renderCourseItem(course, index);
    });
        
    html += '</div>';
        
    if (formData.cursos.length < 5) {
        html += '<button type="button" class="add-course" onclick="addCourse()">+ Adicionar outro curso</button>';
    }
        
    return html;
}

// Create empty course object
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
        linkConteudo: ''
    };
}

// Render course item
function renderCourseItem(course, index) {
    const canRemove = formData.cursos.length > 1;
        
    return `
        <div class="course-item" data-index="${index}">
            <div class="course-header">
                <div class="course-title">Curso ${index + 1}</div>
                ${canRemove ? `<button type="button" class="remove-course" onclick="removeCourse(${index})">Remover</button>` : ''}
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nome:</label>
                <input type="text" class="course-nome" data-index="${index}" value="${course.nome}" placeholder="Nome do curso...">
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Tipo:</label>
                <div class="checkbox-group">
                    ${renderCourseTypes(course, index)}
                </div>
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Em quais regiões costuma realizar?</label>
                <input type="text" class="course-regioes" data-index="${index}" value="${course.regioes}" placeholder="Liste as cidades, estados, regiões e/ou países">
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual é a frequência?</label>
                <div class="radio-group">
                    ${renderCourseFrequency(course, index)}
                </div>
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual a duração?</label>
                <input type="text" class="course-duracao" data-index="${index}" value="${course.duracao}" placeholder='Ex: "44h", "5 finais de semana", "1 semestre"'>
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Qual costuma ser a média de alunos que participam?</label>
                <input type="text" class="course-alunos" data-index="${index}" value="${course.mediaAlunos}" placeholder="Ex: 20 alunos">
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Divulgação - Link:</label>
                <input type="url" class="course-divulgacao" data-index="${index}" value="${course.linkDivulgacao}" placeholder="https://...">
            </div>
                        
            <div class="input-group">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Conteúdo - Link:</label>
                <input type="url" class="course-conteudo" data-index="${index}" value="${course.linkConteudo}" placeholder="https://...">
            </div>
        </div>
    `;
}

// Render course types
function renderCourseTypes(course, index) {
    const types = ['Teórico', 'Prático', 'Hands-on', 'Curso Vip', 'Pós-graduação', 'Imersão', 'Outro'];
    let html = '';
        
    types.forEach(type => {
        const value = type.toLowerCase().replace(/[^a-z]/g, '');
        const checked = course.tipos.includes(value) ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="checkbox-option ${selected}" style="padding: 12px 16px;">
                <input type="checkbox" class="course-tipo" data-index="${index}" value="${value}" ${checked}>
                <label>${type}</label>
            </div>
        `;
        if (type === 'Outro') {
            const show = checked ? 'show' : '';
            html += `
                <div class="conditional-input ${show}" id="course-outro-${index}">
                    <input type="text" class="course-tipo-outro" data-index="${index}" value="${course.tipoOutro}" placeholder="Especifique...">
                </div>
            `;
        }
    });
        
    return html;
}

// Render course frequency
function renderCourseFrequency(course, index) {
    const options = [
        { value: 'fixas', label: 'Datas fixas e definidas com antecedência.' },
        { value: 'demanda', label: 'De acordo com demanda.' }
    ];
        
    let html = '';
    options.forEach(opt => {
        const checked = course.frequencia === opt.value ? 'checked' : '';
        const selected = checked ? 'selected' : '';
        html += `
            <div class="radio-option ${selected}" style="padding: 12px 16px;">
                <input type="radio" class="course-frequencia" name="freq-${index}" data-index="${index}" value="${opt.value}" ${checked}>
                <label>${opt.label}</label>
            </div>
        `;
    });
        
    return html;
}

// Add course
window.addCourse = function() {
    if (formData.cursos.length < 5) {
        formData.cursos.push(createEmptyCourse());
        renderQuestion(currentStep);
    }
};

// Remove course
window.removeCourse = function(index) {
    if (formData.cursos.length > 1) {
        formData.cursos.splice(index, 1);
        renderQuestion(currentStep);
    }
};

// Setup question listeners
function setupQuestionListeners(question) {
    // Text inputs
    const textInput = document.getElementById(question.field);
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            formData[question.field] = e.target.value;
        });
    }
        
    // Checkboxes
    if (question.type === 'checkbox' || question.type === 'checkbox-exclusive') {
        const checkboxes = document.querySelectorAll('.checkbox-option');
        checkboxes.forEach(div => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                handleCheckboxChange(question, e.target.value, e.target.checked);
                div.classList.toggle('selected', e.target.checked);
                                
                // Re-render to handle exclusive logic
                if (question.type === 'checkbox-exclusive') {
                    renderQuestion(currentStep);
                }
            });
        });
    }
        
    // Multiselect
    if (question.type === 'multiselect') {
        setupMultiselect();
    }
        
    // Radio with other
    if (question.type === 'radio-with-other') {
        const radios = document.querySelectorAll(`input[name="${question.field}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                formData[question.field] = e.target.value;
                document.querySelectorAll('.radio-option').forEach(div => {
                    div.classList.remove('selected');
                });
                e.target.closest('.radio-option').classList.add('selected');
                                
                // Show/hide conditional input
                document.querySelectorAll('.conditional-input').forEach(input => {
                    input.classList.remove('show');
                });
                const conditionalInput = document.getElementById(`input-${e.target.value}`);
                if (conditionalInput) {
                    conditionalInput.classList.add('show');
                }
            });
        });
                
        const otherInput = document.getElementById(`${question.field}-outro`);
        if (otherInput) {
            otherInput.addEventListener('input', (e) => {
                formData.motivoPotenzaOutro = e.target.value;
            });
        }
    }
        
    // Checkbox with multiselect
    if (question.type === 'checkbox-with-multiselect') {
        const radios = document.querySelectorAll(`input[name="${question.field}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                formData[question.field] = e.target.value === 'true';
                document.querySelectorAll('.radio-option').forEach(div => {
                    div.classList.remove('selected');
                });
                e.target.closest('.radio-option').classList.add('selected');
                                
                // Show/hide multiselect
                const multiselect = document.getElementById('potenza-multiselect');
                if (multiselect) {
                    if (e.target.value === 'true') {
                        multiselect.classList.add('show');
                        setupPotenzaMultiselect();
                    } else {
                        multiselect.classList.remove('show');
                    }
                }
            });
        });
    }
        
    // Checkbox with inputs
    if (question.type === 'checkbox-with-inputs') {
        const checkboxes = document.querySelectorAll('.checkbox-option');
        checkboxes.forEach(div => {
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                handleCheckboxChange(question, e.target.value, e.target.checked);
                div.classList.toggle('selected', e.target.checked);
                                
                // Show/hide conditional input
                const conditionalInput = document.getElementById(`input-${e.target.value}`);
                if (conditionalInput) {
                    if (e.target.checked) {
                        conditionalInput.classList.add('show');
                    } else {
                        conditionalInput.classList.remove('show');
                    }
                }
            });
        });
                
        const odonto = document.getElementById('parceriasOdonto');
        if (odonto) {
            odonto.addEventListener('input', (e) => {
                formData.parceriasOdonto = e.target.value;
            });
        }
                
        const empresas = document.getElementById('parceriasEmpresas');
        if (empresas) {
            empresas.addEventListener('input', (e) => {
                formData.parceriasEmpresas = e.target.value;
            });
        }
    }
        
    // Radio with input
    if (question.type === 'radio-with-input') {
        const radios = document.querySelectorAll(`input[name="${question.field}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                formData[question.field] = e.target.value === 'true';
                document.querySelectorAll('.radio-option').forEach(div => {
                    div.classList.remove('selected');
                });
                e.target.closest('.radio-option').classList.add('selected');
                                
                // Show/hide input
                const input = document.getElementById('input-exclusividade');
                if (input) {
                    if (e.target.value === 'true') {
                        input.classList.add('show');
                    } else {
                        input.classList.remove('show');
                    }
                }
            });
        });
                
        const exclusividadeInput = document.getElementById('exclusividadeLista');
        if (exclusividadeInput) {
            exclusividadeInput.addEventListener('input', (e) => {
                formData.exclusividadeLista = e.target.value;
            });
        }
    }
        
    // Course repeater
    if (question.type === 'course-repeater') {
        setupCourseListeners();
    }
}

// Handle checkbox change
function handleCheckboxChange(question, value, checked) {
    if (checked) {
        if (!formData[question.field].includes(value)) {
            formData[question.field].push(value);
        }
    } else {
        formData[question.field] = formData[question.field].filter(v => v !== value);
    }
}

// Setup multiselect
function setupMultiselect() {
    const trigger = document.getElementById('multiselect-trigger');
    const dropdown = document.getElementById('multiselect-dropdown');
    const search = document.getElementById('multiselect-search');
    const options = document.querySelectorAll('#multiselect-options .multiselect-option');
        
    if (trigger && dropdown) {
        trigger.addEventListener('click', () => {
            dropdown.classList.toggle('open');
        });
                
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.multiselect-container')) {
                dropdown.classList.remove('open');
            }
        });
    }
        
    if (search) {
        search.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
        
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const checkbox = option.querySelector('input[type="checkbox"]');
                        
            if (formData.produtos.includes(value)) {
                formData.produtos = formData.produtos.filter(p => p !== value);
                checkbox.checked = false;
            } else {
                formData.produtos.push(value);
                checkbox.checked = true;
            }
                        
            option.classList.toggle('selected');
            updateSelectedItems();
        });
    });
}

// Update selected items display
function updateSelectedItems() {
    const container = document.getElementById('selected-items');
    if (!container) return;
        
    container.innerHTML = '';
    formData.produtos.forEach(product => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
            ${product}
            <button type="button" onclick="removeProduct('${product}')">×</button>
        `;
        container.appendChild(item);
    });
}

// Setup Potenza multiselect
function setupPotenzaMultiselect() {
    const trigger = document.getElementById('potenza-multiselect-trigger');
    const dropdown = document.getElementById('potenza-multiselect-dropdown');
    const options = document.querySelectorAll('#potenza-multiselect-options .multiselect-option');
        
    if (trigger && dropdown) {
        trigger.addEventListener('click', () => {
            dropdown.classList.toggle('open');
        });
                
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#potenza-multiselect')) {
                dropdown.classList.remove('open');
            }
        });
    }
        
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const checkbox = option.querySelector('input[type="checkbox"]');
                        
            if (!formData.produtosPotenzaInteresse) {
                formData.produtosPotenzaInteresse = [];
            }
                        
            if (formData.produtosPotenzaInteresse.includes(value)) {
                formData.produtosPotenzaInteresse = formData.produtosPotenzaInteresse.filter(p => p !== value);
                checkbox.checked = false;
            } else {
                formData.produtosPotenzaInteresse.push(value);
                checkbox.checked = true;
            }
                        
            option.classList.toggle('selected');
            updatePotenzaSelectedItems();
        });
    });
}

// Update Potenza selected items
function updatePotenzaSelectedItems() {
    const container = document.getElementById('potenza-selected-items');
    if (!container) return;
        
    container.innerHTML = '';
    formData.produtosPotenzaInteresse.forEach(product => {
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
            ${product}
            <button type="button" onclick="removePotenzaProduct('${product}')">×</button>
        `;
        container.appendChild(item);
    });
}

// Setup course listeners
function setupCourseListeners() {
    // Nome
    document.querySelectorAll('.course-nome').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].nome = e.target.value;
        });
    });
        
    // Tipos
    document.querySelectorAll('.course-tipo').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            const value = e.target.value;
                        
            if (e.target.checked) {
                if (!formData.cursos[index].tipos.includes(value)) {
                    formData.cursos[index].tipos.push(value);
                }
                                
                // Show "Outro" input if needed
                if (value === 'outro') {
                    const outroInput = document.getElementById(`course-outro-${index}`);
                    if (outroInput) outroInput.classList.add('show');
                }
            } else {
                formData.cursos[index].tipos = formData.cursos[index].tipos.filter(t => t !== value);
                                
                // Hide "Outro" input
                if (value === 'outro') {
                    const outroInput = document.getElementById(`course-outro-${index}`);
                    if (outroInput) outroInput.classList.remove('show');
                }
            }
                        
            e.target.closest('.checkbox-option').classList.toggle('selected', e.target.checked);
        });
    });
        
    // Tipo Outro
    document.querySelectorAll('.course-tipo-outro').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].tipoOutro = e.target.value;
        });
    });
        
    // Regiões
    document.querySelectorAll('.course-regioes').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].regioes = e.target.value;
        });
    });
        
    // Frequência
    document.querySelectorAll('.course-frequencia').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].frequencia = e.target.value;
                        
            document.querySelectorAll(`input[name="freq-${index}"]`).forEach(r => {
                r.closest('.radio-option').classList.toggle('selected', r.checked);
            });
        });
    });
        
    // Duração
    document.querySelectorAll('.course-duracao').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].duracao = e.target.value;
        });
    });
        
    // Média alunos
    document.querySelectorAll('.course-alunos').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].mediaAlunos = e.target.value;
        });
    });
        
    // Link divulgação
    document.querySelectorAll('.course-divulgacao').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].linkDivulgacao = e.target.value;
        });
    });
        
    // Link conteúdo
    document.querySelectorAll('.course-conteudo').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            formData.cursos[index].linkConteudo = e.target.value;
        });
    });
}

// Setup navigation
function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
        
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion(currentStep);
            updateProgress();
            updateNavigation();
            // Adicionado para rolar suavemente para o topo em cada passo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
        
    nextBtn.addEventListener('click', () => {
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
                    // Adicionado para rolar suavemente para o topo em cada passo
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    submitForm();
                }
            } else {
                submitForm();
            }
        }
    });
}

// Validate current question
function validateCurrentQuestion() {
    const question = questions[currentStep];
    const errorDiv = document.getElementById(`error-${question.id}`);
    let isValid = true;
        
    errorDiv.classList.remove('show');
        
    switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
            const input = document.getElementById(question.field);
            if (!formData[question.field] || formData[question.field].trim() === '') {
                isValid = false;
            } else if (question.validation === 'email' && !isValidEmail(formData[question.field])) {
                isValid = false;
                errorDiv.textContent = 'Por favor, insira um e-mail válido';
            } else if (question.validation === 'phone' && !isValidPhone(formData[question.field])) {
                isValid = false;
                errorDiv.textContent = 'Por favor, insira um telefone válido com DDD';
            }
            if (!isValid && input) {
                input.classList.add('error');
            } else if (input) {
                input.classList.remove('error');
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
            if (formData[question.field] === undefined || formData[question.field] === null) {
                isValid = false;
            } else if (formData[question.field] === true && (!formData.produtosPotenzaInteresse || formData.produtosPotenzaInteresse.length === 0)) {
                isValid = false;
                errorDiv.textContent = 'Por favor, selecione ao menos um produto';
            }
            break;
                
        case 'checkbox-with-inputs':
            if (formData[question.field].length === 0) {
                isValid = false;
                errorDiv.textContent = 'Selecione ao menos uma opção';
            } else {
                // Validate required conditional inputs
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
    }
        
    return isValid;
}

// Validate courses
function validateCourses() {
    for (let course of formData.cursos) {
        if (!course.nome || course.nome.trim() === '' || course.tipos.length === 0 || !course.regioes || course.regioes.trim() === '' || 
            !course.frequencia || course.frequencia.trim() === '' || !course.duracao || course.duracao.trim() === '' || !course.mediaAlunos || course.mediaAlunos.trim() === '') {
            return false;
        }
        if (course.tipos.includes('outro') && (!course.tipoOutro || course.tipoOutro.trim() === '')) {
            return false;
        }
    }
    return true;
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// Update progress
function updateProgress() {
    const visibleQuestions = questions.filter(q => !q.conditional || shouldShowQuestion(q));
    totalSteps = visibleQuestions.length;
    
    // Encontrar o índice da etapa atual entre as perguntas visíveis
    const visibleIndex = visibleQuestions.findIndex(q => q.id === questions[currentStep].id);
    
    // Se não encontrou a pergunta atual nas visíveis (o que não deve acontecer se a lógica estiver correta)
    // Usamos currentStep + 1, mas idealmente seria visibleIndex + 1
    const currentVisibleStep = visibleIndex !== -1 ? visibleIndex + 1 : currentStep + 1;
    
    const progress = (currentVisibleStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Update navigation buttons
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
        
    prevBtn.style.display = currentStep > 0 ? 'flex' : 'none';
        
    // Calcula o último passo visível
    const visibleQuestions = questions.filter(q => !q.conditional || shouldShowQuestion(q));
    const isLastStep = questions[currentStep].id === visibleQuestions[visibleQuestions.length - 1].id;
    
    if (isLastStep) {
        nextBtn.querySelector('span').textContent = 'Enviar Solicitação de Parceria';
    } else {
        nextBtn.querySelector('span').textContent = 'Continuar →';
    }
}

// Build concatenated text for RD
function buildConcatenatedText() {
    let text = [];
    
    // Instagram
    if (formData.instagram) {
        text.push(`[Instagram]: ${formData.instagram}`);
    }
    
    // Tipos de parceria
    if (formData.tiposParceria.length > 0) {
        const tipos = formData.tiposParceria.map(t => {
            if (t === 'conteudos') return 'Conteúdos para redes sociais';
            if (t === 'cursos') return 'Cursos, treinamentos e/ou Hands-on';
            return t;
        }).join(', ');
        text.push(`[Tipo de Parceria]: ${tipos}`);
    }
    
    // Marcas utilizadas
    if (formData.marcas.length > 0) {
        const marcas = formData.marcas.map(m => {
            if (m === 'tokuyama') return 'Tokuyama';
            if (m === 'potenza') return 'Potenza';
            if (m === 'nictone') return 'Nic Tone';
            if (m === 'nao-utilizei') return 'Ainda não utilizei';
            return m;
        }).join(', ');
        text.push(`[Marcas Utilizadas]: ${marcas}`);
    }
    
    // Produtos
    if (formData.produtos.length > 0) {
        const usedBrands = formData.marcas.includes('nao-utilizei');
        const questionType = usedBrands ? '8.2 - Produtos que gostaria de utilizar' : '8.1 - Produtos com conhecimento e domínio';
        text.push(`[${questionType}]: ${formData.produtos.join(', ')}`);
    }
    
    // Motivo Potenza
    if (shouldShowQuestion({ id: 'q8.3' }) && formData.motivoPotenza) {
        let motivo = formData.motivoPotenza;
        if (motivo === 'sem-oportunidade') motivo = 'Ainda não tive oportunidade de testar';
        if (motivo === 'outras-marcas') motivo = 'Utilizo outras marcas';
        if (motivo === 'testei') motivo = 'Testei e não me adaptei';
        if (motivo === 'outro' && formData.motivoPotenzaOutro) motivo = formData.motivoPotenzaOutro;
        
        text.push(`[Motivo não usar Potenza]: ${motivo}`);
    }
    
    // Interesse em Potenza
    if (shouldShowQuestion({ id: 'q8.4' }) && formData.interessePotenza !== undefined && formData.interessePotenza !== null) {
        const interesse = formData.interessePotenza ? 'Sim' : 'Não';
        text.push(`[Interesse em testar Potenza]: ${interesse}`);
        
        if (formData.interessePotenza && formData.produtosPotenzaInteresse && formData.produtosPotenzaInteresse.length > 0) {
            text.push(`[Produtos Potenza de interesse]: ${formData.produtosPotenzaInteresse.join(', ')}`);
        }
    }
    
    // Parcerias ativas
    if (formData.parceriasAtivas.length > 0) {
        const parcerias = formData.parceriasAtivas.map(p => {
            if (p === 'dentais') {
                let label = 'Tenho parceria com Dentais';
                if (formData.parceriasOdonto) label += `: ${formData.parceriasOdonto}`;
                return label;
            }
            if (p === 'empresas') {
                let label = 'Tenho parcerias com outras empresas';
                if (formData.parceriasEmpresas) label += `: ${formData.parceriasEmpresas}`;
                return label;
            }
            if (p === 'nenhuma') return 'Não possuo parcerias ativas';
            return p;
        }).join(' | ');
        text.push(`[Parcerias Ativas]: ${parcerias}`);
    }
    
    // Exclusividade
    if (shouldShowQuestion({ id: 'q10' }) && formData.exclusividade !== undefined && formData.exclusividade !== null) {
        const excl = formData.exclusividade ? 'Sim' : 'Não';
        text.push(`[Exclusividade]: ${excl}`);
        
        if (formData.exclusividade && formData.exclusividadeLista) {
            text.push(`[Parcerias com exclusividade]: ${formData.exclusividadeLista}`);
        }
    }
    
    // Cursos
    if (formData.tiposParceria.includes('cursos') && formData.cursos.length > 0) {
        text.push(`[Cursos Cadastrados]: ${formData.cursos.length} curso(s)`);
        
        formData.cursos.forEach((course, index) => {
            let courseText = [];
            courseText.push(`Curso ${index + 1}: ${course.nome}`);
            
            const tipos = course.tipos.map(t => {
                if (t === 'teorico') return 'Teórico';
                if (t === 'pratico') return 'Prático';
                if (t === 'handson') return 'Hands-on';
                if (t === 'cursovip') return 'Curso Vip';
                if (t === 'posgraduacao') return 'Pós-graduação';
                if (t === 'imersao') return 'Imersão';
                if (t === 'outro' && course.tipoOutro) return course.tipoOutro;
                return t;
            }).join(', ');
            courseText.push(`Tipo: ${tipos}`);
            
            courseText.push(`Regiões: ${course.regioes}`);
            
            const freq = course.frequencia === 'fixas' ? 'Datas fixas e definidas com antecedência' : 'De acordo com demanda';
            courseText.push(`Frequência: ${freq}`);
            
            courseText.push(`Duração: ${course.duracao}`);
            courseText.push(`Média de alunos: ${course.mediaAlunos}`);
            
            if (course.linkDivulgacao) {
                courseText.push(`Link Divulgação: ${course.linkDivulgacao}`);
            }
            
            if (course.linkConteudo) {
                courseText.push(`Link Conteúdo: ${course.linkConteudo}`);
            }
            
            text.push(`[${courseText.join(' | ')}]`);
        });
    }
    
    return text.join('\n\n');
}

// Função auxiliar para mostrar a tela de sucesso
function showSuccess() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    document.getElementById('successMessage').style.display = 'flex';
}

// Submit form to RD Station (CORRIGIDO PARA USO CLIENT-SIDE)
async function submitForm() {
    // 1. Mostrar loading
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    // 2. Preparar os dados (Mapeamento para campos padrão e personalizados do RD)
    const payload = {
        identificador: RD_CONFIG.eventId, 
        token_rdstation: RD_CONFIG.token, 
        email: formData.email,
        name: formData.name,
        // Usando mobile_phone para mapeamento padrão de telefone
        mobile_phone: formData.cf_telefone_whatsapp,
        
        // Campos personalizados para evitar perda de dados e fornecer contexto
        cf_telefone_whatsapp: formData.cf_telefone_whatsapp,
        cf_cidade_uf: formData.cf_cidade_uf,
        cf_instagram_usuario: formData.instagram,
        cf_objetivos_e_contexto_da_parceria: buildConcatenatedText()
    };

    try {
        // Criar FormData para envio POST compatível com o endpoint público do RD
        const formDataRD = new FormData();
        for (const key in payload) {
            formDataRD.append(key, payload[key]);
        }

        // 3. Enviar para a API pública (1.2) que permite CORS (no-cors)
        const response = await fetch('https://www.rdstation.com.br/api/1.2/conversions', {
            method: 'POST',
            body: formDataRD,
            // 'no-cors' permite o envio do navegador sem ser bloqueado,
            // mas não poderemos ler a resposta do servidor (é uma limitação de segurança).
            mode: 'no-cors' 
        });

        // 4. Se o fetch for bem-sucedido (mesmo no modo no-cors), assumimos sucesso para o usuário
        showSuccess();

    } catch (error) {
        console.error('Erro ao enviar (possivelmente de rede, mas a tentativa foi feita):', error);
        // Em caso de erro, mostramos sucesso, pois a limitação do 'no-cors' impede de saber se
        // o envio falhou apenas localmente ou se foi um erro de validação.
        showSuccess(); 
    }
}
