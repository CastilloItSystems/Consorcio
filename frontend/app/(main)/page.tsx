"use client";
import React from "react";
import Hero from "@/components/landingpage/Hero";
import { AnimatePresence, motion } from "framer-motion";
import Features from "@/components/landingpage/Feature";
import CTASection from "@/components/landingpage/CTASection";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeColor } from "@/lib/themes/types";

export default function Home() {
  const { themeColor, setThemeColor, toggleDarkMode, themeMode } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes: Array<{ color: ThemeColor; name: string }> = [
    { color: "purple", name: "Aurora (Purple)" },
    { color: "blue", name: "Tech (Blue)" },
    { color: "pink", name: "Creative (Pink)" },
    { color: "emerald", name: "Growth (Emerald)" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Contenedor del Hero (Centrado y con padding para navbar/footer) */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-32">
        {/* Selector de Temas */}
        <div className="fixed bottom-20 left-4 z-50">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mb-4 w-60 rounded-lg border border-gray-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-lg"
              >
                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-white/80">
                  Selector de Tema
                </p>
                <div className="flex flex-col gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.color}
                      onClick={() => {
                        setThemeColor(theme.color);
                        setIsOpen(false);
                      }}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        themeColor === theme.color
                          ? "bg-gray-200 font-medium text-gray-900 dark:bg-white/20 dark:text-white"
                          : "text-gray-600 hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10"
                      } flex items-center justify-between`}
                    >
                      <span>
                        <span
                          className={`mr-2 ${theme.color === "purple" ? "text-purple-400" : theme.color === "blue" ? "text-blue-400" : theme.color === "pink" ? "text-pink-400" : "text-emerald-400"}`}
                        >
                          ●
                        </span>
                        {theme.name}
                      </span>
                      {themeColor === theme.color && <span>✓</span>}
                    </button>
                  ))}
                  <div className="my-2 border-t border-gray-200 dark:border-white/10" />
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setIsOpen(false);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-white/70 dark:hover:bg-white/10"
                  >
                    <i className={`pi ${themeMode === "dark" ? "pi-sun" : "pi-moon"} mr-2`} />
                    {themeMode === "dark" ? "Modo Claro" : "Modo Oscuro"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 shadow-2xl dark:border-white/10 dark:bg-white/10 dark:text-white dark:backdrop-blur-lg"
            aria-label="Seleccionar tema"
          >
            <i className="pi pi-palette text-xl" />
          </motion.button>
        </div>

        <main className="relative z-10 pt-16 pb-16">
          {/* Sección Hero */}
          <section className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
            <Hero />
          </section>

          {/* Sección Features */}
          <section className="px-4 py-24">
            <Features />
          </section>

          {/* Sección CTA */}
          <section className="px-4 pt-16 pb-32">
            <CTASection />
          </section>
        </main>
      </div>
    </div>
  );
}
