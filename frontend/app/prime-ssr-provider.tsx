"use client";
import { PrimeReactProvider, PrimeReactStyleSheet } from "@primereact/core";
import { useServerInsertedHTML } from "next/navigation";
import * as React from "react";
import Aura from "@primeuix/themes/aura";
import { useTheme } from "@/hooks/useTheme";

const styledStyleSheet = new PrimeReactStyleSheet();

export default function PrimeSSRProvider({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  // Conectar con nuestro sistema de temas
  const { themeColor } = useTheme();

  useServerInsertedHTML(() => {
    const styleElements = styledStyleSheet.getAllElements();

    styledStyleSheet.clear();

    return <>{styleElements}</>;
  });

  // Configurar PrimeReact con el tema actual
  const primereact = React.useMemo(
    () => ({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark", // Usar el mismo selector que nuestro sistema
          cssLayer: {
            name: "primereact",
            order: "theme, base, primereact",
          },
          // Personalizar colores según el tema activo
          primary: getThemePrimaryColor(themeColor),
        },
      },
    }),
    [themeColor],
  );

  return (
    <PrimeReactProvider {...primereact} stylesheet={styledStyleSheet}>
      {children}
    </PrimeReactProvider>
  );
}

// Helper para obtener el color primario según el tema
function getThemePrimaryColor(color: string) {
  const colorMap: Record<string, string> = {
    purple: "#a855f7", // purple-500
    blue: "#3b82f6", // blue-500
    pink: "#ec4899", // pink-500
    emerald: "#10b981", // emerald-500
  };
  return colorMap[color] || colorMap.purple;
}
