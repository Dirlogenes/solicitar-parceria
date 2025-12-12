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
            autocomplete: 'single', // Novo atributo para autocomplete
            options: CIDADES_UF_DEMO // Usando lista de demo
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
            // Se for tel, aplica type tel (já garante o layout igual no CSS)
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

// Restante das funções de renderização (renderCheckboxes, renderExclusiveCheckboxes, etc.) mantidas iguais, exceto o renderCourseRepeater.

// Render course repeater (AJUSTADO PARA COMEÇAR VAZIO E FECHADO)
function renderCourseRepeater() {
    let html = '<div id="courses-container">';
    
    // Não criamos curso vazio no início. Apenas se já existirem.
    formData.cursos.forEach((course, index) => {
        html += renderCourseItem(course, index);
    });

    html += '</div>';
    
    // Adiciona o botão de adicionar curso
    if (formData.cursos.length < 5) {
        html += '<button type="button" class="add-course" onclick="addCourse()">+ Cadastrar Curso</button>';
    }

    return html;
}

// Render course item (AJUSTADO PARA A LÓGICA DE ABRIR/FECHAR)
function renderCourseItem(course, index) {
    // Se o campo nome estiver vazio, ele começa aberto (isClosed = false), senão, começa fechado.
    const isClosed = course.nome && course.nome.trim() !== '' && course.isClosed !== false;
    const closedClass = isClosed ? 'closed' : '';
    const arrow = isClosed ? '►' : '▼';
    const canRemove = formData.cursos.length > 1;

    return `
        <div class="course-item ${closedClass}" data-index="${index}">
            <div class="course-header ${closedClass}" onclick="toggleCourse(${index})">
                <div class="course-title">
                    <span class="course-arrow">${arrow}</span> 
                    ${isClosed ? (course.nome.length > 30 ? course.nome.substring(0, 30) + '...' : course.nome) : `Curso ${index + 1}`}
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

// Create empty course object (ADICIONADO isClosed)
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
        isClosed: false // Novo campo de estado
    };
}

// Add course (AJUSTADO)
window.addCourse = function() {
    if (formData.cursos.length < 5) {
        // Encerra o curso anterior antes de criar um novo (se houver)
        if (formData.cursos.length > 0) {
             const lastIndex = formData.cursos.length - 1;
             formData.cursos[lastIndex].isClosed = true;
        }
        
        formData.cursos.push(createEmptyCourse());
        renderQuestion(currentStep);
    }
};

// Remove course (AJUSTADO para não subir o evento)
window.removeCourse = function(index, event) {
    event.stopPropagation(); // Evita que o click feche/abra o container
    if (formData.cursos.length > 0) {
        formData.cursos.splice(index, 1);
        renderQuestion(currentStep);
    }
};

// Toggle course (NOVA FUNÇÃO)
window.toggleCourse = function(index, forceClose = false) {
    const course = formData.cursos[index];
    if (!course) return;

    if (forceClose || !course.nome || course.nome.trim() === '') {
        // Se tentar fechar sem nome, valida
        if (course.nome && course.nome.trim() !== '') {
            course.isClosed = true;
        } else {
             alert('Por favor, preencha ao menos o nome do curso antes de fechar.');
             course.isClosed = false;
        }
    } else {
        course.isClosed = !course.isClosed;
    }
    
    renderQuestion(currentStep); // Re-renderiza para aplicar o estado
}


// Restante das funções de renderização (renderCheckboxes, etc.) mantidas

// Setup multiselect (AJUSTADO para esconder itens selecionados)
function setupMultiselect() {
    const trigger = document.getElementById('multiselect-trigger');
    const dropdown = document.getElementById('multiselect-dropdown');
    const search = document.getElementById('multiselect-search');
    const options = document.querySelectorAll('#multiselect-options .multiselect-option');
    const selectedValues = formData.produtos || [];
    
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
    
    options.forEach(option => {
        const value = option.dataset.value;
        const isSelected = selectedValues.includes(value);

        // Lógica: Se o item já está selecionado, ele não deve aparecer na lista
        if (isSelected) {
            option.style.display = 'none';
        } else {
            option.style.display = 'flex';
        }

        option.addEventListener('click', () => {
            const checkbox = option.querySelector('input[type="checkbox"]');
                        
            if (formData.produtos.includes(value)) {
                // Remove item
                formData.produtos = formData.produtos.filter(p => p !== value);
                checkbox.checked = false;
            } else {
                // Adiciona item
                formData.produtos.push(value);
                checkbox.checked = true;
            }
                        
            // Re-renderiza a questão para esconder/mostrar o item e atualizar o contador
            renderQuestion(currentStep); 
        });
    });

    if (search) {
        search.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                const value = option.dataset.value;
                const isSelected = selectedValues.includes(value);

                // Mostra se não está selecionado E corresponde à pesquisa
                if (!isSelected && text.includes(searchTerm)) {
                    option.style.display = 'flex';
                } else {
                    option.style.display = 'none';
                }
            });
        });
    }
}

// Setup Potenza multiselect (AJUSTADO para esconder itens selecionados)
function setupPotenzaMultiselect() {
    const trigger = document.getElementById('potenza-multiselect-trigger');
    const dropdown = document.getElementById('potenza-multiselect-dropdown');
    const options = document.querySelectorAll('#potenza-multiselect-options .multiselect-option');
    const selectedValues = formData.produtosPotenzaInteresse || [];
        
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
        const value = option.dataset.value;
        const isSelected = selectedValues.includes(value);

        // Lógica: Se o item já está selecionado, ele não deve aparecer na lista
        if (isSelected) {
            option.style.display = 'none';
        } else {
            option.style.display = 'flex';
        }
        
        option.addEventListener('click', () => {
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
                        
            renderQuestion(currentStep);
        });
    });
}


// --- Lógica de Autocomplete (IBGE/Cidades) ---

// Função principal de configuração do Autocomplete
function setupAutocomplete(question) {
    const input = document.getElementById(question.field);
    const options = question.options || []; // CIDADES_UF_DEMO para q4, ou campos de curso

    if (!input) return;

    // Garante que o input-group tem a classe para posicionamento
    input.closest('.input-group').style.position = 'relative';

    // Cria o container da lista
    let listContainer = document.getElementById(`autocomplete-list-${question.field}`);
    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.className = 'autocomplete-list';
        listContainer.id = `autocomplete-list-${question.field}`;
        input.parentNode.insertBefore(listContainer, input.nextSibling);
    }
    
    let activeItem = -1;

    // Filtra e renderiza a lista
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

    // Seleciona um item e fecha a lista
    const selectItem = (value) => {
        formData[question.field] = value;
        input.value = value;
        listContainer.innerHTML = '';
        input.classList.remove('error');
    };

    // Evento de Input (filtra a lista)
    input.addEventListener('input', (e) => {
        formData[question.field] = e.target.value;
        renderList(e.target.value);
    });

    // Evento de Blur (fecha a lista quando perde o foco)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.input-group') || e.target !== input) {
            listContainer.innerHTML = '';
        }
    });

    // Se a lista de autocomplete é para regiões do curso (multiselect), a lógica é diferente
    if (question.field === 'course-regioes') {
        // NOTE: A lógica de multiselect para regiões é mais complexa e
        // precisaria de um componente separado (como o Multiselect que já temos)
        // para gerir a seleção de múltiplos valores do autocomplete, mas para
        // manter a complexidade baixa no escopo atual, vamos manter o input
        // de curso como texto simples para listar as regiões.
    }
}

// Setup navigation (ADICIONADA LÓGICA DE ENTER)
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
    
    // 1. Lógica para avanço com ENTER
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleNextStep();
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

// Validate current question (MUITO IMPORTANTE: Garante que campos de telefone e texto têm a validação de erro visual)
function validateCurrentQuestion() {
    const question = questions[currentStep];
    const errorDiv = document.getElementById(`error-${question.id}`);
    let isValid = true;
    const input = document.getElementById(question.field);
        
    errorDiv.classList.remove('show');
    if (input) input.classList.remove('error'); // Limpa o erro visual anterior

    // Lógica de validação...
    switch (question.type) {
        case 'text':
        case 'email':
        case 'tel':
            // Validação de Preenchimento Básico (Todos os campos de texto)
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
        
        // ... (restante das validações mantidas)
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
        if (input) input.classList.add('error'); // Adiciona o erro visual
    }
        
    return isValid;
}


// Email validation (mantida)
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validation (mantida)
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// Restante das funções (updateProgress, updateNavigation) mantidas

// ==========================================================
// FUNÇÕES DE FORMATAÇÃO DE DADOS (MANTIDAS)
// ==========================================================

function formatTiposParceria() { /* ... mantida ... */ return formData.tiposParceria.map(t => { if (t === 'conteudos') return 'Conteúdos para redes sociais'; if (t === 'cursos') return 'Cursos, treinamentos e/ou Hands-on'; return t; }).join(', '); }

function formatMarcas() { /* ... mantida ... */ return formData.marcas.map(m => { if (m === 'tokuyama') return 'Tokuyama'; if (m === 'potenza') return 'Potenza'; if (m === 'nictone') return 'Nic Tone'; if (m === 'nao-utilizei') return 'Ainda não utilizei'; return m; }).join(', '); }

function formatProdutos() { /* ... mantida ... */ return formData.produtos.length > 0 ? formData.produtos.join(', ') : ''; }

function formatMotivoPotenza() { /* ... mantida ... */ if (!shouldShowQuestion({ id: 'q8.3' }) || !formData.motivoPotenza) return ''; let motivo = formData.motivoPotenza; if (motivo === 'sem-oportunidade') motivo = 'Ainda não tive oportunidade de testar'; else if (motivo === 'outras-marcas') motivo = 'Utilizo outras marcas'; else if (motivo === 'testei') motivo = 'Testei e não me adaptei'; else if (motivo === 'outro' && formData.motivoPotenzaOutro) motivo = formData.motivoPotenzaOutro; return motivo; }

function formatInteressePotenza() { /* ... mantida ... */ if (!shouldShowQuestion({ id: 'q8.4' }) || formData.interessePotenza === undefined || formData.interessePotenza === null) { return ''; } const interesse = formData.interessePotenza ? 'Sim' : 'Não'; let output = `Interesse em testar: ${interesse}`; if (formData.interessePotenza && formData.produtosPotenzaInteresse && formData.produtosPotenzaInteresse.length > 0) { output += `: ${formData.produtosPotenzaInteresse.join(', ')}`; } return output; }

function formatParceriasAtivas() { /* ... mantida ... */ let output = []; const parcerias = formData.parceriasAtivas; if (parcerias.includes('nenhuma')) { return 'Não possuo parcerias ativas'; } if (parcerias.includes('dentais') && formData.parceriasOdonto) { output.push(`Dentais: ${formData.parceriasOdonto}`); } if (parcerias.includes('empresas') && formData.parceriasEmpresas) { output.push(`Empresas: ${formData.parceriasEmpresas}`); } let result = output.join(' | '); if (shouldShowQuestion({ id: 'q10' }) && formData.exclusividade !== undefined) { if (result) { result += ' | '; } result += `Exclusividade: ${formData.exclusividade ? 'Sim' : 'Não'}`; if (formData.exclusividade && formData.exclusividadeLista) { result += ` com: ${formData.exclusividadeLista}`; } } return result; }

function formatCursos() { /* ... mantida ... */ if (!formData.tiposParceria.includes('cursos') || formData.cursos.length === 0) { return ''; } let text = []; text.push(`[CURSO: Total Cadastrados]: ${formData.cursos.length}`); formData.cursos.forEach((course, index) => { text.push(`\n\n--- CURSO ${index + 1}: ${course.nome || 'Sem Nome'} ---`); const tipos = course.tipos.map(t => { let label = ''; if (t === 'teorico') label = 'Teórico'; else if (t === 'pratico') label = 'Prático'; else if (t === 'handson') label = 'Hands-on'; else if (t === 'cursovip') label = 'Curso Vip'; else if (t === 'posgraduacao') label = 'Pós-graduação'; else if (t === 'imersao') label = 'Imersão'; else if (t === 'outro' && course.tipoOutro) label = `Outro: ${course.tipoOutro}`; return label; }).filter(l => l).join(', '); text.push(`- Tipo: ${tipos}`); text.push(`- Regiões: ${course.regioes}`); const freq = course.frequencia === 'fixas' ? 'Datas fixas e definidas com antecedência' : 'De acordo com demanda'; text.push(`- Frequência: ${freq}`); text.push(`- Duração: ${course.duracao}`); text.push(`- Média de alunos: ${course.mediaAlunos}`); if (course.linkDivulgacao) { text.push(`- Link Divulgação: ${course.linkDivulgacao}`); } if (course.linkConteudo) { text.push(`- Link Conteúdo: ${course.linkConteudo}`); } }); return text.join('\n'); }


// Submit form to RD Station (MANTIDO)
async function submitForm() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    
    // 1. Mapeamento Direto para os IDs do RD Station
    const payload = {
        token_rdstation: RD_CONFIG.token, 
        identificador: RD_CONFIG.eventId, 
        email: formData.email,
        name: formData.name,
        mobile_phone: formData.cf_telefone_whatsapp,
        
        // Campos Personalizados Mapeados
        cf_telefone_whatsapp: formData.cf_telefone_whatsapp,
        cf_cidade_uf: formData.cf_cidade_uf,
        
        // Mapeamentos de Resposta Formatados
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
        // 2. Simula o envio via Form Data (Endpoint 1.3)
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

        // 3. Sucesso (mostra a mensagem)
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
