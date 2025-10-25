"use client";
import React from "react";
import AppCard from "../../components/AppCard";
import { useAuth } from "../../hooks/useAuth";

const MOCK_APPS = [
  {
    id: "1",
    title: "Factura",
    description: "Gestiona facturas y pagos",
    href: "/apps/factura",
  },
  {
    id: "2",
    title: "Inventario",
    description: "Control de stock y productos",
    href: "/apps/inventario",
  },
  {
    id: "3",
    title: "Reportes",
    description: "Informes y métricas",
    href: "/apps/reportes",
  },
];

export default function AppsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-8 bg-zinc-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Aplicaciones</h1>
        {!user && (
          <div className="mb-4 text-zinc-700">
            Debes{" "}
            <a href="/login" className="text-blue-600">
              iniciar sesión
            </a>{" "}
            para ver y abrir las aplicaciones.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_APPS.map((a) => (
            <AppCard
              key={a.id}
              title={a.title}
              description={a.description}
              href={user ? a.href : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
