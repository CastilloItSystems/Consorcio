"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

interface Company {
  id: string;
  name: string;
  description: string | null;
  themeColor: string;
  themeName: string;
}

export default function CompanyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Obtener datos de la company
    const fetchCompany = async () => {
      try {
        // TODO: Implementar endpoint GET /api/companies/:id
        const mockCompanies: Record<string, Company> = {
          "1": {
            id: "1",
            name: "Empresa A",
            description: "Tecnología y desarrollo de software",
            themeColor: "blue",
            themeName: "Tech",
          },
          "2": {
            id: "2",
            name: "Empresa B",
            description: "Consultoría empresarial",
            themeColor: "pink",
            themeName: "Creative",
          },
          "3": {
            id: "3",
            name: "Consorcio Principal",
            description: "Gestión de consorcios",
            themeColor: "purple",
            themeName: "Aurora",
          },
        };

        const companyData = mockCompanies[companyId];
        if (companyData) {
          setCompany(companyData);
        } else {
          router.push("/app");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        router.push("/app");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user, router, companyId]);

  if (!user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const apps = [
    {
      id: "facturacion",
      name: "Facturación",
      description: "Gestión de facturas y pagos",
      icon: "pi-file-edit",
      color: "blue",
    },
    {
      id: "inventario",
      name: "Inventario",
      description: "Control de stock y productos",
      icon: "pi-box",
      color: "emerald",
    },
    {
      id: "reportes",
      name: "Reportes",
      description: "Informes y análisis",
      icon: "pi-chart-bar",
      color: "purple",
    },
    {
      id: "usuarios",
      name: "Usuarios",
      description: "Gestión de usuarios y permisos",
      icon: "pi-users",
      color: "pink",
    },
    {
      id: "configuracion",
      name: "Configuración",
      description: "Ajustes de la empresa",
      icon: "pi-cog",
      color: "gray",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header con breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/app")}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <i className="pi pi-arrow-left"></i>
            Volver a empresas
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-lg ${
                company.themeColor === "purple"
                  ? "bg-purple-500"
                  : company.themeColor === "blue"
                    ? "bg-blue-500"
                    : company.themeColor === "pink"
                      ? "bg-pink-500"
                      : "bg-emerald-500"
              } text-2xl font-bold text-white`}
            >
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
              {company.description && (
                <p className="text-gray-600 dark:text-gray-400">{company.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Aplicaciones</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => router.push(`/app/company/${companyId}/${app.id}`)}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      app.color === "blue"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : app.color === "emerald"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : app.color === "purple"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                            : app.color === "pink"
                              ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    <i className={`pi ${app.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.description}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm font-medium text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-purple-600 dark:text-gray-400 dark:group-hover:text-purple-400">
                  Abrir
                  <i className="pi pi-arrow-right ml-2 text-xs"></i>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
