import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { darkTheme, gradientTheme } from '../styles/themes';
import i18n from '../i18n';

interface ThemeContextType {
  container: any;
  text: any;
  button: any;
  buttonText: any;
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const theme = currentTheme === 'dark' ? darkTheme : gradientTheme;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const contextValue = {
    ...theme,
    changeLanguage,
    currentLanguage: i18n.language
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