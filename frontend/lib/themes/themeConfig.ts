import type { ThemeColor, ThemeConfig } from "./types";

// Configuración de todos los temas disponibles
export const themeConfigs: Record<ThemeColor, ThemeConfig> = {
  purple: {
    name: "Aurora",
    color: "purple",
    accentClass: "text-purple-400",
    accentBg: "bg-purple-500",
    primaryColor: "#a855f7", // purple-500
    secondaryColor: "#9333ea", // purple-600
    gradientFrom: "#a855f7",
    gradientTo: "#ec4899", // pink-500
  },
  blue: {
    name: "Tech",
    color: "blue",
    accentClass: "text-blue-400",
    accentBg: "bg-blue-500",
    primaryColor: "#3b82f6", // blue-500
    secondaryColor: "#2563eb", // blue-600
    gradientFrom: "#3b82f6",
    gradientTo: "#06b6d4", // cyan-500
  },
  pink: {
    name: "Creative",
    color: "pink",
    accentClass: "text-pink-400",
    accentBg: "bg-pink-500",
    primaryColor: "#ec4899", // pink-500
    secondaryColor: "#db2777", // pink-600
    gradientFrom: "#ec4899",
    gradientTo: "#f97316", // orange-500
  },
  emerald: {
    name: "Growth",
    color: "emerald",
    accentClass: "text-emerald-400",
    accentBg: "bg-emerald-500",
    primaryColor: "#10b981", // emerald-500
    secondaryColor: "#059669", // emerald-600
    gradientFrom: "#10b981",
    gradientTo: "#14b8a6", // teal-500
  },
};

// Función helper para obtener configuración de tema
export function getThemeConfig(color: ThemeColor): ThemeConfig {
  return themeConfigs[color];
}

// Clase CSS para aplicar al elemento raíz
export function getThemeClassName(color: ThemeColor, isDark: boolean): string {
  const darkClass = isDark ? "dark" : "";
  const themeClass = `theme-${color}`;
  return `${themeClass} ${darkClass}`.trim();
}
