"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

// --- Componente CTA Section ---
const CTASection = () => {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center shadow-2xl dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-xl"
    >
      <h2 className={`mb-4 text-4xl font-bold ${currentTheme.accentClass}`}>
        ¿Listo para transformar tu consorcio?
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-white/70">
        Únete a las empresas líderes que ya están optimizando su futuro con Plataforma. Inicia tu
        prueba gratuita hoy mismo.
      </p>
      <a
        href="#"
        className={`inline-flex items-center gap-2 px-8 py-3 ${currentTheme.accentBg} group rounded-lg text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-80`}
      >
        <span>Empezar Ahora</span>
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>
          <i className="pi pi-arrow-right" />
        </span>
      </a>
    </motion.div>
  );
};
export default CTASection;
