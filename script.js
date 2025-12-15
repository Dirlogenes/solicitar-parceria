// --- DADOS ESTÁTICOS ---
const productsTokuyama = [
    "Resina Estelite Omega", "Resina Palfique LX5", "Resina Estelite Posterior", "Resina Palfique Omnichroma",
    "Resina Palfique Universal Flow", "Reembasador Sofreliner Tough", "Reembasador Rebase 2", 
    "Adesivo Palfique Bond Autocondicionante", "Adesivo Palfique Universal Bond", "Pincel Tokuyama",
    "Corante e Opacificante Estelite Color", "Cimento Resinosa Estecem Plus"
];
const productsPotenza = [
    "Clareador Consultório Potenza Bianco Peróxido de Hidrogênio 35%", "Clareador Consultório Potenza Bianco Peróxido de Hidrogênio 38%",
    "Clareador Consultório Potenza Bianco PF Peróxido de Carbamida 35%", "Clareador Caseiro Peróxido de Carbamida 10%",
    "Clareador Caseiro Peróxido de Carbamida 16%", "Clareador Caseiro Peróxido de Carbamida 22%",
    "Clareador Caseiro Peróxido de Hidrogênio 6%", "Clareador Caseiro Peróxido de Hidrogênio 7,5%",
    "Clareador Caseiro Peróxido de Hidrogênio 9,5%", "Barreira Gengival Potenza Blocco", "Dessensibilizantes Potenza Esente",
    "Cimento Ortodôntico Potenza Orthoblue", "Condicionador Ácido Fosfórico H3PO4 Esmalte e Dentina Potenza Attaco 35%",
    "Condicionador Ácido Fosfórico H3PO4 Esmalte e Dentina Potenza Attaco 37%", "Condicionador Ácido Fluorídrico HF Cerâmica Potenza Attaco 5%",
    "Condicionador Ácido Fluorídrico HF Cerâmica Potenza Attaco 10%", "Microabrasão Potenza Abrasione",
    "Hidratante Bucal Longa Duração Potenza Idrata", "Pastas de Polimento para Resinas Potenza Specchi",
    "Placas de EVA para Clareamento Potenza Stampo EVA", "Espuma de Limpeza de Moldeira Potenza Cloud Clean",
    "Agente de União Potenza Silano", "Bloqueador de Oxigênio Potenza Bloxy"
];
const productsNicTone = ["Lençol de borracha para isolamento absoluto Nic Tone"];

// --- VARIÁVEIS DE ESTADO ---
let currentStep = 1;
let formData = {
    courses: []
};
let editingCourseIndex = -1; // -1 significa novo curso

// Componentes de Input de Tag
let tagInputProducts, tagInputPotenzaInterest;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar Componentes de Produtos (Tags)
    tagInputProducts = new TagInput('products-tag-input-wrapper', [], true);
    tagInputPotenzaInterest = new TagInput('potenza-interest-wrapper', productsPotenza, true);

    // Inicializar Autocomplete de Cidade (Lógica separada)
    setupCityAutocomplete();

    setupEventListeners();
    updateProgressBar();
    
    // Foca no primeiro campo ao carregar
    setTimeout(() => document.getElementById('name').focus(), 100);
});

// --- LÓGICA ESPECÍFICA PARA CIDADE (IBGE) ---
function setupCityAutocomplete() {
    const cityInput = document.getElementById('city-input');
    const suggestionsBox = document.getElementById('city-suggestions');
    let cidadesIBGE = [];

    // Busca na API
    async function buscarCidadesIBGE(termo) {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${termo}`
            );
            const data = await response.json();

            cidadesIBGE = data.map(cidade => ({
                nome: cidade.nome,
                uf: cidade.microrregiao.mesorregiao.UF.sigla
            }));
            
            renderizarSugestoes();
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
        }
    }

    // Renderiza lista
    function renderizarSugestoes() {
        suggestionsBox.innerHTML = '';
        if(cidadesIBGE.length > 0) {
            suggestionsBox.style.display = 'block';
            // Mostra apenas os 10 primeiros para não travar
            cidadesIBGE.slice(0, 10).forEach(cidade => {
                const item = document.createElement('div');
                item.classList.add('autocomplete-item');
                item.textContent = `${cidade.nome} - ${cidade.uf}`;

                item.addEventListener('click', () => {
                    cityInput.value = `${cidade.nome} - ${cidade.uf}`;
                    suggestionsBox.style.display = 'none';
                    suggestionsBox.innerHTML = '';
                });

                suggestionsBox.appendChild(item);
            });
        } else {
            suggestionsBox.style.display = 'none';
        }
    }

    // Listener de digitação
    cityInput.addEventListener('input', async () => {
        const termo = cityInput.value.trim();
        
        if (termo.length < 3) {
            suggestionsBox.style.display = 'none';
            return;
        }

        await buscarCidadesIBGE(termo);
    });

    // Fechar ao clicar fora
    document.addEventListener('click', e => {
        if (!cityInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}


// --- CLASSE TAG INPUT (PARA PRODUTOS) ---
class TagInput {
    constructor(containerId, sourceData, isMulti) {
        this.container = document.getElementById(containerId);
        this.sourceData = sourceData || [];
        this.isMulti = isMulti;
        this.selectedItems = [];
        this.render();
    }

    updateSource(newData) {
        this.sourceData = newData;
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'tag-input-container';
        
        this.selectedItems.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `${item} <span class="remove">×</span>`;
            tag.querySelector('.remove').onclick = () => this.remove(index);
            this.container.appendChild(tag);
        });

        if (this.isMulti || this.selectedItems.length === 0) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'tag-input-field';
            input.placeholder = this.selectedItems.length === 0 ? (this.isMulti ? 'Clique para selecionar...' : 'Digite ou selecione...') : '';
            
            input.oninput = (e) => this.handleInput(e);
            
            input.onkeydown = (e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                    if (input.value.trim() !== '') {
                        this.add(input.value.trim());
                        input.value = '';
                        this.closeList();
                    }
                }
                if(e.key === 'Backspace' && input.value === '') {
                    this.remove(this.selectedItems.length - 1);
                }
            };

            input.onfocus = (e) => {
                this.container.classList.add('focus');
                this.handleInput(e); 
            };

            input.onclick = (e) => {
                e.stopPropagation();
                this.handleInput(e);
            };

            input.onblur = () => setTimeout(() => {
                this.container.classList.remove('focus');
                this.closeList();
            }, 200);

            this.container.appendChild(input);
            this.inputElement = input;
        }

        this.listContainer = document.createElement('div');
        this.listContainer.className = 'autocomplete-list';
        this.container.appendChild(this.listContainer);

        this.container.onclick = (e) => {
            if (e.target === this.container && this.inputElement) this.inputElement.focus();
        };
    }

    handleInput(e) {
        const val = e.target.value.toLowerCase();
        
        if (this.sourceData.length > 0) {
            const matches = this.sourceData.filter(item => 
                !this.selectedItems.includes(item) && 
                (val === '' || item.toLowerCase().includes(val))
            ); 

            if (matches.length > 0) {
                this.listContainer.innerHTML = '';
                this.listContainer.style.display = 'block';
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-item';
                    div.innerText = match;
                    div.onclick = () => this.add(match);
                    this.listContainer.appendChild(div);
                });
            } else {
                this.closeList();
            }
        }
    }

    add(item) {
        if (this.isMulti) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems = [item];
        }
        this.render();
        if(this.isMulti && this.inputElement) {
            this.inputElement.focus();
            setTimeout(() => this.handleInput({ target: this.inputElement }), 10);
        }
    }

    remove(index) {
        if (index >= 0 && index < this.selectedItems.length) {
            this.selectedItems.splice(index, 1);
            this.render();
        }
    }

    closeList() {
        this.listContainer.style.display = 'none';
    }

    getValue() {
        return this.isMulti ? this.selectedItems : (this.selectedItems[0] || '');
    }
}

// --- EVENTOS ---
function setupEventListeners() {
    document.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', nextStep));
    document.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', prevStep));
    document.querySelector('.btn-submit').addEventListener('click', submitForm);

    const brandChecks = document.querySelectorAll('#brands-group input');
    const noneCheck = document.getElementById('chk-brand-none');
    brandChecks.forEach(chk => {
        chk.addEventListener('change', (e) => {
            if(e.target === noneCheck && noneCheck.checked) {
                brandChecks.forEach(c => { if(c !== noneCheck) c.checked = false; });
            } else if(e.target !== noneCheck && e.target.checked) {
                noneCheck.checked = false;
            }
            updateProductSource();
        });
    });

    const radioOtherPotenza = document.getElementById('radio-potenza-other');
    const inputOtherPotenza = document.getElementById('potenza-reason-other');
    document.querySelectorAll('input[name="potenza_reason"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioOtherPotenza.checked) inputOtherPotenza.classList.remove('hidden');
            else inputOtherPotenza.classList.add('hidden');
        });
    });

    const radioInterestSim = document.getElementById('radio-interest-sim');
    const tagsInterest = document.getElementById('potenza-interest-tags');
    document.querySelectorAll('input[name="potenza_interest"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioInterestSim.checked) tagsInterest.classList.remove('hidden');
            else tagsInterest.classList.add('hidden');
        });
    });

    const chkDentais = document.getElementById('chk-dentais');
    const inpDentais = document.getElementById('input-dentais');
    const chkEmpresas = document.getElementById('chk-empresas');
    const inpEmpresas = document.getElementById('input-empresas');
    const chkNone = document.getElementById('chk-no-partners');

    chkDentais.addEventListener('change', () => {
        if(chkDentais.checked) { inpDentais.classList.remove('hidden'); chkNone.checked = false; }
        else inpDentais.classList.add('hidden');
    });
    chkEmpresas.addEventListener('change', () => {
        if(chkEmpresas.checked) { inpEmpresas.classList.remove('hidden'); chkNone.checked = false; }
        else inpEmpresas.classList.add('hidden');
    });
    chkNone.addEventListener('change', () => {
        if(chkNone.checked) {
            chkDentais.checked = false; inpDentais.classList.add('hidden');
            chkEmpresas.checked = false; inpEmpresas.classList.add('hidden');
        }
    });

    const radioExclSim = document.getElementById('radio-excl-sim');
    const inpExcl = document.getElementById('input-exclusivity');
    document.querySelectorAll('input[name="exclusivity"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioExclSim.checked) inpExcl.classList.remove('hidden');
            else inpExcl.classList.add('hidden');
        });
    });

    document.getElementById('btn-show-course-form').addEventListener('click', showCourseForm);
    document.getElementById('btn-save-course').addEventListener('click', addCourse);
    document.getElementById('btn-cancel-course').addEventListener('click', hideCourseForm);
    
    const chkCtypeOther = document.getElementById('chk-ctype-other');
    const inpCtypeOther = document.getElementById('c-type-other-text');
    chkCtypeOther.addEventListener('change', () => {
        if(chkCtypeOther.checked) inpCtypeOther.classList.remove('hidden');
        else inpCtypeOther.classList.add('hidden');
    });
}

function updateProductSource() {
    let source = [];
    const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
    
    if (brands.includes("Ainda não utilizei")) {
        source = [...productsTokuyama, ...productsPotenza, ...productsNicTone];
    } else {
        if (brands.includes("Tokuyama")) source.push(...productsTokuyama);
        if (brands.includes("Potenza")) source.push(...productsPotenza);
        if (brands.includes("Nic Tone")) source.push(...productsNicTone);
    }
    tagInputProducts.updateSource(source);
}

// --- NAVEGAÇÃO ---
function nextStep() {
    if (validateStep(currentStep)) {
        const next = getNextStepIndex(currentStep);
        if (next > 13) {
            submitForm(); 
            return;
        }
        goToStep(next);
    } else {
        const currentDiv = document.querySelector(`.step[data-step="${currentStep}"]`);
        currentDiv.classList.add('shake');
        setTimeout(() => currentDiv.classList.remove('shake'), 500);
    }
}

function prevStep() {
    const prev = getPrevStepIndex(currentStep);
    goToStep(prev);
}

function goToStep(stepIndex) {
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    
    const nextStepDiv = document.querySelector(`.step[data-step="${stepIndex}"]`);
    nextStepDiv.classList.remove('hidden');
    
    currentStep = stepIndex;
    updateProgressBar();

    const firstInput = nextStepDiv.querySelector('input, textarea, select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function getNextStepIndex(current) {
    let next = current + 1;
    if (current === 8) { 
        const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
        const isFirstTime = brands.includes("Ainda não utilizei");
        const hasPotenza = brands.includes("Potenza");
        
        if (!hasPotenza && !isFirstTime) return 9;
        else return 11;
    }
    if (current === 9) return 10;
    if (current === 10) return 11;
    if (current === 11) {
            const hasNone = document.getElementById('chk-no-partners').checked;
            if (hasNone) return checkCoursesStep(12);
            return 12; 
    }
    if (current === 12) return checkCoursesStep(12);

    return next;
}

function checkCoursesStep(fromStep) {
    const hasCourses = document.getElementById('chk-cursos').checked;
    if (hasCourses) return 13;
    submitForm();
    return fromStep;
}

function getPrevStepIndex(current) {
    if (current === 13) {
        const hasPartners = !document.getElementById('chk-no-partners').checked;
        return hasPartners ? 12 : 11;
    }
    if (current === 12) return 11;
    if (current === 11) {
            const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
            const isFirstTime = brands.includes("Ainda não utilizei");
            const hasPotenza = brands.includes("Potenza");
            if (!hasPotenza && !isFirstTime) return 10;
            return 8;
    }
    if (current === 10) return 9;
    if (current === 9) return 8;
    return current - 1;
}

function updateProgressBar() {
    const totalSteps = 13;
    const pct = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;
}

// --- VALIDAÇÃO GERAL ---
function validateStep(step) {
    let valid = true;
    const stepDiv = document.querySelector(`.step[data-step="${step}"]`);
    
    const setError = (el, msg, isShow) => {
        const err = el.parentElement.querySelector('.error-msg') || el.querySelector('.error-msg') || stepDiv.querySelector('.error-msg');
        if(err) err.style.display = isShow ? 'block' : 'none';
        if(el.tagName === 'INPUT') {
            if(isShow) el.classList.add('error-border');
            else el.classList.remove('error-border');
        }
    };

    if (step === 1) { 
        const val = document.getElementById('name').value.trim();
        valid = val !== '';
        setError(document.getElementById('name'), null, !valid);
    }
    if (step === 2) { 
        const val = document.getElementById('email').value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = regex.test(val);
        setError(document.getElementById('email'), null, !valid);
    }
    if (step === 3) { 
        const val = document.getElementById('phone').value.replace(/\D/g, '');
        valid = val.length >= 8;
        setError(document.getElementById('phone'), null, !valid);
    }
    if (step === 4) { 
        // Validação da Cidade (Verifica se o input não está vazio)
        const val = document.getElementById('city-input').value.trim();
        valid = val !== '';
        // Aqui assumimos que se o utilizador digitou, é válido, mas o ideal é que ele clique.
        // O código de envio pegará o texto exato do input.
        setError(document.getElementById('city-input'), null, !valid);
    }
    if (step === 5) { 
        const val = document.getElementById('instagram').value.trim();
        valid = val !== '';
        setError(document.getElementById('instagram'), null, !valid);
    }
    if (step === 6) { 
        const checked = document.querySelectorAll('#partnership-type-group input:checked').length > 0;
        valid = checked;
        setError(document.getElementById('partnership-type-group'), null, !valid);
    }
    if (step === 7) { 
        const checked = document.querySelectorAll('#brands-group input:checked').length > 0;
        valid = checked;
        setError(document.getElementById('brands-group'), null, !valid);
    }
    if (step === 8) { 
        const tags = tagInputProducts.getValue();
        valid = tags.length > 0;
        const err = document.getElementById('err-p8');
        err.style.display = valid ? 'none' : 'block';
        if(!valid) document.getElementById('products-tag-input-wrapper').classList.add('error-border');
        else document.getElementById('products-tag-input-wrapper').classList.remove('error-border');
    }
    if (step === 9) { 
        const checked = document.querySelector('input[name="potenza_reason"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Outro') {
            if(document.getElementById('potenza-reason-other').value.trim() === '') valid = false;
        }
        setError(document.getElementById('potenza-reason-group'), null, !valid);
    }
    if (step === 10) { 
        const checked = document.querySelector('input[name="potenza_interest"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Sim') {
            if(tagInputPotenzaInterest.getValue().length === 0) valid = false;
        }
        setError(document.getElementById('potenza-interest-bool'), null, !valid);
    }
    if (step === 11) { 
        const dentais = document.getElementById('chk-dentais').checked;
        const empresas = document.getElementById('chk-empresas').checked;
        const none = document.getElementById('chk-no-partners').checked;
        
        valid = dentais || empresas || none;
        
        if(dentais && document.getElementById('input-dentais').value.trim() === '') valid = false;
        if(empresas && document.getElementById('input-empresas').value.trim() === '') valid = false;
        
        setError(document.getElementById('active-partnerships-group'), null, !valid);
    }
    if (step === 12) { 
        const checked = document.querySelector('input[name="exclusivity"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Sim') {
            if(document.getElementById('input-exclusivity').value.trim() === '') valid = false;
        }
        setError(document.getElementById('exclusivity-group'), null, !valid);
    }
    if (step === 13) { 
        valid = formData.courses.length > 0;
        const err = document.getElementById('course-list-error');
        err.style.display = valid ? 'none' : 'block';
    }

    return valid;
}

// --- LÓGICA DE CURSOS ---
function showCourseForm() {
    editingCourseIndex = -1; 
    document.getElementById('form-course-title').innerText = "Adicionar Novo Curso";
    document.getElementById('btn-save-course').innerText = "Salvar Curso";
    clearCourseForm();
    document.getElementById('btn-show-course-form').classList.add('hidden');
    document.getElementById('course-form-container').classList.remove('hidden');
    document.getElementById('course-add-error').style.display = 'none';

    setTimeout(() => document.getElementById('c-name').focus(), 100);
}

function hideCourseForm() {
    document.getElementById('course-form-container').classList.add('hidden');
    document.getElementById('btn-show-course-form').classList.remove('hidden');
}

function clearCourseForm() {
    document.getElementById('c-name').value = '';
    
    document.querySelectorAll('#c-type-group input[type="checkbox"]').forEach(c => c.checked = false);
    document.getElementById('c-type-other-text').value = '';
    document.getElementById('c-type-other-text').classList.add('hidden');

    document.getElementById('c-region').value = '';
    
    const radioFreq = document.querySelector('input[name="c_freq"]:checked');
    if(radioFreq) radioFreq.checked = false;

    document.getElementById('c-duration').value = '';
    document.getElementById('c-students').value = '';
    document.getElementById('c-link-divulgacao').value = '';
    document.getElementById('c-link-conteudo').value = '';
}

function addCourse() {
    const name = document.getElementById('c-name').value.trim();
    
    const types = [];
    document.querySelectorAll('#c-type-group input:checked').forEach(c => {
        if(c.value === 'Outro') {
            const otherTxt = document.getElementById('c-type-other-text').value.trim();
            if(otherTxt) types.push(`Outro: ${otherTxt}`);
        } else {
            types.push(c.value);
        }
    });

    const region = document.getElementById('c-region').value.trim();
    
    let freq = "";
    const freqOpt = document.querySelector('input[name="c_freq"]:checked');
    if(freqOpt) freq = freqOpt.value;

    const duration = document.getElementById('c-duration').value.trim();
    const students = document.getElementById('c-students').value.trim();
    const linkDiv = document.getElementById('c-link-divulgacao').value.trim();
    const linkCont = document.getElementById('c-link-conteudo').value.trim();

    if (name === '' || types.length === 0 || region === '' || freq === '' || duration === '' || students === '') {
        document.getElementById('course-add-error').style.display = 'block';
        return;
    }

    const courseData = {
        name,
        types,
        region,
        freq,
        duration,
        students,
        linkDiv,
        linkCont
    };

    if (editingCourseIndex >= 0) {
        formData.courses[editingCourseIndex] = courseData;
    } else {
        formData.courses.push(courseData);
    }

    renderCourses();
    hideCourseForm();
}

function renderCourses() {
    const list = document.getElementById('courses-list');
    list.innerHTML = '';
    
    formData.courses.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'course-summary-card';
        div.innerHTML = `
            <div class="card-actions">
                <button class="action-btn edit" onclick="editCourse(${i})">Editar</button>
                <button class="action-btn delete" onclick="removeCourse(${i})">Excluir</button>
            </div>
            <h4>${c.name}</h4>
            <p><strong>Tipo:</strong> ${c.types.join(', ')}</p>
            <p><strong>Região:</strong> ${c.region || '-'}</p>
        `;
        list.appendChild(div);
    });

    const btnAdd = document.getElementById('btn-show-course-form');
    if(formData.courses.length > 0) {
        btnAdd.innerText = "+ Adicionar outro curso";
        document.getElementById('course-list-error').style.display = 'none';
    } else {
        btnAdd.innerText = "+ Adicionar curso";
    }
}

window.removeCourse = function(index) {
    if(confirm("Tem certeza que deseja excluir este curso?")) {
        formData.courses.splice(index, 1);
        renderCourses();
    }
}

window.editCourse = function(index) {
    const c = formData.courses[index];
    editingCourseIndex = index;

    document.getElementById('c-name').value = c.name;

    document.querySelectorAll('#c-type-group input[type="checkbox"]').forEach(chk => {
        chk.checked = false; 
        if(chk.value !== 'Outro' && c.types.includes(chk.value)) {
            chk.checked = true;
        }
    });

    const otherType = c.types.find(t => t.startsWith('Outro: '));
    const chkOther = document.getElementById('chk-ctype-other');
    const inpOther = document.getElementById('c-type-other-text');
    if(otherType) {
        chkOther.checked = true;
        inpOther.classList.remove('hidden');
        inpOther.value = otherType.replace('Outro: ', '');
    } else {
        chkOther.checked = false;
        inpOther.classList.add('hidden');
        inpOther.value = '';
    }

    document.getElementById('c-region').value = c.region;

    const radios = document.getElementsByName('c_freq');
    radios.forEach(r => {
        if(r.value === c.freq) r.checked = true;
        else r.checked = false;
    });

    document.getElementById('c-duration').value = c.duration;
    document.getElementById('c-students').value = c.students;
    document.getElementById('c-link-divulgacao').value = c.linkDiv;
    document.getElementById('c-link-conteudo').value = c.linkCont;

    document.getElementById('form-course-title').innerText = "Editar Curso";
    document.getElementById('btn-save-course').innerText = "Atualizar Curso";
    document.getElementById('btn-show-course-form').classList.add('hidden');
    document.getElementById('course-form-container').classList.remove('hidden');
    document.getElementById('course-add-error').style.display = 'none';
}


// --- ENVIO (RD STATION) ---
async function submitForm() {
    if (!validateStep(currentStep)) {
        const currentDiv = document.querySelector(`.step[data-step="${currentStep}"]`);
        currentDiv.classList.add('shake');
        setTimeout(() => currentDiv.classList.remove('shake'), 500);
        return;
    }

    document.getElementById('loading-overlay').classList.remove('hidden');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    // Captura o valor direto do input de cidade agora
    const city = document.getElementById('city-input').value;
    const instagram = document.getElementById('instagram').value;
    
    const partTypes = Array.from(document.querySelectorAll('#partnership-type-group input:checked')).map(c => c.value).join(', ');
    const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value).join(', ');
    const products = tagInputProducts.getValue().join(', ');
    
    let motivoPotenza = "";
    const potReasonOpt = document.querySelector('input[name="potenza_reason"]:checked');
    if(potReasonOpt) {
        motivoPotenza = potReasonOpt.value === "Outro" ? document.getElementById('potenza-reason-other').value : potReasonOpt.value;
    }

    let interessePotenza = "";
    const potIntOpt = document.querySelector('input[name="potenza_interest"]:checked');
    if(potIntOpt) {
        if(potIntOpt.value === "Sim") {
            interessePotenza = "Sim: " + tagInputPotenzaInterest.getValue().join(', ');
        } else {
            interessePotenza = "Não";
        }
    }

    let parceriasAtivas = [];
    if(document.getElementById('chk-dentais').checked) parceriasAtivas.push("Dentais: " + document.getElementById('input-dentais').value);
    if(document.getElementById('chk-empresas').checked) parceriasAtivas.push("Empresas: " + document.getElementById('input-empresas').value);
    if(document.getElementById('chk-no-partners').checked) parceriasAtivas.push("Nenhuma");
    
    const exclOpt = document.querySelector('input[name="exclusivity"]:checked');
    if(exclOpt) {
            const exclTxt = exclOpt.value === "Sim" ? "Sim: " + document.getElementById('input-exclusivity').value : "Não";
            parceriasAtivas.push("Exclusividade: " + exclTxt);
    }
    const strParcerias = parceriasAtivas.join(' | ');

    let strCursos = "";
    if(formData.courses.length > 0) {
        strCursos = formData.courses.map(c => 
            `Curso: ${c.name}
             Tipo: ${c.types.join(', ')}
             Região: ${c.region}
             Freq: ${c.freq}
             Dur: ${c.duration}
             Alunos: ${c.students}
             Link Div: ${c.linkDiv}
             Link Cont: ${c.linkCont}`
        ).join('\n----------------\n');
    }

    const payload = {
        token_rdstation: 'b32e0b962e0ec0de400f8215112b8a08',
        identificador: 'solicitacao-parceria-phs-externo',
        email: email,
        name: name,
        mobile_phone: phone,
        cf_telefone_whatsapp: phone,
        cf_cidade_uf: city,
        cf_instagram: instagram,
        cf_tipo_de_parceria: partTypes,
        cf_qual_marca_utiliza: brands,
        cf_conhecimento_dominio_e_pratica_com_produtos: products,
        cf_motivo_de_nao_ter_testado_potenza: motivoPotenza,
        cf_interesse_em_potenza: interessePotenza,
        cf_tem_parcerias_ativas: strParcerias,
        cf_tipos_de_cursos_e_treinamentos: strCursos
    };

    const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');

    try {
        await fetch('https://www.rdstation.com.br/api/1.3/conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });
        
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('partner-form').classList.add('hidden');
        document.getElementById('progress-container').classList.add('hidden');
        document.getElementById('success-screen').classList.remove('hidden');

    } catch (error) {
        console.error("Erro no envio:", error);
        alert("Houve um erro técnico no envio. Verifique o console ou tente novamente.");
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}
