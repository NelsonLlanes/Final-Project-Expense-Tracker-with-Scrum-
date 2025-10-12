document.addEventListener('DOMContentLoaded', () => {
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
        } else {
            alert('Failed to add expense. Please try again.');
        }
    });
});