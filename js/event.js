document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    renderExpenses();
    form.addEventListener('submit', (e) => {
        e.preventDefault();



        const expense = {};
        expense.id = crypto.randomUUID();
        expense.createdAt = new Date().toISOString();
        // expense.name = document.getElementById('name').value;
        expense.type = document.getElementById('type').value;
        expense.category = document.getElementById('category').value;
        expense.amount = parseFloat(document.getElementById('amount').value);
        expense.note = document.getElementById('note').value;
        expense.occurredAt = document.getElementById('location').value;

        if (addExpense(expense)) {
            form.reset();
            renderExpenses();
        } else {
            alert('Failed to add expense. Please try again.');
        }
    });
});

