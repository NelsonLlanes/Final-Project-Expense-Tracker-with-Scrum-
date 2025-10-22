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

        document.getElementById("expense-form").reset(); //reset form when open modal
    });

    // Logic for closing the modal
    closeBtn.addEventListener('click', () => {
        document.getElementById("modal-title").textContent = "Add New Transaction";
        modal.classList.add('hidden'); // Add 'hidden' to hide the modal form

    });

    const form = document.getElementById('expense-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('transaction-name').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const note = document.getElementById('note').value;
        const category = document.getElementById('category').value;
        const occurredAt = document.getElementById('occurred-at').value;
 
        // check budget before adding expense
        const totalExpense = expenses
            .filter(exp => exp.category === category.toLocaleLowerCase())
            .reduce((sum, exp) => sum + exp.amount, 0) + amount;
        if (totalExpense > budgetSettings[category]) {
            const userConfirmed = confirm(`Budget exceeded for ${category}! Do you still want to add this expense?`);
            if (!userConfirmed) {
                return; // abort adding the expense
            }
        }
        // EDIT
        const transactionId = document.getElementById('transaction-id').value;
        if (transactionId) {
            const ok = updateExpense(transactionId, { name, amount, note, category, occurredAt });
            if (ok) {
                form.reset();
                alert('Expense updated successfully!');
                renderExpenses();
                modal.classList.add('hidden');
                isEditMode = false;
                exitEditMode();
                window.dispatchEvent(new Event('expenseAddedOrRemoved'));
            } else {
                alert('Failed to update expense. Please try again.');
            }
        } else {
            // ADD
            const expense = {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                name,
                amount,
                note,
                category,
                occurredAt,
            };
    
            if (addExpense(expense)) {
                form.reset();
                alert('Expense added successfully!');
                renderExpenses();
                document.getElementById('modal-add-transaction').classList.add('hidden'); // For closing the modal when something is added
                window.dispatchEvent(new Event('expenseAddedOrRemoved'));
            } else {
                alert('Failed to add expense. Please try again.');
            }
        }

    });
    renderExpenses();
});

function editStorage(event) {

    // declare modal of new expense formulari
    const modal = document.getElementById('modal-add-transaction');
    document.getElementById("modal-title").textContent = "Edit Transaction";
    //true?
    if (!isEditMode) return; 
    //click on the expense
    const li = (event).target.closest("li");
    if (!li) return;
    // save the id of li
    const id = li.dataset.id || li.id;
    if (!id) return;

    // find by a property method 
    const expense = loadExpenses().find((item) => item.id === id);

    if (!expense) return;
    //reset form
    document.getElementById("expense-form").reset();


    //assing values to the input
    document.getElementById("transaction-id").value = expense.id
    document.getElementById("occurred-at").value = expense.createdAt
    document.getElementById("transaction-name").value = expense.name
    document.getElementById("amount").value = expense.amount
    document.getElementById("note").value = expense.note
    document.getElementById("category").value = expense.category
    document.getElementById("occurred-at").value = expense.occurredAt

    // open modal with load informacion
    modal.classList.remove('hidden');
}




// renderExpenses function
function renderExpenses(expensesToRender = loadExpenses()) {
    const list = document.getElementById('expense-list');
    if (list === null) return;

    list.innerHTML = ``;

    if (expensesToRender.length === 0) {
        list.innerHTML = '<li style="padding: 10px 0 10px 20px; font-family: Segoe UI">No expenses yet! </li>';
        return;
    }

    expensesToRender.forEach(expense => {
        const categoryKey = (expense.category || 'other').toLowerCase();
        // creates the li element
        const item = document.createElement("li");
        // add classname for format to the list element
        item.className = `transaction-item ${categoryKey} transaction-item--${categoryKey}`;
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

        const span5 = document.createElement("span");
        span5.className = `name`;
        span5.textContent = `${expense.name}`;

        const span2 = document.createElement("span");
        span2.className = `details`;
        span2.textContent = expense.note || expense.name;

        const priceSpan = document.createElement("span");
        priceSpan.classList.add('amount', 'self-end');
        priceSpan.textContent = ` $ ${expense.amount}`;

        // add span elements inside the div
        div.append(span5, span2)


        // change date format
        const [y, m, d] = expense.occurredAt.split('-').map(Number);
        const transactionDate = new Date(y, m - 1, d);
        const formatedDate = transactionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        const dayWeek = transactionDate.toLocaleDateString('en-US', { weekday: 'long' });
        const finalDateText = `${formatedDate} - ${dayWeek}`;
        // const day = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });
        const rightDiv = document.createElement("div");
        rightDiv.classList.add("flex", "flex-col", "justify-between", "item-end");


        const span4 = document.createElement("span");
        span4.classList.add("day", "self-end");

        span4.textContent = `${finalDateText}`;
        rightDiv.append(span4, priceSpan);
        item.append(iconWrapper, div, rightDiv);

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
// edit button
const EditToggleBtn = document.getElementById('Edit-toggle');

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
    modal.classList.add('hidden'); // Add 'hidden' to hide the modal form
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
    EditToggleBtn.hidden = true;

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
    deleteToggleBtn.textContent = 'Delete';
    deleteConfirmBtn.hidden = true;
    deleteConfirmBtn.disabled = true;
    EditToggleBtn.hidden = false;

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
    deleteConfirmBtn.textContent = `Selected (${n})`;
    deleteConfirmBtn.disabled = n === 0;
}

window.renderExpenses = renderExpenses;
// edit function
let isEditMode = false;

// toggle edit mode
EditToggleBtn.addEventListener('click', (e) => {
    isEditMode = !isEditMode;
    isEditMode ? enterEditMode(e) : exitEditMode();
});

// enter Edit funtion 
function enterEditMode(event = null) {
    // change the buttons context and disable the confirm button until something is selected
    EditToggleBtn.textContent = 'Cancel Edit';
    EditToggleBtn.hidden = false;
    deleteToggleBtn.hidden = true
    deleteConfirmBtn.hidden = true;
    deleteConfirmBtn.disabled = true;
    document.querySelectorAll('.transaction-item').forEach((item) => {
        item.addEventListener('click', (e) => editStorage(e));
    });
}

// exit edit mode
function exitEditMode() {
    document.getElementById("expense-form").reset();
    isEditMode = false;
    EditToggleBtn.textContent = 'Edit';
    EditToggleBtn.hidden = false;
    deleteToggleBtn.hidden = false;
    deleteConfirmBtn.hidden = true;
    deleteConfirmBtn.disabled = true;
    document.querySelectorAll('.transaction-item').forEach((item) => {
        item.removeEventListener('click', (e) => editStorage(e));
    });
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