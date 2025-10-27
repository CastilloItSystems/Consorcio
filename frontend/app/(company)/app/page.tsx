"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface Company {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  themeColor: string;
  themeName: string;
}

export default function AppPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Obtener companies del usuario desde sus memberships
    const fetchCompanies = async () => {
      try {
        // TODO: Implementar endpoint GET /api/users/me/companies
        // Por ahora usamos datos mock basados en el user
        const mockCompanies: Company[] = [
          {
            id: "1",
            name: "Empresa A",
            description: "Tecnología y desarrollo de software",
            logoUrl: null,
            themeColor: "blue",
            themeName: "Tech",
          },
          {
            id: "2",
            name: "Empresa B",
            description: "Consultoría empresarial",
            logoUrl: null,
            themeColor: "pink",
            themeName: "Creative",
          },
          {
            id: "3",
            name: "Consorcio Principal",
            description: "Gestión de consorcios",
            logoUrl: null,
            themeColor: "purple",
            themeName: "Aurora",
          },
        ];

        setCompanies(mockCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user, router]);

  const handleSelectCompany = (companyId: string) => {
    router.push(`/app/company/${companyId}`);
  };

  if (!user) {
    return null; // Redirigiendo...
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Selecciona una Empresa
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Elige la empresa con la que deseas trabajar
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSelectCompany(company.id)}
              className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Logo o Inicial */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  company.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Company Info */}
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {company.name}
              </h3>
              {company.description && (
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {company.description}
                </p>
              )}

              {/* Theme Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    company.themeColor === "purple"
                      ? "bg-purple-500"
                      : company.themeColor === "blue"
                        ? "bg-blue-500"
                        : company.themeColor === "pink"
                          ? "bg-pink-500"
                          : "bg-emerald-500"
                  }`}
                ></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tema: {company.themeName}
                </span>
              </div>

              {/* Arrow Icon */}
              <div className="mt-4 flex items-center text-sm font-medium text-purple-600 transition-all group-hover:translate-x-1 dark:text-purple-400">
                Abrir empresa
                <i className="pi pi-arrow-right ml-2 text-xs"></i>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {companies.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <i className="pi pi-building mb-4 text-4xl text-gray-400"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No tienes empresas asignadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contacta a tu administrador para que te agregue a una empresa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
