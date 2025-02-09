export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  error: string;
  success: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  darkMode: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
