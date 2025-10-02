import React, { createContext, useState, useMemo } from 'react';
import { themes } from './themes';

export const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: (themeName: string) => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const toggleTheme = (name: string) => {
    setThemeName(name);
  };

  const theme = useMemo(() => themes[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
