import React from "react";

export default function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-white/5 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Copyright */}
          <span className="text-sm text-white/50">
            © {new Date().getFullYear()} Plataforma. Todos los derechos reservados.
          </span>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-white/50 transition-colors hover:text-white">
              {/* <Github size={20} /> */}
            </a>
            <a href="#" className="text-white/50 transition-colors hover:text-white">
              {/* <Twitter size={20} /> */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
