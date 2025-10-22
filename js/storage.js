/**
 * @typeof {Object} Expense
 * @property {string} id - Unique identifier for the expense
 * @property {string} name - name ofthe expense. company or some id.
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

const updateExpense = (id, updates) => {
    const expenses = loadExpenses();
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return false;

    expenses[idx] = {
        ...expenses[idx],
        ...updates,
        id: expenses[idx].id,
        createdAt: expenses[idx].createdAt,
    };

    localStorage.setItem('expenses', JSON.stringify(expenses));
    return true;
}



// Functions are now available globally
window.addExpense = addExpense;
window.loadExpenses = loadExpenses;
window.removeExpense = removeExpense;
window.updateExpense = updateExpense;