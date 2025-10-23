document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector(".dropdown-content");
    const links = document.querySelectorAll(".category-link");

    const filterTransactions = (selectedCategory, selectedLabel) => {
        const selectedFilter = document.querySelector(".dropbtn");
        if (selectedFilter) {
            if (selectedCategory === 'all') {
                selectedFilter.textContent = 'Filter ▼';
            } else {
                selectedFilter.textContent = `Filtering: ${selectedLabel} ▼`;
            }
        }

        window.expenseFilterState = window.expenseFilterState ?? { month: 'all', category: 'all' };
        window.expenseFilterState.category = selectedCategory;

        if (typeof window.applyExpenseFilters === 'function') {
            window.applyExpenseFilters();
        } else {
            const allExpenses = loadExpenses();
            const filteredExpenses = selectedCategory === 'all'
                ? allExpenses
                : allExpenses.filter(expense => expense.category === selectedCategory);

            if (window.renderExpenses) {
                window.renderExpenses(filteredExpenses);
            }

            if (typeof window.updateCharts === 'function') {
                window.updateCharts(filteredExpenses);
            }
        }

        if (content) {
            content.classList.remove('show');
        }
    };

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedCategory = link.getAttribute('href').substring(1);
            const selectedLabel = link.textContent.trim();
            filterTransactions(selectedCategory, selectedLabel);
        });
    });
});
