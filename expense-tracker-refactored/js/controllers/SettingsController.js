import { STORAGE_KEYS, APP_SETTINGS } from '../config/settings.js';
import { StorageService } from '../services/StorageService.js';
import { SettingsView } from '../views/SettingsView.js';
import { NotificationView } from '../views/NotificationView.js';

export const SettingsController = {

    handleThemeChange(theme) {
        const settings = StorageService.load(STORAGE_KEYS.SETTINGS) || { ...APP_SETTINGS };
        settings.theme = theme;
        StorageService.save(STORAGE_KEYS.SETTINGS, settings);
        SettingsView.applyTheme(theme);
        NotificationView.show(`Застосовано ${theme === 'dark' ? 'темну' : 'світлу'} тему`);
    },

    handleCurrencyChange(currency) {
        const settings = StorageService.load(STORAGE_KEYS.SETTINGS) || { ...APP_SETTINGS };
        settings.currency = currency;
        StorageService.save(STORAGE_KEYS.SETTINGS, settings);
        SettingsView.updateCurrencySymbols(currency);
    }
};