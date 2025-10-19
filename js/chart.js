document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const charts = document.querySelectorAll('.chart');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // initially remove all active classes
            tabs.forEach(t => t.classList.remove('active-tab', 'bg-purple-600', 'text-white', 'hover:bg-purple-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500'));
            tabs.forEach(t => t.classList.add('bg-gray-200', 'text-purple-600', 'hover:bg-gray-300', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500'));
            tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
            // add active classes to the clicked tab
            tab.classList.add('active-tab', 'bg-purple-600', 'text-white', 'hover:bg-purple-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500');
            tab.setAttribute('aria-selected', 'true');
            const targetId = `${tab.dataset.target}-container`;
            $(`.chart[id!="${targetId}"]`).fadeOut(300, () => {
                $(`#${targetId}`).fadeIn(300)
            })
        });
    });

    const expenses = loadExpenses();
    const makeArrGroupByCategory = (obj) => {
        const result = {};
        for (const expense of expenses) {
            if (result[expense.category]) {
                result[expense.category] += expense.amount;
            } else {
                result[expense.category] = expense.amount;
            }
        }
        return result;
    };

    const makeArrGroupByDate = (obj) => {
        const result = {};
        for (const expense of expenses) {
            if (result[expense.occurredAt]) {
                result[expense.occurredAt] += expense.amount;
            } else {
                result[expense.occurredAt] = expense.amount;
            }
        }
        return result;
    };

    const ctx = document.getElementById('pie-chart');
    const ctxLine = document.getElementById('line-chart');
    const data = makeArrGroupByCategory(expenses);
    const dataByDate = makeArrGroupByDate(expenses);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(data),
                backgroundColor: [
                    '#6B46C1', '#805AD5', '#9F7AEA', '#B794F4', '#D6BCFA', '#E9D8FD'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            }
        }
    });

    const dates = Object.keys(dataByDate).sort((a, b) => new Date(a) - new Date(b));
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Expenses by Date',
                data: dates.map(date => dataByDate[date]),
                fill: false,
                borderColor: '#6B46C1',
                backgroundColor: '#7b64b1ff',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            }
        }
    });
});