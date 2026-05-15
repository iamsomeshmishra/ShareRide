import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeColors = typeof COLORS;

export const COLORS = {
  // Monochrome Base
  black: '#000000',
  white: '#FFFFFF',
  primary: '#000000',
  secondary: '#666666',
  
  // Gray Scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  mutedGray: '#F5F5F7',
  bodyGray: '#6B7280',
  hoverGray: '#F2F2F7',
  hoverLight: '#F9FAFB',
  chipGray: '#E5E7EB',
  
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFC107',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 64,
};

export const SIZES = {
  radius_sm: 8,
  radius_md: 12,
  radius_lg: 16,
  radius_pill: 999,
  font_h1: 52,
  font_h2: 36,
  font_h3: 32,
  font_h4: 24,
  font_h5: 20,
  font_body: 16,
  font_caption: 14,
  font_micro: 12,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

interface ThemeContextType {
  colors: ThemeColors;
  spacing: typeof SPACING;
  sizes: typeof SIZES;
  shadows: typeof SHADOWS;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: COLORS,
  spacing: SPACING,
  sizes: SIZES,
  shadows: SHADOWS,
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // In a real app, we would handle dark mode colors here
  const value = {
    colors: COLORS,
    spacing: SPACING,
    sizes: SIZES,
    shadows: SHADOWS,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
