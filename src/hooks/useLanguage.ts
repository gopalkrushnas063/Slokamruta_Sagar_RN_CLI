// src/hooks/useLanguage.ts
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { setLanguage } from '../store/slices/languageSlice';

export const useLanguage = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  const changeLanguage = (languageCode: string) => {
    dispatch(setLanguage(languageCode));
    i18n.changeLanguage(languageCode);
  };

  const isRTL = () => {
    // Add RTL language codes here if needed
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(currentLanguage);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isRTL,
    i18n,
  };
};

// src/utils/languageUtils.ts
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', icon: '🇬🇧', countryCode: 'En' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', icon: '🇮🇳', countryCode: 'Hi' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', icon: '🇮🇳', countryCode: 'Od' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', icon: '🇧🇩', countryCode: 'Bn' },
];

export const getLanguageByCode = (code: string) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

export const getLanguageName = (code: string, useNative: boolean = false) => {
  const language = getLanguageByCode(code);
  return useNative ? language.nativeName : language.name;
};

export const isLanguageSupported = (code: string) => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};