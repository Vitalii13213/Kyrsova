import { DateFormatter } from '../utils/DateFormatter.js';
import { Helpers } from '../utils/Helpers.js';
import * as TransactionController from '../controllers/TransactionController.js';

export const TableView = {
    render(transactions, onDeleteCallback) {
        const container = document.getElementById('transactions-list');
        container.innerHTML = '';

        if (transactions.length === 0) {
            container.innerHTML = '<tr><td colspan="5" style="text-align:center">Дані відсутні</td></tr>';
            return;
        }

        transactions.forEach(t => {
            const row = document.createElement('tr');
            const isIncome = t.type === 'income';

            row.innerHTML = `
                <td>${DateFormatter.toUkrainianFormat(t.date)}</td>
                <td><strong>${t.name}</strong>${t.comment ? `<br><small>${t.comment}</small>` : ''}</td>
                <td><span class="tag">${t.category}</span></td>
                <td style="color: ${isIncome ? 'green' : 'red'}; font-weight: bold">
                    ${isIncome ? '+' : '-'}${Helpers.formatCurrency(t.amount)}
                </td>
                <td class="actions-cell">
                    <button class="btn-edit" data-id="${t.id}">Редагувати</button>
                    <button class="btn-delete" data-id="${t.id}">Видалити</button>
                </td>
            `;

            row.querySelector('.btn-edit').onclick = () => TransactionController.handlePrepareEdit(t.id);
            row.querySelector('.btn-delete').onclick = () => onDeleteCallback(t.id);

            container.appendChild(row);
        });
    }
};