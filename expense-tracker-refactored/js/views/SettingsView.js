export const SettingsView = {

    applyTheme(theme) {
        const wrapper = document.querySelector('.app-wrapper');
        const sidebar = document.querySelector('.app-sidebar');

        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    updateCurrencySymbols(currency) {
        const symbol = currency === 'UAH' ? 'грн' : '$';
        document.querySelectorAll('.currency-symbol').forEach(el => {
            el.innerText = symbol;
        });
    }
};