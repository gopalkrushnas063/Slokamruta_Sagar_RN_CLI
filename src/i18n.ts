// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { store } from './store';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import or from './locales/or/translation.json';
import bn from './locales/bn/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  or: { translation: or },
  bn: { translation: bn },
};

// Initialize with language from Redux store
const initializeI18n = () => {
  const state = store.getState();
  const lng = state?.language?.currentLanguage || 'en';

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      supportedLngs: ['en', 'hi', 'or', 'bn'],
      interpolation: {
        escapeValue: false,
      },
    });

  // Sync language changes between i18n and Redux
  store.subscribe(() => {
    const newState = store.getState();
    if (newState.language.currentLanguage !== i18n.language) {
      i18n.changeLanguage(newState.language.currentLanguage);
    }
  });
};

initializeI18n();

export default i18n;