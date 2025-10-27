"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { themeMode, toggleDarkMode } = useTheme();
  console.log("Navbar user:", user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    // You might want to redirect the user to the login page after logout
    // router.push('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2">
            {/* <Rocket className="text-pink-400" size={24} /> */}
            <span className="text-xl font-bold text-gray-900 dark:text-white">Plataforma</span>
          </div>

          {/* Links de Navegación (Ocultos en móvil) */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!user && (
              <>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-white/80 dark:hover:text-white"
                >
                  Características
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-white/80 dark:hover:text-white"
                >
                  Precios
                </a>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-white/80 dark:hover:text-white"
                >
                  Nosotros
                </a>
              </>
            )}

            {user && (
              <Link
                href="/app"
                className="text-gray-600 transition-colors hover:text-gray-900 dark:text-white/80 dark:hover:text-white"
              >
                App
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20 dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {themeMode === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Botón de Acción y Menú de Usuario */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-200 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <span>{user.user.email}</span>
                  {/* Icono de flecha */}
                  <svg
                    className={`h-5 w-5 transform transition-transform ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800 dark:ring-white/10"
                    >
                      <div className="py-1">
                        <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Signed in as</p>
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {user.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Aquí podrías añadir un botón de menú hamburguesa para móviles */}
          <div className="md:hidden">
            {/* <button className="text-gray-900 dark:text-white p-2">Menu</button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
