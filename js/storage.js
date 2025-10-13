/**
 * @typeof {Object} Expense
 * @property {string} id - Unique identifier for the expense
 * @property {string} name - Date and time when the expense was created
 * @property {number} amount - Amount of the expense
 * @property {string} [note] - Optional note about the expense
 * @property {string} category - Category of the expense
 * @property {string} occurredAt - Date and time when the expense occurred
 * @property {string} createdAt - Date and time when the expense was created
*/

// localStorage key name
const STORAGE_KEY = 'expenses';

/** @type {Expense[]} */
const expenses = []


/**
 * Load expenses from localStorage
 * @returns {Expense[]} Array of expenses
*/
const loadExpenses = () => {
    const expensesJSON = localStorage.getItem(STORAGE_KEY);
    return expensesJSON ? JSON.parse(expensesJSON) : [];
}

/**
 * Save a new expense to localStorage
 * @param {Expense} expense 
 * @returns {boolean} The saved expense
*/
const addExpense = (expense) => {
    const storageExpenses = loadExpenses();
    storageExpenses.push(expense);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageExpenses));
    } catch (e) {
        console.error('Error saving expense to localStorage', e);
        return false;
    }
    return true;
}

/**
 * Remove an expense from localStorage
 * @param {string} id 
 * @returns {boolean} true if the expense was removed, false otherwise
*/
const removeExpense = (id) => {
    const storageExpenses = loadExpenses();
    const index = storageExpenses.findIndex(expense => expense.id === id);
    if (index !== -1) {
        storageExpenses.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageExpenses));
        return true;
    }
    return false;
}

// Functions are now available globally
window.addExpense = addExpense;
window.loadExpenses = loadExpenses;
window.removeExpense = removeExpense;

///////////////////////////////////////////////////////////////////////// prueba nelson

function renderExpenses() {
    const list = document.getElementById('expense-list')
    const expenses = loadExpenses();
    list.innerHTML = ``;

    if (expenses.length === 0) {
        list.innerHTML = '<li>No expenses yet</li>';
        return;
    }

    expenses.forEach(expense => {
        // creates the li element
        const item = document.createElement("li");
        // add classname for format to the list element
        item.className = `transaction-item ${expense.category}`;
        //add id to the li element
        item.dataset.id = expense.id;
        // create div 
        const div = document.createElement("div");
        // add class to the div
        div.className = `content`;
        // add the div inside the li
        item.prepend(div)

        // create the span elemente
        const span1 = document.createElement("span");
        // add clas to the span1
        span1.className = `category`;
        // add content to the span elemente
        span1.textContent = `${expense.category}`;

        const span2 = document.createElement("span");
        span2.className = `details`;
        span2.textContent = `${expense.note}`;

        const span3 = document.createElement("span");
        span3.className = `amount`;
        span3.textContent = ` $ ${expense.amount}`;

        div.append(span1, span2, span3)


        list.prepend(item)
    });
};
/////////////////////////////////delete option
//declaring delete mode as off
let isDeleteMode = false;

//coleccion of javascript for non duplicate items
const selectedIds = new Set();

//getting each list element(transaction)
const listelement = document.getElementById('expense-list');

//delete button
const deleteToggleBtn = document.getElementById('delete-toggle');
//confirm button
const deleteConfirmBtn = document.getElementById('delete-confirm');

//on and off delete menu
deleteToggleBtn.addEventListener('click', () => {
    //change value to opposite between true and fals.(on and off)
    isDeleteMode = !isDeleteMode;

    //ternary operator. if true call to on function. if falls call to off function
    isDeleteMode ? enterDeleteMode() : exitDeleteMode();
});

// delete function gent click the button
deleteConfirmBtn.addEventListener('click', () => {
    // if no items selectedIds, get out the function with out doing nothing
    if (selectedIds.size === 0) return;
    //alert for quantity confirmation 
    const ok = confirm(`Delete ${selectedIds.size} transaction(s)?`);
    // if false. get out without doing nothing
    if (!ok) return;


    // if true. call remove Expense function.
    for (const id of selectedIds) {
        removeExpense(id);
    }

    // get out and render the list again.
    exitDeleteMode();
    renderExpenses();
});

listelement.addEventListener('click', (e) => {
    // if click on checkbox
    if (e.target.matches('input.selector[type="checkbox"]')) {
        // look for closest list element
        const li = e.target.closest('li');
        // call to toggle function
        toggleSelection(li, e.target.checked);
        return;
    }

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
    toggleSelection(li, cb.checked);
});

function enterDeleteMode() {
    selectedIds.clear();
    updateConfirmLabel();
    deleteToggleBtn.textContent = 'Cancel delete';
    deleteConfirmBtn.hidden = false;
    deleteConfirmBtn.disabled = true;

    listelement.classList.add('delete-mode');

    const items = listelement.querySelectorAll('li');
    items.forEach((li) => {
        const id = li.dataset.id || li.id; 
        if (!id) return;


        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'selector';
        cb.title = 'Select to delete';
        li.prepend(cb);
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

function updateConfirmLabel() {
    const n = selectedIds.size;
    deleteConfirmBtn.textContent = `Delete selected (${n})`;
    deleteConfirmBtn.disabled = n === 0;
}
