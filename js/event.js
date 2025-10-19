const CATEGORY_ICON_MAP = {
    supermarket: 'fa-store',
    restaurant: 'fa-utensils',
    transport: 'fa-train-subway',
    transfer: 'fa-money-bill-transfer',
    other: 'fa-ellipsis',
    others: 'fa-ellipsis',
};

const CATEGORY_LABEL_MAP = {
    supermarket: 'Supermarket',
    restaurant: 'Food',
    transport: 'Transport',
    transfer: 'Transfer',
    other: 'Other',
    others: 'Other',
};

document.addEventListener('DOMContentLoaded', () => {
    const budgetSettings = loadBudgetSetting();
    const expenses = loadExpenses();

    // Logic for opening the modal form
    const modal = document.getElementById('modal-add-transaction');
    const openBtn = document.getElementById('btn-open-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden'); // Remove 'hidden' to show the modal form
    });

    // Logic for closing the modal
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden'); // Add 'hidden' to hide the modal form
    });

    const form = document.getElementById('expense-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const expense = {};
        expense.id = crypto.randomUUID();
        expense.createdAt = new Date().toISOString();
        expense.name = document.getElementById('transaction-name').value;
        expense.amount = parseFloat(document.getElementById('amount').value);
        expense.note = document.getElementById('note').value;
        const selectedCategory = form.querySelector('input[name="category"]:checked');
        if (!selectedCategory) {
            alert('Please select a category.');
            return;
        }
        expense.category = selectedCategory.value;
        expense.occurredAt = document.getElementById('occurred-at').value;

        // check budget before adding expense
        const totalExpense = expenses
            .filter(exp => exp.category === expense.category.toLocaleLowerCase())
            .reduce((sum, exp) => sum + exp.amount, 0) + expense.amount;
        if (totalExpense > budgetSettings[expense.category]) {
            const userConfirmed = confirm(`Budget exceeded for ${expense.category}! Do you still want to add this expense?`);
            if (!userConfirmed) {
                return; // abort adding the expense
            }
        }


        if (addExpense(expense)) {
            form.reset();
            alert('Expense added successfully!');
            document.getElementById('modal-add-transaction').classList.add('hidden'); // For closing the modal when something is added
        } else {
            alert('Failed to add expense. Please try again.');
        }
    });
    renderExpenses();
});

// renderExpenses function
function renderExpenses() {
    const list = document.getElementById('expense-list');
    if (list === null) return;
    const expenses = loadExpenses();
    list.innerHTML = ``;

    if (expenses.length === 0) {
        list.innerHTML = '<li>No expenses yet</li>';
        return;
    }

    expenses.forEach(expense => {
        const categoryKey = (expense.category || 'other').toLowerCase();
        // creates the li element
        const item = document.createElement("li");
        // add classname for format to the list element
        item.className = `transaction-item transaction-item--${categoryKey}`;
        //add id to the li element
        item.dataset.id = expense.id;
        // add data-category attribute
        item.dataset.category = categoryKey;

        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'transaction-icon';
        const iconEl = document.createElement('i');
        iconEl.className = `fa-solid ${CATEGORY_ICON_MAP[categoryKey] || 'fa-circle-info'}`;
        iconEl.setAttribute('aria-hidden', 'true');
        iconWrapper.appendChild(iconEl);

        const div = document.createElement("div");
        div.className = `content`;

        // create the span element
        const span1 = document.createElement("span");
        // add class to the span1
        span1.className = `category`;
        // add content to the span elemente
        span1.textContent = `${CATEGORY_LABEL_MAP[categoryKey] || expense.category}`;

        const span2 = document.createElement("span");
        span2.className = `details`;
        span2.textContent = expense.note || expense.name;

        const span3 = document.createElement("span");
        span3.className = `amount`;
        span3.textContent = ` $ ${expense.amount}`;

        div.append(span1, span2, span3);
        // change date format
        const [y, m, d] = expense.occurredAt.split('-').map(Number);
        const day = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });


        const span4 = document.createElement("span");
        span4.className = "day";
        span4.textContent = `${day}`;
        item.append(iconWrapper, div, span4);

        list.prepend(item);
    });
    checkBudgetExceed();
};

// delete mode

// declaring delete toggle as off
let isDeleteMode = false;

//coleccion of javascript for non duplicate items
const selectedIds = new Set();

//getting list element(transaction)
const listelement = document.getElementById('expense-list');

//delete button
const deleteToggleBtn = document.getElementById('delete-toggle');
//confirm button
const deleteConfirmBtn = document.getElementById('delete-confirm');

//on and off delete menu
deleteToggleBtn.addEventListener('click', () => {
    isDeleteMode = !isDeleteMode;
    isDeleteMode ? enterDeleteMode() : exitDeleteMode();
});

// if items are selected. confirm before erasing.
deleteConfirmBtn.addEventListener('click', () => {
    if (selectedIds.size === 0) return;
    const ok = confirm(`Delete ${selectedIds.size} transaction(s)?`);
    if (!ok) return;

    // erase after confirmartion
    for (const id of selectedIds) {
        removeExpense(id);
    }

    exitDeleteMode();
    renderExpenses();
});


listelement.addEventListener('click', (e) => {
    // looking for the closest li of target
    const li = e.target.closest('li');
    // if find nothing. dont do anything
    if (!li) return;
    // look for if checkbox is check or not
    const cb = li.querySelector('input.selector[type="checkbox"]');
    // if theres no checkbox. do nothing
    if (!cb) return;
    // check or not the checkbox
    cb.checked = !cb.checked;
    // call function
    toggleSelection(li, cb.checked);
});


// delete function
function enterDeleteMode() {
    // erase list of id´s selected
    selectedIds.clear();
    // update select items to 0
    updateConfirmLabel();


    // change the buttons context and disable the confirm button until something is selected
    deleteToggleBtn.textContent = 'Cancel delete';
    deleteConfirmBtn.hidden = false;
    deleteConfirmBtn.disabled = true;

    // change visual of the item selected
    listelement.classList.add('delete-mode');

    const items = listelement.querySelectorAll('li');

    // check if the item has an id. if there is add a checkbox
    items.forEach((li) => {
        const id = li.dataset.id || li.id;
        if (!id) return;


        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'selector';
        cb.title = 'Select to delete';
        li.insertBefore(cb, li.lastElementChild);
    });
}


function exitDeleteMode() {
    isDeleteMode = false;
    selectedIds.clear();
    updateConfirmLabel();
    deleteToggleBtn.textContent = 'Delete transactions';
    deleteConfirmBtn.hidden = true;
    deleteConfirmBtn.disabled = true;

    listelement.classList.remove('delete-mode');

    listelement.querySelectorAll('input.selector[type="checkbox"]').forEach((cb) => {
        cb.remove();
    });

    listelement.querySelectorAll('li.selected').forEach((li) => {
        li.classList.remove('selected');
    });
}


// add or not the "selected" class
function toggleSelection(li, selected) {
    const id = li.dataset.id || li.id;
    if (!id) return;

    if (selected) {
        li.classList.add('selected');
        selectedIds.add(id);
    } else {
        li.classList.remove('selected');
        selectedIds.delete(id);
    }
    updateConfirmLabel();
}

//counter of items selects
function updateConfirmLabel() {
    const n = selectedIds.size;
    deleteConfirmBtn.textContent = `Delete selected (${n})`;
    deleteConfirmBtn.disabled = n === 0;
}

// budget exceed check and highlight
const checkBudgetExceed = () => {
    const budgetSettings = loadBudgetSetting();
    const expenses = loadExpenses();

    for (const category in budgetSettings) {
        let categoryLowerCase = category.toLocaleLowerCase()
        const totalExpense = expenses
            .filter(exp => exp.category == categoryLowerCase)
            .reduce((sum, exp) => sum + exp.amount, 0);

        const categoryElement = document.querySelectorAll(`[data-category="${category.toLocaleLowerCase()}"]`);
        if (!categoryElement) continue;
        if (totalExpense > budgetSettings[category]) {
            categoryElement.forEach(el => el.classList.add('bg-red-200', 'bg-opacity-50'));
        } else {
            categoryElement.forEach(el => el.classList.remove('bg-red-200', 'bg-opacity-50'));
        }
    }
};
