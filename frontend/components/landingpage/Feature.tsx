"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const Features = () => {
  const { currentTheme } = useTheme();

  const featuresList = [
    {
      icon: (props: { className?: string }) => (
        <i className={`pi pi-bolt ${props.className ?? ""}`} aria-hidden="true" />
      ),
      title: "Gestión Centralizada",
      description:
        "Administra todas tus empresas desde un solo panel de control unificado y potente.",
    },
    {
      icon: (props: { className?: string }) => (
        <i className={`pi pi-users ${props.className ?? ""}`} aria-hidden="true" />
      ),
      title: "Colaboración en Tiempo Real",
      description:
        "Equipos sincronizados, sin importar dónde estén, con herramientas de colaboración fluidas.",
    },
    {
      icon: (props: { className?: string }) => (
        <i className={`pi pi-shield ${props.className ?? ""}`} aria-hidden="true" />
      ),
      title: "Seguridad de Nivel Consorcio",
      description: "Protección robusta de datos y cumplimiento normativo para tu tranquilidad.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Todo lo que necesitas, en un solo lugar
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600 dark:text-white/70">
        Nuestra plataforma está diseñada para escalar contigo, desde la gestión de múltiples
        entidades hasta la automatización de procesos complejos.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {featuresList.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-lg"
          >
            <div
              className={`h-12 w-12 ${currentTheme.accentBg} mb-5 flex items-center justify-center rounded-lg`}
            >
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-white/70">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Features;
