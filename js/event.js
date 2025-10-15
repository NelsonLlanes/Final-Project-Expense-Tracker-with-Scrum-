document.addEventListener('DOMContentLoaded', () => {
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
        expense.name = document.getElementById('name').value;
        expense.amount = parseFloat(document.getElementById('amount').value);
        expense.note = document.getElementById('note').value;
        expense.category = document.getElementById('category').value;
        expense.occurredAt = document.getElementById('occurred-at').value;
        
        if (addExpense(expense)) {
            form.reset();
            alert('Expense added successfully!');
            document.getElementById('modal-add-transaction').classList.add('hidden'); // For closing the modal when something is added
        } else {
            alert('Failed to add expense. Please try again.');
        }
    });
});

