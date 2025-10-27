"use client";
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import type {
  ThemeColor,
  ThemeMode,
  ThemeConfig,
  CompanyTheme,
  ThemeContextType,
} from "@/lib/themes/types";
import { getThemeConfig, getThemeClassName } from "@/lib/themes/themeConfig";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app-theme-color";
const DARK_MODE_STORAGE_KEY = "app-dark-mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initialization - solo se ejecuta una vez, no causa re-renders
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    if (typeof window === "undefined") return "purple";
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeColor | null;
      return saved && ["purple", "blue", "pink", "emerald"].includes(saved) ? saved : "purple";
    } catch {
      return "purple";
    }
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const savedDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (savedDarkMode !== null) {
        return savedDarkMode === "true" ? "dark" : "light";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const [companyTheme, setCompanyThemeState] = useState<CompanyTheme | null>(null);

  // Aplicar tema al DOM cuando cambie
  useEffect(() => {
    const root = document.documentElement;
    const themeClass = getThemeClassName(themeColor, themeMode === "dark");

    // Remover todas las clases de tema previas
    root.classList.remove("theme-purple", "theme-blue", "theme-pink", "theme-emerald", "dark");

    // Aplicar nuevas clases
    const classes = themeClass.split(" ").filter(Boolean);
    root.classList.add(...classes);

    // Guardar en localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeColor);
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(themeMode === "dark"));
  }, [themeColor, themeMode]);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setCompanyTheme = useCallback((theme: CompanyTheme) => {
    setCompanyThemeState(theme);
    // Aplicar tema de la company inmediatamente
    setThemeColorState(theme.themeColor);
    setThemeMode(theme.darkModeDefault ? "dark" : "light");
  }, []);

  const currentTheme: ThemeConfig = useMemo(() => getThemeConfig(themeColor), [themeColor]);

  const value: ThemeContextType = useMemo(
    () => ({
      currentTheme,
      themeColor,
      themeMode,
      companyTheme,
      setThemeColor,
      toggleDarkMode,
      setCompanyTheme,
    }),
    [
      currentTheme,
      themeColor,
      themeMode,
      companyTheme,
      setThemeColor,
      toggleDarkMode,
      setCompanyTheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
