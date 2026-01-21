import { STORAGE_KEYS } from '../config/settings.js';
import { StorageService } from '../services/StorageService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';
import { TableView } from '../views/TableView.js';
import { DashboardView } from '../views/DashboardView.js';
import { NotificationView } from '../views/NotificationView.js';
import { ModalView } from '../views/ModalView.js';
import { Validators } from '../utils/Validator.js';

let currentSort = { column: 'date', asc: false };

export function handlePrepareEdit(id) {
    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];
    const transaction = transactions.find(t => t.id === id);

    if (transaction) {
        ModalView.fillForm(transaction);
        ModalView.setEditMode(true, id);
        ModalView.show('addTransactionModal');
    }
}

function validateData(formData) {
    if (Validators.isEmpty(formData.name)) {
        NotificationView.show('Назва не може бути порожньою!', 'error');
        return false;
    }
    if (!Validators.isPositiveNumber(formData.amount)) {
        NotificationView.show('Введіть коректну суму!', 'error');
        return false;
    }
    if (!Validators.hasNoHtml(formData.name) || !Validators.hasNoHtml(formData.comment)) {
        NotificationView.show('Використання HTML-тегів заборонено!', 'error');
        return false;
    }
    return true;
}

export function handleEditTransaction(id, formData) {
    if (!validateData(formData)) return;

    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];
    const index = transactions.findIndex(t => t.id === id);

    if (index !== -1) {
        transactions[index] = {
            ...transactions[index],
            ...formData,
            amount: parseFloat(formData.amount)
        };
        StorageService.save(STORAGE_KEYS.TRANSACTIONS, transactions);
        updateAllViews(transactions);
        ModalView.hide('addTransactionModal');
        NotificationView.show('Запис оновлено успішно!', 'success');
    }
}

export function handleAddTransaction(formData) {
    if (!validateData(formData)) return;

    const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount)
    };

    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];
    transactions.push(newTransaction);
    StorageService.save(STORAGE_KEYS.TRANSACTIONS, transactions);
    updateAllViews(transactions);
    NotificationView.show('Транзакцію додано!', 'success');
}

export function handleDeleteTransaction(id) {
    if (!confirm("Ви впевнені?")) return;

    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];
    const filtered = transactions.filter(t => t.id !== id);

    StorageService.save(STORAGE_KEYS.TRANSACTIONS, filtered);
    updateAllViews(filtered);
}

export function handleSort(column) {
    if (currentSort.column === column) {
        currentSort.asc = !currentSort.asc;
    } else {
        currentSort.column = column;
        currentSort.asc = true;
    }

    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];
    const sorted = sortTransactions(transactions);
    TableView.render(sorted, handleDeleteTransaction);
}

export function handleFilterChange(filters) {
    const transactions = StorageService.load(STORAGE_KEYS.TRANSACTIONS) || [];

    const filtered = transactions.filter(t => {
        const searchMatch = t.name.toLowerCase().includes(filters.search.toLowerCase());
        const catMatch = filters.category === 'all' || t.category === filters.category;
        const typeMatch = filters.type === 'all' || t.type === filters.type;

        let dateMatch = true;
        if (filters.dateRange && filters.dateRange !== 'all') {
            const tDate = new Date(t.date);
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];

            if (filters.dateRange === 'today') {
                dateMatch = t.date === todayStr;
            } else if (filters.dateRange === 'month') {
                dateMatch = (tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear());
            } else if (filters.dateRange === 'year') {
                dateMatch = (tDate.getFullYear() === now.getFullYear());
            }
        }

        return searchMatch && catMatch && typeMatch && dateMatch;
    });

    const sorted = sortTransactions(filtered);
    TableView.render(sorted, handleDeleteTransaction);
}

function sortTransactions(data) {
    return [...data].sort((a, b) => {
        let valA = a[currentSort.column];
        let valB = b[currentSort.column];

        if (typeof valA === 'string') {
            return currentSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return currentSort.asc ? valA - valB : valB - valA;
    });
}

function updateAllViews(transactions) {
    const summary = AnalyticsService.getSummary(transactions);
    const budgetLimit = StorageService.load(STORAGE_KEYS.BUDGET_LIMIT) || 0;

    DashboardView.updateSummary(summary);
    DashboardView.updateBudget(budgetLimit, summary.expenses);

    const sorted = sortTransactions(transactions);
    TableView.render(sorted, handleDeleteTransaction);
}