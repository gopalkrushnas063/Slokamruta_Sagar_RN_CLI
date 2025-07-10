import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { darkTheme, gradientTheme } from '../styles/themes';
import { setLanguage } from '../store/slices/languageSlice';
import i18n from '../i18n';
import { TFunction } from 'i18next';

interface ThemeContextType {
  container: any;
  text: any;
  button: any;
  buttonText: any;
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
  t: TFunction;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const theme = currentTheme === 'dark' ? darkTheme : gradientTheme;
  
  // Sync Redux language with i18n
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // Sync i18n language changes back to Redux
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== currentLanguage) {
        dispatch(setLanguage(lng));
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [dispatch, currentLanguage]);

  const changeLanguage = (lng: string) => {
    dispatch(setLanguage(lng));
    i18n.changeLanguage(lng);
  };

  const contextValue = {
    ...theme,
    changeLanguage,
    currentLanguage,
    t: i18n.t.bind(i18n),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};