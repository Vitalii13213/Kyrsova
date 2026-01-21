export const ExportService = {
    exportToCSV(transactions) {
        if (!transactions || transactions.length === 0) {
            throw new Error("Немає даних для експорту");
        }

        const headers = ['ID', 'Назва', 'Сума', 'Тип', 'Категорія', 'Дата', 'Коментар'];
        const csvContent = [
            '\uFEFF' + headers.join(','),
            ...transactions.map(t => [
                t.id,
                `"${t.name}"`,
                t.amount,
                t.type,
                t.category,
                t.date,
                `"${t.comment || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};