const BUDGET_STORAGE_KEY = 'budget';

const loadBudgetSetting = () => {
    const budget = localStorage.getItem(BUDGET_STORAGE_KEY);
    return budget ? JSON.parse(budget) : {};
}

const saveBudgetSetting = (budget) => {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget));
}

window.loadBudgetSetting = loadBudgetSetting;
window.saveBudgetSetting = saveBudgetSetting;