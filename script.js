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
let citiesList = []; // Será populado pela API
let formData = {
    courses: []
};

// Componentes de Input de Tag
let tagInputProducts, tagInputPotenzaInterest, cityAutocomplete;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch Cidades IBGE
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const data = await response.json();
        citiesList = data.map(c => `${c.nome} - ${c.microrregiao.mesorregiao.UF.sigla}`);
    } catch (e) {
        console.error("Erro IBGE", e);
    }

    // Inicializar Componentes Especiais
    tagInputProducts = new TagInput('products-tag-input-wrapper', [], true);
    tagInputPotenzaInterest = new TagInput('potenza-interest-wrapper', productsPotenza, true);
    cityAutocomplete = new TagInput('city-wrapper', citiesList, false); // Single selection

    setupEventListeners();
    updateProgressBar();
});

// --- CLASSE TAG INPUT / AUTOCOMPLETE ---
class TagInput {
    constructor(containerId, sourceData, isMulti) {
        this.container = document.getElementById(containerId);
        this.sourceData = sourceData;
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
        
        // Render Tags
        this.selectedItems.forEach((item, index) => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `${item} <span class="remove">×</span>`;
            tag.querySelector('.remove').onclick = () => this.remove(index);
            this.container.appendChild(tag);
        });

        // Input
        if (this.isMulti || this.selectedItems.length === 0) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'tag-input-field';
            input.placeholder = this.selectedItems.length === 0 ? 'Digite para buscar...' : '';
            
            // Events
            input.oninput = (e) => this.handleInput(e);
            input.onkeydown = (e) => {
                if(e.key === 'Enter') e.preventDefault();
                if(e.key === 'Backspace' && input.value === '') this.remove(this.selectedItems.length - 1);
            };
            input.onfocus = () => this.container.classList.add('focus');
            input.onblur = () => setTimeout(() => {
                this.container.classList.remove('focus');
                this.closeList();
            }, 200);

            this.container.appendChild(input);
            this.inputElement = input;
        }

        // List Container
        this.listContainer = document.createElement('div');
        this.listContainer.className = 'autocomplete-list';
        this.container.appendChild(this.listContainer);

        // Click container to focus input
        this.container.onclick = (e) => {
            if (e.target === this.container && this.inputElement) this.inputElement.focus();
        };
    }

    handleInput(e) {
        const val = e.target.value.toLowerCase();
        this.closeList();
        if (!val) return;

        const matches = this.sourceData.filter(item => 
            item.toLowerCase().includes(val) && !this.selectedItems.includes(item)
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
        }
    }

    add(item) {
        if (this.isMulti) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems = [item];
        }
        this.render();
        if(this.inputElement) this.inputElement.focus();
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

// --- CONTROLE DE FLUXO E EVENTOS ---
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', nextStep));
    document.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', prevStep));
    document.querySelector('.btn-submit').addEventListener('click', submitForm);

    // Q7 - Marcas (Lógica Exclusiva)
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

    // Q9 - Motivo Potenza Outro
    const radioOtherPotenza = document.getElementById('radio-potenza-other');
    const inputOtherPotenza = document.getElementById('potenza-reason-other');
    document.querySelectorAll('input[name="potenza_reason"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioOtherPotenza.checked) inputOtherPotenza.classList.remove('hidden');
            else inputOtherPotenza.classList.add('hidden');
        });
    });

    // Q10 - Interesse Potenza
    const radioInterestSim = document.getElementById('radio-interest-sim');
    const tagsInterest = document.getElementById('potenza-interest-tags');
    document.querySelectorAll('input[name="potenza_interest"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioInterestSim.checked) tagsInterest.classList.remove('hidden');
            else tagsInterest.classList.add('hidden');
        });
    });

    // Q11 - Parcerias Ativas
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

    // Q12 - Exclusividade
    const radioExclSim = document.getElementById('radio-excl-sim');
    const inpExcl = document.getElementById('input-exclusivity');
    document.querySelectorAll('input[name="exclusivity"]').forEach(r => {
        r.addEventListener('change', () => {
            if(radioExclSim.checked) inpExcl.classList.remove('hidden');
            else inpExcl.classList.add('hidden');
        });
    });

    // Q13 - Cursos
    document.getElementById('btn-add-course').addEventListener('click', addCourse);
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

// --- FUNÇÕES DE NAVEGAÇÃO E VALIDAÇÃO ---
function nextStep() {
    if (validateStep(currentStep)) {
        const next = getNextStepIndex(currentStep);
        
        // Lógica de "Submit" se o next for além do Q13 ou se Q13 for pulado
        if (next > 13) {
            // Caso raro onde lógica de skip leva ao fim
            submitForm(); 
            return;
        }

        // Transição Especial: Se estivermos no passo final do fluxo e clicarmos "Próximo",
        // mas o passo final real for o submit (botão separado no Q13),
        // a lógica aqui trata apenas a troca de telas visíveis.
        
        goToStep(next);
    } else {
        // Efeito visual na tela atual
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
    document.querySelector(`.step[data-step="${stepIndex}"]`).classList.remove('hidden');
    currentStep = stepIndex;
    updateProgressBar();
}

function getNextStepIndex(current) {
    let next = current + 1;

    // Lógica Condicional de Pulo
    if (current === 8) { // Após Produtos
        const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value);
        const isFirstTime = brands.includes("Ainda não utilizei");
        const hasPotenza = brands.includes("Potenza");
        
        // Se NÃO tem Potenza E NÃO é primeira vez -> Vai para Q9 (Motivo)
        // Caso contrário -> Pula para Q11 (Parcerias Ativas)
        if (!hasPotenza && !isFirstTime) {
            return 9;
        } else {
            return 11;
        }
    }

    if (current === 9) return 10; // Q9 sempre vai para Q10
    if (current === 10) return 11; // Q10 sempre vai para Q11

    if (current === 11) { // Após Parcerias Ativas
            const hasNone = document.getElementById('chk-no-partners').checked;
            // Se Nenhuma parceria -> Pula Exclusividade (Q12) -> Vai verificar Cursos (Q13)
            if (hasNone) return checkCoursesStep(12); // Pula Q12
            return 12; // Vai para Q12
    }

    if (current === 12) {
            return checkCoursesStep(12);
    }

    return next;
}

// Helper para verificar se vai para Cursos (13) ou Fim
function checkCoursesStep(fromStep) {
    const hasCourses = document.getElementById('chk-cursos').checked;
    if (hasCourses) return 13;
    // Se não tem cursos, o formulário acabou. 
    // Como o botão da Q12/Q11 é "Próximo", precisamos disparar o submit se não houver Q13.
    // Vamos tratar isso fazendo o botão da última etapa visível virar "Enviar" visualmente ou 
    // chamar o submit direto. Para simplificar, se chegar aqui, chamamos submitForm.
    submitForm();
    return fromStep; // Mantém no passo para evitar erro visual enquanto envia
}

function getPrevStepIndex(current) {
    if (current === 13) {
        // Se veio de onde? Depende da lógica inversa
        const hasPartners = !document.getElementById('chk-no-partners').checked;
        return hasPartners ? 12 : 11;
    }
    if (current === 12) return 11;
    if (current === 11) {
            // Veio do 10 ou do 8?
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

// --- VALIDAÇÃO POR PASSO ---
function validateStep(step) {
    let valid = true;
    const stepDiv = document.querySelector(`.step[data-step="${step}"]`);
    
    // Helper
    const setError = (el, msg, isShow) => {
        const err = el.parentElement.querySelector('.error-msg') || el.querySelector('.error-msg') || stepDiv.querySelector('.error-msg');
        if(err) err.style.display = isShow ? 'block' : 'none';
        if(el.tagName === 'INPUT') {
            if(isShow) el.classList.add('error-border');
            else el.classList.remove('error-border');
        }
    };

    // Validações
    if (step === 1) { // Nome
        const val = document.getElementById('name').value.trim();
        valid = val !== '';
        setError(document.getElementById('name'), null, !valid);
    }
    if (step === 2) { // Email regex
        const val = document.getElementById('email').value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = regex.test(val);
        setError(document.getElementById('email'), null, !valid);
    }
    if (step === 3) { // Phone
        const val = document.getElementById('phone').value.replace(/\D/g, '');
        valid = val.length >= 8;
        setError(document.getElementById('phone'), null, !valid);
    }
    if (step === 4) { // Cidade Tag Input Single
        const val = cityAutocomplete.getValue();
        valid = val !== '';
        setError(document.getElementById('city-wrapper'), null, !valid);
    }
    if (step === 5) { // Instagram
        const val = document.getElementById('instagram').value.trim();
        valid = val !== '';
        setError(document.getElementById('instagram'), null, !valid);
    }
    if (step === 6) { // Parceria Chk
        const checked = document.querySelectorAll('#partnership-type-group input:checked').length > 0;
        valid = checked;
        setError(document.getElementById('partnership-type-group'), null, !valid);
    }
    if (step === 7) { // Marcas Chk
        const checked = document.querySelectorAll('#brands-group input:checked').length > 0;
        valid = checked;
        setError(document.getElementById('brands-group'), null, !valid);
    }
    if (step === 8) { // Produtos Tags
        const tags = tagInputProducts.getValue();
        valid = tags.length > 0;
        const err = document.getElementById('err-p8');
        err.style.display = valid ? 'none' : 'block';
        if(!valid) document.getElementById('products-tag-input-wrapper').classList.add('error-border');
        else document.getElementById('products-tag-input-wrapper').classList.remove('error-border');
    }
    if (step === 9) { // Motivo Potenza
        const checked = document.querySelector('input[name="potenza_reason"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Outro') {
            if(document.getElementById('potenza-reason-other').value.trim() === '') valid = false;
        }
        setError(document.getElementById('potenza-reason-group'), null, !valid);
    }
    if (step === 10) { // Interesse Potenza
        const checked = document.querySelector('input[name="potenza_interest"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Sim') {
            if(tagInputPotenzaInterest.getValue().length === 0) valid = false;
        }
        setError(document.getElementById('potenza-interest-bool'), null, !valid);
    }
    if (step === 11) { // Parcerias Ativas
        const dentais = document.getElementById('chk-dentais').checked;
        const empresas = document.getElementById('chk-empresas').checked;
        const none = document.getElementById('chk-no-partners').checked;
        
        valid = dentais || empresas || none;
        
        if(dentais && document.getElementById('input-dentais').value.trim() === '') valid = false;
        if(empresas && document.getElementById('input-empresas').value.trim() === '') valid = false;
        
        setError(document.getElementById('active-partnerships-group'), null, !valid);
    }
    if (step === 12) { // Exclusividade
        const checked = document.querySelector('input[name="exclusivity"]:checked');
        valid = !!checked;
        if(valid && checked.value === 'Sim') {
            if(document.getElementById('input-exclusivity').value.trim() === '') valid = false;
        }
        setError(document.getElementById('exclusivity-group'), null, !valid);
    }
    if (step === 13) { // Cursos
        valid = formData.courses.length > 0;
        const err = document.getElementById('course-list-error');
        err.style.display = valid ? 'none' : 'block';
    }

    return valid;
}

// --- LÓGICA DE CURSOS ---
function addCourse() {
    const inputs = ['c-name', 'c-type', 'c-region', 'c-freq', 'c-dur', 'c-students', 'c-links'];
    const values = {};
    let isValid = true;
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        values[id] = el.value.trim();
        if(values[id] === '') {
            el.classList.add('error-border');
            isValid = false;
        } else {
            el.classList.remove('error-border');
        }
    });

    const err = document.getElementById('course-add-error');
    if(!isValid) {
        err.style.display = 'block';
        return;
    }
    err.style.display = 'none';

    // Adicionar ao Array
    formData.courses.push(values);
    renderCourses();
    
    // Limpar inputs
    inputs.forEach(id => document.getElementById(id).value = '');
}

function renderCourses() {
    const list = document.getElementById('courses-list');
    list.innerHTML = '';
    formData.courses.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'course-card';
        div.innerHTML = `
            <strong>${c['c-name']}</strong> (${c['c-type']})<br>
            <small>${c['c-region']} | ${c['c-freq']}</small>
            <span class="remove-course" onclick="removeCourse(${i})">Excluir</span>
        `;
        list.appendChild(div);
    });
}

// Precisa estar no escopo global para o onclick html funcionar
window.removeCourse = function(index) {
    formData.courses.splice(index, 1);
    renderCourses();
}

// --- ENVIO (RD STATION) ---
async function submitForm() {
    // Validação final do passo atual antes de enviar
    if (!validateStep(currentStep)) {
        const currentDiv = document.querySelector(`.step[data-step="${currentStep}"]`);
        currentDiv.classList.add('shake');
        setTimeout(() => currentDiv.classList.remove('shake'), 500);
        return;
    }

    document.getElementById('loading-overlay').classList.remove('hidden');

    // 1. Coletar Dados
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Custom Fields
    const city = cityAutocomplete.getValue();
    const instagram = document.getElementById('instagram').value;
    
    const partTypes = Array.from(document.querySelectorAll('#partnership-type-group input:checked')).map(c => c.value).join(', ');
    const brands = Array.from(document.querySelectorAll('#brands-group input:checked')).map(c => c.value).join(', ');
    
    const products = tagInputProducts.getValue().join(', ');
    
    // Lógica Potenza
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

    // Parcerias Ativas
    let parceriasAtivas = [];
    if(document.getElementById('chk-dentais').checked) parceriasAtivas.push("Dentais: " + document.getElementById('input-dentais').value);
    if(document.getElementById('chk-empresas').checked) parceriasAtivas.push("Empresas: " + document.getElementById('input-empresas').value);
    if(document.getElementById('chk-no-partners').checked) parceriasAtivas.push("Nenhuma");
    
    // Exclusividade
    const exclOpt = document.querySelector('input[name="exclusivity"]:checked');
    if(exclOpt) {
            const exclTxt = exclOpt.value === "Sim" ? "Sim: " + document.getElementById('input-exclusivity').value : "Não";
            parceriasAtivas.push("Exclusividade: " + exclTxt);
    }
    const strParcerias = parceriasAtivas.join(' | ');

    // Cursos (Formatado)
    let strCursos = "";
    if(formData.courses.length > 0) {
        strCursos = formData.courses.map(c => 
            `Curso: ${c['c-name']} | Tipo: ${c['c-type']} | Região: ${c['c-region']} | Freq: ${c['c-freq']} | Dur: ${c['c-dur']} | Alunos: ${c['c-students']} | Links: ${c['c-links']}`
        ).join('\n----------------\n');
    }

    // 2. Montar Payload
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

    // 3. Converter para x-www-form-urlencoded
    const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');

    // 4. Fetch
    try {
        await fetch('https://www.rdstation.com.br/api/1.3/conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });
        
        // RD Station nem sempre retorna 200 JSON limpo em POST direto do browser por causa de CORS,
        // mas o request é disparado. Em produção, assume-se sucesso ou trata-se erro de rede.
        // Para garantir a UX, vamos mostrar sucesso após o await.
        
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
