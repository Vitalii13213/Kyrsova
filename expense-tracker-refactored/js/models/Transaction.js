export class Transaction {
    constructor({ id, name, amount, type, category, date, comment = "" }) {
        this.id = id || Date.now() + Math.random();
        this.name = name;
        this.amount = parseFloat(amount);
        this.type = type;
        this.category = category;
        this.date = date;
        this.comment = comment;
    }

    isExpense() {
        return this.type === 'expense';
    }

    getFormattedAmount() {
        const prefix = this.isExpense() ? '-' : '+';
        return `${prefix}${this.amount.toFixed(2)} грн`;
    }
}