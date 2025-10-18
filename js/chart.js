document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const charts = document.querySelectorAll('.chart');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active-tab', 'bg-purple-600', 'text-white', 'hover:bg-purple-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500'));
            tabs.forEach(t => t.classList.add('bg-gray-200', 'text-purple-600', 'hover:bg-gray-300', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500'));
            tab.classList.add('active-tab', 'bg-purple-600', 'text-white', 'hover:bg-purple-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-purple-500');
            const targetId = `${tab.dataset.target}-container`;
            charts.forEach(chart => {
                chart.classList.add('hidden');
                chart.classList.remove('active-chart');
            });
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('active-chart');
        });
    });

    const expenses = loadExpenses();
    const makeArrGroupByCategory = (obj) => {
        result = {};
        for (const expense of expenses) {
            if (result[expense.category]) {
                result[expense.category] += expense.amount;
            } else {
                result[expense.category] = expense.amount;
            }
        }
        return result;
    }
    const makeArrGroupByDate = (obj) => {
        result = {};
        for (const expense of expenses) {
            if (result[expense.occurredAt]) {
                result[expense.occurredAt] += expense.amount;
            } else {
                result[expense.occurredAt] = expense.amount;
            }
        }
        return result;
    }

    const ctx = document.getElementById('pie-chart');
    const ctxLine = document.getElementById('line-chart');
    const data = makeArrGroupByCategory(expenses);
    const dataByDate = makeArrGroupByDate(expenses);
    console.log(dataByDate);
    console.log(data);
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(data),
                backgroundColor: [
                    '#6B46C1', // Deep Purple (Primary Accent)
                    '#805AD5', // Medium Purple
                    '#9F7AEA', // Light Purple
                    '#B794F4', // Soft Lavender
                    '#D6BCFA', // Pale Purple
                    '#E9D8FD', // Very Light Purple
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
    })
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: Object.keys(dataByDate),
            datasets: [{
                label: 'Expenses by Date',
                data: Object.values(dataByDate),
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
    })


});