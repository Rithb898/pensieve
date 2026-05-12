import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { colors } from '../theme/colors';

type ThemeType = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof colors.light;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme();
  const [themeOverride, setThemeOverride] = useState<ThemeType | null>(null);

  const theme = themeOverride || (deviceTheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setThemeOverride(isDark ? 'light' : 'dark');
  };

  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
