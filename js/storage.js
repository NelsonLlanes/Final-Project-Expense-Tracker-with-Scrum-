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

function editStorage() {

    // declare modal of new expense formulari
    const modal = document.getElementById('modal-add-transaction');
    //true?
    if (isEditMode) {
        addEventListener("click", (e) => {
            //click on the expense
            const li = (e).target.closest("li");
            if (!li) return;

            if (isEditMode) {
                // save the id of li
                const id = li.dataset.id || li.id;
                if (!id) return;

                editingId = id;

                // find by a property method 
                const expense = loadExpenses().find((item) => item.id === id);

                if (!expense) return;
                //reset form
                document.getElementById("expense-form").reset();


                //assing values to the input
                document.getElementById("occurred-at").value = expense.createdAt
                document.getElementById("transaction-name").value = expense.name
                document.getElementById("amount").value = expense.amount
                document.getElementById("note").value = expense.note
                document.getElementById("category").value = expense.category
                document.getElementById("occurred-at").value = expense.occurredAt

                // open modal with load informacion
                modal.classList.remove('hidden');

                return
            }
        })
    };
}



// Functions are now available globally
window.addExpense = addExpense;
window.loadExpenses = loadExpenses;
window.removeExpense = removeExpense;