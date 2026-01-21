import { Transaction } from './Transaction.js';

export class FinanceState {
    constructor(transactionsData = [], budgetLimit = 0) {
        this.transactions = transactionsData.map(t => new Transaction(t));
        this.budgetLimit = budgetLimit;
    }

    getTotalBalance() {
        return this.getTotalIncome() - this.getTotalExpense();
    }

    getTotalIncome() {
        return this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getTotalExpense() {
        return this.transactions
            .filter(t => t.isExpense())
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getBudgetUsagePercentage() {
        if (this.budgetLimit <= 0) return 0;
        const percentage = (this.getTotalExpense() / this.budgetLimit) * 100;
        return Math.min(percentage, 100);
    }

    getExpensesByCategory() {
        const categories = {};
        this.transactions
            .filter(t => t.isExpense())
            .forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            });
        return categories;
    }
}