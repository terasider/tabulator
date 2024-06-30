document.addEventListener('DOMContentLoaded', () => {
    const bankSelector = document.getElementById('bank-selector');
    const createBankButton = document.getElementById('create-bank');
    const editBankButton = document.getElementById('edit-bank');
    const deleteBankButton = document.getElementById('delete-bank');
    const createTabButton = document.getElementById('create-tab');
    const tabsContainer = document.getElementById('tabs-container');
    const bankModal = document.getElementById('bank-modal');
    const tabModal = document.getElementById('tab-modal');
    const closeBankModal = document.getElementById('close-bank-modal');
    const closeTabModal = document.getElementById('close-tab-modal');
    const saveBankButton = document.getElementById('save-bank');
    const saveTabButton = document.getElementById('save-tab');
    const newBankNameInput = document.getElementById('new-bank-name');
    const newTabNameInput = document.getElementById('new-tab-name');
    const newTabContentInput = document.getElementById('new-tab-content');

    let currentBank = null;
    let isEditingBank = false;
    let isEditingTab = false;
    let currentTabIndex = null;

    function saveBanksToLocalStorage(banks) {
        localStorage.setItem('banks', JSON.stringify(banks));
    }

    function loadBanksFromLocalStorage() {
        const banks = localStorage.getItem('banks');
        return banks ? JSON.parse(banks) : {};
    }

    function updateBankSelector() {
        const banks = loadBanksFromLocalStorage();
        bankSelector.innerHTML = '<option value="" disabled selected>Selecione um Banco</option>';
        Object.keys(banks).forEach(bank => {
            const option = document.createElement('option');
            option.value = bank;
            option.textContent = bank;
            bankSelector.appendChild(option);
        });
    }

    function updateTabsContainer() {
        tabsContainer.innerHTML = '';
        if (currentBank) {
            const banks = loadBanksFromLocalStorage();
            const tabs = banks[currentBank] || [];
            tabs.forEach((tab, index) => {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = tab.name;
                details.appendChild(summary);
                const content = document.createElement('div');
                content.innerHTML = tab.content;
                details.appendChild(content);
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => editTab(index));
                details.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.addEventListener('click', () => deleteTab(index));
                details.appendChild(deleteButton);
                tabsContainer.appendChild(details);
            });
        }
    }

    function editTab(index) {
        const banks = loadBanksFromLocalStorage();
        const tab = banks[currentBank][index];
        newTabNameInput.value = tab.name;
        newTabContentInput.value = tab.content;
        tabModal.style.display = 'block';
        isEditingTab = true;
        currentTabIndex = index;
    }

    function deleteTab(index) {
        const banks = loadBanksFromLocalStorage();
        banks[currentBank].splice(index, 1);
        saveBanksToLocalStorage(banks);
        updateTabsContainer();
    }

    createBankButton.addEventListener('click', () => {
        bankModal.style.display = 'block';
        isEditingBank = false;
        newBankNameInput.value = '';
    });

    editBankButton.addEventListener('click', () => {
        if (currentBank) {
            bankModal.style.display = 'block';
            isEditingBank = true;
            newBankNameInput.value = currentBank;
        } else {
            alert('Por favor, selecione um banco primeiro!');
        }
    });

    deleteBankButton.addEventListener('click', () => {
        if (currentBank) {
            const banks = loadBanksFromLocalStorage();
            delete banks[currentBank];
            saveBanksToLocalStorage(banks);
            currentBank = null;
            updateBankSelector();
            updateTabsContainer();
        } else {
            alert('Por favor, selecione um banco primeiro!');
        }
    });

    closeBankModal.addEventListener('click', () => {
        bankModal.style.display = 'none';
    });

    saveBankButton.addEventListener('click', () => {
        const bankName = newBankNameInput.value.trim();
        if (bankName) {
            const banks = loadBanksFromLocalStorage();
            if (isEditingBank) {
                if (currentBank !== bankName && banks[bankName]) {
                    alert('Outro banco com o mesmo nome já existe!');
                } else {
                    const tabs = banks[currentBank];
                    delete banks[currentBank];
                    banks[bankName] = tabs;
                    saveBanksToLocalStorage(banks);
                    updateBankSelector();
                    bankModal.style.display = 'none';
                    currentBank = bankName;
                }
            } else {
                if (!banks[bankName]) {
                    banks[bankName] = [];
                    saveBanksToLocalStorage(banks);
                    updateBankSelector();
                    bankModal.style.display = 'none';
                } else {
                    alert('Banco já existe!');
                }
            }
            newBankNameInput.value = '';
        } else {
            alert('Nome do banco não pode estar vazio!');
        }
    });

    createTabButton.addEventListener('click', () => {
        if (currentBank) {
            tabModal.style.display = 'block';
            isEditingTab = false;
            newTabNameInput.value = '';
            newTabContentInput.value = '';
        } else {
            alert('Por favor, selecione um banco primeiro!');
        }
    });

    closeTabModal.addEventListener('click', () => {
        tabModal.style.display = 'none';
    });

    saveTabButton.addEventListener('click', () => {
        const tabName = newTabNameInput.value.trim();
        const tabContent = newTabContentInput.value.trim();
        if (tabName && tabContent) {
            const banks = loadBanksFromLocalStorage();
            if (isEditingTab) {
                banks[currentBank][currentTabIndex] = { name: tabName, content: tabContent };
            } else {
                banks[currentBank].push({ name: tabName, content: tabContent });
            }
            saveBanksToLocalStorage(banks);
            updateTabsContainer();
            tabModal.style.display = 'none';
            newTabNameInput.value = '';
            newTabContentInput.value = '';
        } else {
            alert('Nome e conteúdo da aba não podem estar vazios!');
        }
    });

    bankSelector.addEventListener('change', (e) => {
        currentBank = e.target.value;
        updateTabsContainer();
    });

    // Load initial data
    updateBankSelector();
});
