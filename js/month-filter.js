document.addEventListener('DOMContentLoaded', () => {
    const monthDropdownContent = document.getElementById('month-dropdown-content');
    const selectedMonthText = document.getElementById('selected-month-text');
    const monthDropdownToggle = document.getElementById('month-dropdown-toggle');
    const expenseList = document.getElementById('expense-list');

    let pieChartInstance;
    let lineChartInstance;

    // to convert numbers into real months
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // function to get the month name and year from an ISO date string
    const getMonthYear = (dateString) => {
        const date = new Date(dateString);
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    // function to get existing chart instances from their canvas elements
    const getChartInstances = () => {
        const pieCtx = document.getElementById('pie-chart');
        const lineCtx = document.getElementById('line-chart');
        if (pieCtx) {
            pieChartInstance = Chart.getChart(pieCtx);
        }
        if (lineCtx) {
            lineChartInstance = Chart.getChart(lineCtx);
        }
    };

    // dropdown population
    function populateMonthDropdown() {
        const expenses = loadExpenses();
        // use a Set to store unique "Month Year" strings
        const uniqueMonths = new Set();
        expenses.forEach(expense => {
            // "occurredAt" is the date input field value (YYYY-MM-DD)
            uniqueMonths.add(getMonthYear(expense.occurredAt));
        });

        // clear existing months, keeping "All Months"
        monthDropdownContent.innerHTML = '<li class="month-link px-4 py-2 hover:bg-purple-100 cursor-pointer text-gray-700" data-month="all">All Months</li>';

        // add unique months to the dropdown
        Array.from(uniqueMonths).sort((a, b) => new Date(a) - new Date(b)).forEach(monthYear => {
            const listItem = document.createElement('li');
            listItem.className = 'month-link px-4 py-2 hover:bg-purple-100 cursor-pointer text-gray-700';
            listItem.dataset.month = monthYear; // store "Month Year" as the filter value
            listItem.textContent = monthYear;
            monthDropdownContent.appendChild(listItem);
        });

        attachMonthFilterListeners();
    }

    function filterByMonth(selectedMonth) {
        getChartInstances(); // get chart instances before filtering

        const allExpenses = loadExpenses();
        let filteredExpenses = allExpenses;

        if (selectedMonth !== 'all') {
            filteredExpenses = allExpenses.filter(expense => {
                return getMonthYear(expense.occurredAt) === selectedMonth;
            });
        }

        // update List
        if (window.renderExpenses) {
            window.renderExpenses(filteredExpenses);
        }
        if (pieChartInstance && lineChartInstance) {
            updateCharts(filteredExpenses);
        }

        // update Dropdown text
        selectedMonthText.textContent = selectedMonth === 'all' ? 'All Months' : selectedMonth;
    }

    function updateCharts(filteredExpenses) {
        // logic to group expenses by category for Pie Chart
        const dataByCategory = filteredExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        // logic to group expenses by date for Line Chart
        const dataByDate = filteredExpenses.reduce((acc, expense) => {
            acc[expense.occurredAt] = (acc[expense.occurredAt] || 0) + expense.amount;
            return acc;
        }, {});
        const dates = Object.keys(dataByDate).sort((a, b) => new Date(a) - new Date(b));

        // update pie chart
        pieChartInstance.data.labels = Object.keys(dataByCategory);
        pieChartInstance.data.datasets[0].data = Object.values(dataByCategory);
        pieChartInstance.update();

        // update line chart
        lineChartInstance.data.labels = dates;
        lineChartInstance.data.datasets[0].data = dates.map(date => dataByDate[date]);
        lineChartInstance.update();
    }


    monthDropdownToggle.addEventListener('click', () => {
        monthDropdownContent.classList.toggle('hidden');
        monthDropdownToggle.setAttribute('aria-expanded', monthDropdownContent.classList.contains('hidden') ? 'false' : 'true');
    });

    function attachMonthFilterListeners() {
        document.querySelectorAll('#month-dropdown-content .month-link').forEach(link => {
            link.addEventListener('click', (event) => {
                const selectedMonth = event.target.dataset.month;
                filterByMonth(selectedMonth);
                monthDropdownContent.classList.add('hidden');
                monthDropdownToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // initialize dropdown and filter on load
    populateMonthDropdown();
    filterByMonth('all'); // initial filter to show all months

    // re-populate and filter when a new expense is added (e.g., in event.js, after addExpense)
    window.addEventListener('expenseAddedOrRemoved', () => {
        populateMonthDropdown();
        // re-apply current filter to show new data for the selected month
        const currentFilter = selectedMonthText.textContent === 'All Months' ? 'all' : selectedMonthText.textContent;
        filterByMonth(currentFilter);
    });
});