document.addEventListener('DOMContentLoaded', () => {
    const categories = ['Supermarket', 'Food', 'Transport', 'Transfer', 'Others']; // Example categories
    const categoryList = document.getElementById('category-list');

    const icons = {
        'supermarket': 'fa-store',
        'food': 'fa-utensils',
        'transport': 'fa-train-subway',
        'transfer': 'fa-money-bill-transfer',
        'others': 'fa-ellipsis'
    };

    categories.forEach(category => {
        const categoryLower = category.toLocaleLowerCase();
        const row = document.createElement('div');
        row.classList.add('flex', 'items-center', 'justify-between', 'mb-4');

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', icons[categoryLower], 'text-purple-600', 'mr-2');

        const label = document.createElement('span');
        label.textContent = category;
        label.classList.add('text-gray-700', 'font-medium', 'flex', 'items-center');

        // create input element
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Set budget';
        input.classList.add('border', 'border-gray-300', 'rounded-md', 'shadow-sm', 'focus:ring-purple-500', 'focus:border-purple-500', 'w-1/2', 'p-2');
        input.min = '0';
        // load existing budget setting
        input.value = loadBudgetSetting()[categoryLower] || 0;

        const labelContainer = document.createElement('div');
        labelContainer.classList.add('flex', 'items-center');
        labelContainer.appendChild(icon);
        labelContainer.appendChild(label);

        row.appendChild(labelContainer);
        row.appendChild(input);
        categoryList.appendChild(row);
    });

    const form = document.getElementById('budget-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const budgets = {};
        const inputs = categoryList.querySelectorAll('input');
        categories.forEach((category, index) => {
            budgets[category.toLocaleLowerCase()] = inputs[index].value;
        });
        // Save the budget settings
        saveBudgetSetting(budgets);
        alert('Budgets saved successfully!');
    });
});
