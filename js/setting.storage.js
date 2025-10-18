const STORAGE_KEY = 'budget';

const loadBudgetSetting = () => {
    const budget = localStorage.getItem(STORAGE_KEY);
    return budget ? JSON.parse(budget) : {};
}

const saveBudgetSetting = (budget) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
}

window.loadBudgetSetting = loadBudgetSetting;
window.saveBudgetSetting = saveBudgetSetting;