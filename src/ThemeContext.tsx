/**
 * Theme Context and Provider
 * Manages theme switching across the app
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { themes, ThemeMode, ThemeColors } from './theme/themes';
import { useSettingsStore } from './stores';

interface ThemeContextValue {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.light,
  themeMode: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeMode, setThemeMode } = useSettingsStore();

  const theme = useMemo(() => themes[themeMode], [themeMode]);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      setTheme: setThemeMode,
    }),
    [theme, themeMode, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
