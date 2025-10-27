"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redireccionar si no hay usuario
  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "pi-home",
      href: "/app",
      active: pathname === "/app",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Consorcio</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>

            {/* Sidebar Content */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <i className={`pi ${item.icon}`}></i>
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

              {/* User Info */}
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Sesión iniciada como
                </p>
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {user.user.email}
                </p>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-200 bg-white lg:hidden dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Sidebar Header */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Consorcio</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <i className="pi pi-times"></i>
                </button>
              </div>

              {/* Sidebar Content */}
              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <i className={`pi ${item.icon}`}></i>
                    {item.label}
                  </Link>
                ))}

                <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Sesión iniciada como
                  </p>
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.user.email}
                  </p>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            {/* Toggle Sidebar Button - Desktop */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:block dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <i className="pi pi-bars text-lg"></i>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <i className="pi pi-bars text-lg"></i>
            </button>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
          </div>

          {/* User Menu / Actions */}
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <i className="pi pi-bell"></i>
            </button>
            <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <i className="pi pi-cog"></i>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
