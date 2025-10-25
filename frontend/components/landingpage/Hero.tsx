import { motion } from "framer-motion";

interface HeroProps {
  theme: {
    accentClass: string;
    accentBg: string;
  };
}

// --- Componente Hero (NUEVO) ---
const Hero = ({ theme }: HeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      className="relative z-10 mx-auto max-w-3xl text-center"
    >
      <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
        Transforma tu Flujo de Trabajo con <span className={theme.accentClass}>Plataforma</span>
      </h1>

      <p className="mx-auto mb-10 max-w-2xl text-xl text-white/70">
        La solución definitiva para consorcios y empresas que buscan optimizar la gestión, la
        innovación y el crecimiento en un solo lugar.
      </p>

      <div className="flex items-center justify-center gap-4">
        {/* Botón Primario (usa el color de acento del tema) */}
        <a
          href="#"
          className={`flex items-center gap-2 px-6 py-3 ${theme.accentBg} group rounded-lg font-semibold text-white shadow-lg transition-all duration-300 hover:opacity-80`}
        >
          <span>Empezar Ahora</span>
          <i className="pi pi-arrow-right transition-transform group-hover:translate-x-1" />{" "}
        </a>

        {/* Botón Secundario (estilo glassmorphism) */}
        <a
          href="#"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-6 py-3 font-semibold text-white shadow-md backdrop-blur-lg transition-all duration-300 hover:bg-white/20"
        >
          <i className="pi pi-book" />
          <span>Leer Documentación</span>
        </a>
      </div>
    </motion.div>
  );
};
export default Hero;
