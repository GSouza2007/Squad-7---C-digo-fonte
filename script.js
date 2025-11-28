// Estado global do tutorial
let currentStep = 1;
let completedSteps = [];

// Dados do primeiro passo (novo fornecedor)
let formData = {
    responsavel: '',
    empresa: '',
    telefone: '',
    cnpj: ''
};

// Lista de produtos cadastrados
let products = [];

// Abre/fecha um accordion específico. Apenas um pode estar aberto por vez
function toggleAccordion(index) {
    const items = document.querySelectorAll('.accordion-item');
    const item = items[index];

    items.forEach((el, i) => {
        if (i !== index) {
            el.classList.remove('active');
        }
    });

    item.classList.toggle('active');

    if (item && item.classList.contains('active')) {
        currentStep = index + 1;
        updateProgress(currentStep);
    }
}

// Salva dados da etapa atual e avança para a próxima
function handleSave() {
    const activeAccordion = document.querySelector('.accordion-item.active');
    const accordionIndex = Array.from(document.querySelectorAll('.accordion-item')).indexOf(activeAccordion);
    const stepNumber = accordionIndex + 1;

    // Valida o primeiro passo (fornecedor)
    if (stepNumber === 1) {
        const responsavel = document.getElementById('responsavel').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();

        if (!responsavel || !empresa || !telefone) {
            alert('Preencha os campos obrigatórios (responsável, empresa e telefone) para continuar.');
            return;
        }

        formData = { responsavel, empresa, telefone, cnpj };
    }

    markStepAsCompleted(stepNumber);
    closeAccordionStep(accordionIndex);

    // Abre o próximo accordion automaticamente
    if (accordionIndex < 3) {
        openAccordionStep(accordionIndex + 1);
        setTimeout(() => {
            updateProgress(accordionIndex + 2);
        }, 100);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Marca uma etapa como concluída e atualiza a UI
function markStepAsCompleted(stepNumber) {
    if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
    }
    showStepCheckmark(stepNumber);
    updateProgress(stepNumber);
    markAccordionAsCompleted(stepNumber - 1);
    checkTutorialCompletion();
}

function markAccordionAsCompleted(index) {
    const items = document.querySelectorAll('.accordion-item');
    if (items[index]) {
        items[index].classList.add('completed');
    }
}

function showStepCheckmark(stepNumber) {
    const checkElement = document.getElementById(`check-${stepNumber}`);
    if (checkElement) {
        checkElement.classList.add('visible');
    }
}

function closeAccordionStep(index) {
    const items = document.querySelectorAll('.accordion-item');
    if (items[index]) {
        items[index].classList.remove('active');
    }
}

function openAccordionStep(index) {
    const items = document.querySelectorAll('.accordion-item');
    if (items[index]) {
        items[index].classList.add('active');
    }
}

function checkTutorialCompletion() {
    if (completedSteps.length >= 3) {
        showFinishButton();
    }
}

function showFinishButton() {
    const container = document.getElementById('finalizarContainer');
    const mensagem = document.getElementById('mensagemFinalizacao');

    if (container) {
        let texto = '';
        if (completedSteps.length === 3) {
            texto = 'Você concluiu 3 de 4 passos. Pode finalizar o tutorial quando preferir.';
        } else if (completedSteps.length === 4) {
            texto = 'Você concluiu os 4 passos do tutorial.';
        }
        if (mensagem) mensagem.textContent = texto;
        container.style.display = 'block';
        container.style.animation = 'fadeIn 0.5s ease';
    }
}

function finalizarTutorial() {
    window.location.href = '/dashboard';
}

function handleExitTutorial() {
    const modal = document.getElementById('confirmModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
}

function confirmExitTutorial() {
    closeModals();
    window.history.back();
}

function handleExit() {
    const modal = document.getElementById('logoutModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
}

function handleConfirmLogout() {
    closeModals();
    window.location.href = '/logout';
}

function handleCancelLogout() {
    closeModals();
}

function closeModals() {
    const confirmModal = document.getElementById('confirmModal');
    const logoutModal = document.getElementById('logoutModal');
    const productModal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');

    if (confirmModal) confirmModal.style.display = 'none';
    if (logoutModal) logoutModal.style.display = 'none';
    if (productModal) productModal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

function openProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// Adiciona um novo produto à lista
function handleAddProduct() {
    const productName = document.getElementById('productName').value.trim();
    const productBrand = document.getElementById('productBrand').value.trim();
    const productEAN = document.getElementById('productEAN').value.trim();
    const productGroup = document.getElementById('productGroup').value;

    // Valida campos obrigatórios
    if (!productName || !productBrand || !productGroup) {
        alert('Informe nome, marca e grupo do produto para cadastrar.');
        return;
    }

    const newProduct = {
        id: Date.now(),
        nome: productName,
        marca: productBrand,
        ean: productEAN,
        grupo: productGroup
    };

    products.push(newProduct);
    updateProductsTable();

    // Limpa o formulário após adicionar
    document.getElementById('productName').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('productEAN').value = '';
    document.getElementById('productGroup').value = '';

    closeProductModal();
}

// Renderiza a tabela de produtos
function updateProductsTable() {
    const tbody = document.querySelector('.products-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Mostra mensagem quando não há produtos
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr style="border-bottom: 1px solid var(--medium-gray);">
                <td style="padding: 1rem; color: var(--dark-gray);">Nenhum produto cadastrado</td>
                <td style="padding: 1rem;"></td>
                <td style="padding: 1rem; text-align: center;"></td>
            </tr>
        `;
        return;
    }

    // Monta linhas da tabela com os produtos
    products.forEach(product => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--medium-gray)';
        row.innerHTML = `
            <td style="padding: 1rem; color: var(--dark-gray); font-weight: 500;">${product.nome}</td>
            <td style="padding: 1rem; color: var(--text-gray);">${product.marca}</td>
            <td style="padding: 1rem; text-align: center;">
                <button onclick="deleteProduct(${product.id})" style="background: none; border: none; color: var(--danger-red); cursor: pointer; font-size: 1.2rem;" title="Remover">&times;</button>
            </td>`;
        tbody.appendChild(row);
    });
}

function deleteProduct(productId) {
    products = products.filter(p => p.id !== productId);
    updateProductsTable();
}

// Atualiza a barra de progresso visual
function updateProgress(step) {
    currentStep = step;
    const progressItems = document.querySelectorAll('.progress-item');

    progressItems.forEach((item, index) => {
        const stepNumber = index + 1;
        item.classList.remove('active', 'completed');
        if (completedSteps.includes(stepNumber)) {
            item.classList.add('completed');
        } else if (stepNumber === step) {
            item.classList.add('active');
        }
    });
}

// Inicializa o tutorial quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Fecha modals ao clicar no overlay
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.addEventListener('click', closeModals);

    // Fecha modals ao pressionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeModals();
    });

    // Formata telefone em tempo real: (XX) XXXXX-XXXX
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Formata CNPJ em tempo real: XX.XXX.XXX/XXXX-XX
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = value;
                } else if (value.length <= 5) {
                    value = `${value.slice(0, 2)}.${value.slice(2)}`;
                } else if (value.length <= 8) {
                    value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
                } else {
                    value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Abre o primeiro passo do tutorial
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) firstAccordion.classList.add('active');
});