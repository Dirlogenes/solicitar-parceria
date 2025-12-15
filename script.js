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
let formData = { courses: [] };
let editingCourseIndex = -1;

// Componentes
let tagInputProducts, tagInputPotenzaInterest;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Inicializar Componentes de Tags
    tagInputProducts = new TagInput('products-tag-input-wrapper', [], true);
    tagInputPotenzaInterest = new TagInput('potenza-interest-wrapper', productsPotenza, true);

    // 2. Configurar Autocomplete da Cidade (USANDO SUA LÓGICA DE FETCH)
    setupCityAutocomplete();

    // 3. Listeners e Layout
    setupEventListeners();
    updateProgressBar();
    
    // Foca no primeiro campo
    setTimeout(() => {
        const nameInput = document.getElementById('name');
        if(nameInput) nameInput.focus();
    }, 100);
});

// --- LÓGICA IBGE (LIVE SEARCH - IGUAL AO SEU EXEMPLO) ---
function setupCityAutocomplete() {
    const cidadeInput = document.getElementById('city-input');
    const autocompleteBox = document.getElementById('city-suggestions');
    let cidadesIBGE = [];

    // Função de busca na API (Copiada e adaptada do seu exemplo)
    async function buscarCidadesIBGE(termo) {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${termo}`
            );
            const data = await response.json();

            cidadesIBGE = data.map(cidade => ({
                nome: cidade.nome,
                // Garantindo que o caminho da UF exista para evitar erros em casos raros
                uf: (cidade.microrregiao && cidade.microrregiao.mesorregiao && cidade.microrregiao.mesorregiao.UF) 
                    ? cidade.microrregiao.mesorregiao.UF.sigla 
                    : 'BR'
            }));
        } catch (error) {
            console.error("Erro ao buscar no IBGE:", error);
        }
    }

    // Função de Renderização
    function renderizarSugestoes() {
        autocompleteBox.innerHTML = '';
        
        if(cidadesIBGE.length > 0) {
            autocompleteBox.style.display = 'block';
            
            // Limitamos a 8 sugestões como no seu exemplo
            cidadesIBGE.slice(0, 8).forEach(cidade => {
                const item = document.createElement('div');
                item.classList.add('autocomplete-item');
                item.textContent = `${cidade.nome} - ${cidade.uf}`;

                item.addEventListener('click', () => {
                    cidadeInput.value = `${cidade.nome} - ${cidade.uf}`;
                    autocompleteBox.innerHTML = '';
                    autocompleteBox.style.display = 'none';
                    // Remove erro visual se houver
                    cidadeInput.classList.remove('error-border');
                });

                autocompleteBox.appendChild(item);
            });
        } else {
            autocompleteBox.style.display = 'none';
        }
    }

    // Listener de Digitação (Input)
    cidadeInput.addEventListener('input', async () => {
        const termo = cidadeInput.value.trim();

        // Se limpar o campo, limpa a lista
        if (termo.length === 0) {
            autocompleteBox.innerHTML = '';
            autocompleteBox.style.display = 'none';
            return;
        }

        // Regra do seu código: Só busca com 3 caracteres ou mais
        if (termo.length < 3) return;

        await buscarCidadesIBGE(termo);
        renderizarSugestoes();
    });

    // Fechamento ao clicar fora
    document.addEventListener('click', e => {
        if (!cidadeInput.contains(e.target) && !autocompleteBox.contains(e.target)) {
            autocompleteBox.innerHTML = '';
            autocompleteBox.style.display = 'none';
        }
    });
}

// --- CLASSE TAG INPUT (Manter funcionalidade de produtos) ---
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
            input.onclick = (e) => { e.stopPropagation(); this.handleInput(e); };
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
            } else { this.closeList(); }
        }
    }

    add(item) {
        if (this.isMulti) this.selectedItems.push(item);
        else this.selectedItems = [item];
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

    closeList() { this.listContainer.style.display = 'none'; }
    getValue() { return this.isMulti ? this.selectedItems : (this.selectedItems[0] || ''); }
}

// --- EVENTOS E NAVEGAÇÃO ---
function setupEventListeners() {
    document.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', nextStep));
    document.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', prevStep));
    document.querySelector('.btn-submit').addEventListener('click', submitForm);

    // Configuração dos Checkboxes e Radios
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

    setupConditionalDisplay('radio-potenza-other', 'potenza-reason-other', 'potenza_reason');
    setupConditionalDisplay('radio-interest-sim', 'potenza-interest-tags', 'potenza_interest');
    setupConditionalDisplay('radio-excl-sim', 'input-exclusivity', 'exclusivity');

    const chkDentais = document.getElementById('chk-dentais');
    const inpDentais = document.getElementById('input-dentais');
    const chkEmpresas = document.getElementById('chk-empresas');
    const inpEmpresas = document.getElementById('input-empresas');
    const chkNone = document.getElementById('chk-no-partners');

    chkDentais.addEventListener('change', () => toggleInput(chkDentais, inpDentais, chkNone));
    chkEmpresas.addEventListener('change', () => toggleInput(chkEmpresas, inpEmpresas, chkNone));
    
    chkNone.addEventListener('change', () => {
        if(chkNone.checked) {
            chkDentais.checked = false; inpDentais.classList.add('hidden');
            chkEmpresas.checked = false; inpEmpresas.classList.add('hidden');
        }
    });

    // Cursos
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

function setupConditionalDisplay(triggerId, targetId, radioName) {
    const trigger = document.getElementById(triggerId);
    const target = document.getElementById(targetId);
    document.querySelectorAll(`input[name="${radioName}"]`).forEach(r => {
        r.addEventListener('change', () => {
            if(trigger.checked) target.classList.remove('hidden');
            else target.classList.add('hidden');
        });
    });
}
function toggleInput(chk, inp, chkNone) {
    if(chk.checked) { inp.classList.remove('hidden'); chkNone.checked = false; }
    else inp.classList.add('hidden');
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
        if (next > 13) { submitForm(); return; }
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
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
}
function getNextStepIndex(current) {
    if (current === 8) { 
        const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
        if (!brands.includes("Potenza") && !brands.includes("Ainda não utilizei")) return 9;
        return 11;
    }
    if (current === 9) return 10;
    if (current === 10) return 11;
    if (current === 11) {
         if (document.getElementById('chk-no-partners').checked) return checkCoursesStep(12);
         return 12;
    }
    if (current === 12) return checkCoursesStep(12);
    return current + 1;
}
function checkCoursesStep(fromStep) {
    return document.getElementById('chk-cursos').checked ? 13 : (submitForm(), fromStep);
}
function getPrevStepIndex(current) {
    if (current === 13) return document.getElementById('chk-no-partners').checked ? 11 : 12;
    if (current === 12) return 11;
    if (current === 11) {
        const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
        if (!brands.includes("Potenza") && !brands.includes("Ainda não utilizei")) return 10;
        return 8;
    }
    if (current === 10) return 9;
    if (current === 9) return 8;
    return current - 1;
}
function updateProgressBar() {
    document.getElementById('progress-bar').style.width = `${(currentStep / 13) * 100}%`;
}

// --- VALIDAÇÃO ---
function validateStep(step) {
    let valid = true;
    const stepDiv = document.querySelector(`.step[data-step="${step}"]`);
    const setError = (el, isValid) => {
        const err = el.parentElement.querySelector('.error-msg') || el.querySelector('.error-msg') || stepDiv.querySelector('.error-msg');
        if(err) err.style.display = isValid ? 'none' : 'block';
        if(el.tagName === 'INPUT') {
            if(!isValid) el.classList.add('error-border');
            else el.classList.remove('error-border');
        }
    };

    if (step === 1) { 
        const el = document.getElementById('name'); valid = el.value.trim() !== ''; setError(el, valid); 
    }
    if (step === 2) { 
        const el = document.getElementById('email'); valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()); setError(el, valid); 
    }
    if (step === 3) { 
        const el = document.getElementById('phone'); valid = el.value.replace(/\D/g, '').length >= 8; setError(el, valid); 
    }
    if (step === 4) { 
        const el = document.getElementById('city-input'); valid = el.value.trim() !== ''; setError(el, valid); 
    }
    if (step === 5) { 
        const el = document.getElementById('instagram'); valid = el.value.trim() !== ''; setError(el, valid); 
    }
    if (step === 6) { 
        const el = document.getElementById('partnership-type-group'); valid = el.querySelectorAll('input:checked').length > 0; setError(el, valid); 
    }
    if (step === 7) { 
        const el = document.getElementById('brands-group'); valid = el.querySelectorAll('input:checked').length > 0; setError(el, valid); 
    }
    if (step === 8) { 
        valid = tagInputProducts.getValue().length > 0; 
        document.getElementById('err-p8').style.display = valid ? 'none' : 'block';
        const wrap = document.getElementById('products-tag-input-wrapper');
        if(!valid) wrap.classList.add('error-border'); else wrap.classList.remove('error-border');
    }
    if (step === 9) { 
        const chk = document.querySelector('input[name="potenza_reason"]:checked');
        valid = !!chk;
        if(valid && chk.value === 'Outro' && document.getElementById('potenza-reason-other').value.trim() === '') valid = false;
        setError(document.getElementById('potenza-reason-group'), valid);
    }
    if (step === 10) { 
        const chk = document.querySelector('input[name="potenza_interest"]:checked');
        valid = !!chk;
        if(valid && chk.value === 'Sim' && tagInputPotenzaInterest.getValue().length === 0) valid = false;
        setError(document.getElementById('potenza-interest-bool'), valid);
    }
    if (step === 11) {
        const validGroup = document.getElementById('chk-dentais').checked || document.getElementById('chk-empresas').checked || document.getElementById('chk-no-partners').checked;
        valid = validGroup;
        if(document.getElementById('chk-dentais').checked && document.getElementById('input-dentais').value.trim() === '') valid = false;
        if(document.getElementById('chk-empresas').checked && document.getElementById('input-empresas').value.trim() === '') valid = false;
        setError(document.getElementById('active-partnerships-group'), valid);
    }
    if (step === 12) {
        const chk = document.querySelector('input[name="exclusivity"]:checked');
        valid = !!chk;
        if(valid && chk.value === 'Sim' && document.getElementById('input-exclusivity').value.trim() === '') valid = false;
        setError(document.getElementById('exclusivity-group'), valid);
    }
    if (step === 13) {
        valid = formData.courses.length > 0;
        document.getElementById('course-list-error').style.display = valid ? 'none' : 'block';
    }
    return valid;
}

// --- CURSOS ---
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
    document.querySelectorAll('#c-type-group input').forEach(c => c.checked = false);
    document.getElementById('c-type-other-text').value = '';
    document.getElementById('c-type-other-text').classList.add('hidden');
    document.getElementById('c-region').value = '';
    const rf = document.querySelector('input[name="c_freq"]:checked'); if(rf) rf.checked = false;
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
            const txt = document.getElementById('c-type-other-text').value.trim();
            if(txt) types.push(`Outro: ${txt}`);
        } else types.push(c.value);
    });
    const region = document.getElementById('c-region').value.trim();
    let freq = ""; const rf = document.querySelector('input[name="c_freq"]:checked'); if(rf) freq = rf.value;
    const duration = document.getElementById('c-duration').value.trim();
    const students = document.getElementById('c-students').value.trim();
    const linkDiv = document.getElementById('c-link-divulgacao').value.trim();
    const linkCont = document.getElementById('c-link-conteudo').value.trim();

    if (name === '' || types.length === 0 || region === '' || freq === '' || duration === '' || students === '') {
        document.getElementById('course-add-error').style.display = 'block'; return;
    }
    const courseData = { name, types, region, freq, duration, students, linkDiv, linkCont };
    if (editingCourseIndex >= 0) formData.courses[editingCourseIndex] = courseData;
    else formData.courses.push(courseData);
    renderCourses(); hideCourseForm();
}
function renderCourses() {
    const list = document.getElementById('courses-list'); list.innerHTML = '';
    formData.courses.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'course-summary-card';
        div.innerHTML = `
            <div class="card-actions"><button class="action-btn edit" onclick="editCourse(${i})">Editar</button><button class="action-btn delete" onclick="removeCourse(${i})">Excluir</button></div>
            <h4>${c.name}</h4><p><strong>Tipo:</strong> ${c.types.join(', ')}</p><p><strong>Região:</strong> ${c.region}</p>
        `;
        list.appendChild(div);
    });
    const btnAdd = document.getElementById('btn-show-course-form');
    btnAdd.innerText = formData.courses.length > 0 ? "+ Adicionar outro curso" : "+ Adicionar curso";
    document.getElementById('course-list-error').style.display = 'none';
}
window.removeCourse = function(i) { if(confirm("Excluir curso?")) { formData.courses.splice(i, 1); renderCourses(); } };
window.editCourse = function(i) {
    const c = formData.courses[i]; editingCourseIndex = i;
    document.getElementById('c-name').value = c.name;
    document.querySelectorAll('#c-type-group input').forEach(chk => {
        chk.checked = false;
        if(chk.value !== 'Outro' && c.types.includes(chk.value)) chk.checked = true;
    });
    const other = c.types.find(t => t.startsWith('Outro: '));
    const chkOther = document.getElementById('chk-ctype-other');
    const inpOther = document.getElementById('c-type-other-text');
    if(other) { chkOther.checked = true; inpOther.classList.remove('hidden'); inpOther.value = other.replace('Outro: ', ''); }
    else { chkOther.checked = false; inpOther.classList.add('hidden'); inpOther.value = ''; }
    document.getElementById('c-region').value = c.region;
    document.getElementsByName('c_freq').forEach(r => { r.checked = r.value === c.freq; });
    document.getElementById('c-duration').value = c.duration;
    document.getElementById('c-students').value = c.students;
    document.getElementById('c-link-divulgacao').value = c.linkDiv;
    document.getElementById('c-link-conteudo').value = c.linkCont;
    
    document.getElementById('form-course-title').innerText = "Editar Curso";
    document.getElementById('btn-save-course').innerText = "Atualizar Curso";
    document.getElementById('btn-show-course-form').classList.add('hidden');
    document.getElementById('course-form-container').classList.remove('hidden');
    document.getElementById('course-add-error').style.display = 'none';
};

// --- ENVIO ---
async function submitForm() {
    if (!validateStep(currentStep)) {
        const currentDiv = document.querySelector(`.step[data-step="${currentStep}"]`);
        currentDiv.classList.add('shake'); setTimeout(() => currentDiv.classList.remove('shake'), 500); return;
    }
    document.getElementById('loading-overlay').classList.remove('hidden');

    const payload = {
        token_rdstation: 'b32e0b962e0ec0de400f8215112b8a08',
        identificador: 'solicitacao-parceria-phs-externo',
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        mobile_phone: document.getElementById('phone').value,
        cf_telefone_whatsapp: document.getElementById('phone').value,
        cf_cidade_uf: document.getElementById('city-input').value,
        cf_instagram: document.getElementById('instagram').value,
        cf_tipo_de_parceria: Array.from(document.querySelectorAll('#partnership-type-group input:checked')).map(c=>c.value).join(', '),
        cf_qual_marca_utiliza: Array.from(document.querySelectorAll('#brands-group input:checked')).map(c=>c.value).join(', '),
        cf_conhecimento_dominio_e_pratica_com_produtos: tagInputProducts.getValue().join(', '),
        cf_motivo_de_nao_ter_testado_potenza: (() => {
           const r = document.querySelector('input[name="potenza_reason"]:checked');
           if(!r) return "";
           return r.value === "Outro" ? document.getElementById('potenza-reason-other').value : r.value;
        })(),
        cf_interesse_em_potenza: (() => {
           const r = document.querySelector('input[name="potenza_interest"]:checked');
           if(!r) return "";
           return r.value === "Sim" ? "Sim: " + tagInputPotenzaInterest.getValue().join(', ') : "Não";
        })(),
        cf_tem_parcerias_ativas: (() => {
            let p = [];
            if(document.getElementById('chk-dentais').checked) p.push("Dentais: " + document.getElementById('input-dentais').value);
            if(document.getElementById('chk-empresas').checked) p.push("Empresas: " + document.getElementById('input-empresas').value);
            if(document.getElementById('chk-no-partners').checked) p.push("Nenhuma");
            const exc = document.querySelector('input[name="exclusivity"]:checked');
            if(exc) p.push("Exclusividade: " + (exc.value==="Sim" ? "Sim: "+document.getElementById('input-exclusivity').value : "Não"));
            return p.join(' | ');
        })(),
        cf_tipos_de_cursos_e_treinamentos: formData.courses.map(c => 
            `Curso: ${c.name}\nTipo: ${c.types.join(', ')}\nRegião: ${c.region}\nFreq: ${c.freq}\nDur: ${c.duration}\nAlunos: ${c.students}\nLinks: ${c.linkDiv} | ${c.linkCont}`
        ).join('\n----------------\n')
    };

    const formBody = Object.keys(payload).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(payload[k])).join('&');
    try {
        await fetch('https://www.rdstation.com.br/api/1.3/conversions', {
            method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}, body: formBody
        });
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('partner-form').classList.add('hidden');
        document.getElementById('progress-container').classList.add('hidden');
        document.getElementById('success-screen').classList.remove('hidden');
    } catch (error) {
        console.error("Erro no envio:", error);
        alert("Erro no envio. Verifique o console.");
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}
