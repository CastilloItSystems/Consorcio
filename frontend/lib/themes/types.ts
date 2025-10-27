// Tipos para el sistema de temas
export type ThemeColor = "purple" | "blue" | "pink" | "emerald";
export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  name: string;
  color: ThemeColor;
  accentClass: string;
  accentBg: string;
  primaryColor: string;
  secondaryColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface CompanyTheme {
  themeColor: ThemeColor;
  themeName: string;
  darkModeDefault: boolean;
}

export interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  companyTheme: CompanyTheme | null;
  setThemeColor: (color: ThemeColor) => void;
  toggleDarkMode: () => void;
  setCompanyTheme: (theme: CompanyTheme) => void;
}
