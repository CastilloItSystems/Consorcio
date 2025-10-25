"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  console.log("Navbar user:", user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    // You might want to redirect the user to the login page after logout
    // router.push('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2">
            {/* <Rocket className="text-pink-400" size={24} /> */}
            <span className="text-xl font-bold text-white">Plataforma</span>
          </div>

          {/* Links de Navegación (Ocultos en móvil) */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#" className="text-white/80 transition-colors hover:text-white">
              Características
            </a>
            <a href="#" className="text-white/80 transition-colors hover:text-white">
              Precios
            </a>
            <a href="#" className="text-white/80 transition-colors hover:text-white">
              Nosotros
            </a>
          </div>

          {/* Botón de Acción y Menú de Usuario */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-200"
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
                      className="ring-opacity-5 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none"
                    >
                      <div className="py-1">
                        <div className="border-b border-gray-200 px-4 py-2">
                          <p className="text-sm text-gray-700">Signed in as</p>
                          <p className="truncate text-sm font-medium text-gray-900">
                            {user.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
                className="rounded-lg bg-white px-4 py-2 font-semibold text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Aquí podrías añadir un botón de menú hamburguesa para móviles */}
          <div className="md:hidden">{/* <button className="text-white p-2">Menu</button> */}</div>
        </div>
      </div>
    </nav>
  );
}
