import React from "react";

export default function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Copyright */}
          <span className="text-sm text-gray-500 dark:text-white/50">
            © {new Date().getFullYear()} Plataforma. Todos los derechos reservados.
          </span>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-500 transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white"
            >
              {/* <Github size={20} /> */}
            </a>
            <a
              href="#"
              className="text-gray-500 transition-colors hover:text-gray-900 dark:text-white/50 dark:hover:text-white"
            >
              {/* <Twitter size={20} /> */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
