"use client";
import React, { useState } from "react";
// import Link from "next/link";
import Hero from "@/components/landingpage/Hero";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const themes = {
    default: {
      name: "Aurora (Default)",
      accentClass: "text-pink-400",
      accentBg: "bg-pink-500", // Color de fondo para botones
      aurora: true,
    },
    consorcio: {
      name: "Consorcio (Admin)",
      accentClass: "text-purple-400",
      accentBg: "bg-purple-500",
      aurora: false,
    },
    empresa1: {
      name: "Empresa 1 (Tech)",
      accentClass: "text-blue-400",
      accentBg: "bg-blue-500",
      aurora: false,
    },
    empresa2: {
      name: "Empresa 2 (Creativa)",
      accentClass: "text-pink-400",
      accentBg: "bg-pink-500",
      aurora: false,
    },
    empresa3: {
      name: "Empresa 3 (Crecimiento)",
      accentClass: "text-emerald-400",
      accentBg: "bg-emerald-500",
      aurora: false,
    },
  };
  function ThemeSwitcher({
    currentThemeKey,
    setTheme,
  }: {
    currentThemeKey: keyof typeof themes;
    setTheme: (theme: keyof typeof themes) => void;
  }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="fixed bottom-20 left-4 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-4 w-60 rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-lg"
            >
              <p className="mb-3 text-sm font-semibold text-white/80">Selector de Tema</p>
              <div className="flex flex-col gap-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key as keyof typeof themes);
                      setIsOpen(false);
                    }}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      currentThemeKey === key
                        ? "bg-white/20 font-medium text-white"
                        : "text-white/70 hover:bg-white/10"
                    } flex items-center justify-between`}
                  >
                    <span>
                      <span className={`${theme.accentClass} mr-2`}>●</span>
                      {theme.name}
                    </span>
                    {currentThemeKey === key && <span>✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-lg"
          aria-label="Seleccionar tema"
        >
          {/* <Paintbrush size={24} /> */}
          <i className="pi pi-palette text-xl" />
        </motion.button>
      </div>
    );
  }

  const [themeKey, setThemeKey] = useState<keyof typeof themes>("default");
  const currentTheme = themes[themeKey];
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      {/* Contenedor del Hero (Centrado y con padding para navbar/footer) */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-32">
        {/* Componente Hero (reemplaza el login) */}
        {/* Selector de Temas */}
        <ThemeSwitcher currentThemeKey={themeKey} setTheme={setThemeKey} />
        <Hero theme={currentTheme} />
      </div>
    </div>
  );
}
