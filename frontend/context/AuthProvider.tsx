"use client";
import React, { createContext, useState, useEffect } from "react";
import { setAccessToken, getAccessToken, clearAccessToken } from "../lib/auth";
import { apiFetch } from "../lib/api";
import type { AuthContextType, UserInfo } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setTokenState] = useState<string | null>(getAccessToken());
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const token = getAccessToken();
      console.log("token", token);

      // Si hay token, intentar obtener el usuario
      if (token) {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const d = await res.json();
          if (mounted) setUser(d);
          return; // Usuario obtenido exitosamente
        }
        // Si falla, apiFetch ya intentó refresh automáticamente
        // Si el refresh funcionó, intentar de nuevo
        const res2 = await apiFetch("/auth/me");
        if (res2.ok) {
          const d2 = await res2.json();
          if (mounted) setUser(d2);
        }
      } else {
        // No hay token en memoria, intentar refresh para restaurar sesión
        // apiFetch manejará el refresh automáticamente si hay cookie
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const d = await res.json();
          if (mounted) setUser(d);
        }
      }
    }

    void bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string, tenantId?: string) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, tenantId }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access_token) {
      setTokenState(data.access_token);
      setAccessToken(data.access_token);
      // immediately fetch the current user after successful login
      try {
        const me = await apiFetch("/auth/me");
        if (me.ok) {
          const u = await me.json();
          setUser(u);
        }
      } catch {
        // ignore — user will be fetched by bootstrap or refresh flow
      }

      return true;
    }

    return false;
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      clearAccessToken();
      setTokenState(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
