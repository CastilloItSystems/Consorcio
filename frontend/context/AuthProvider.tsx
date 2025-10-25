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
      if (token) {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const d = await res.json();
          if (mounted) setUser(d);
        } else {
          // use apiFetch so base URL and headers are correct
          const refreshed = await apiFetch("/auth/refresh", {
            method: "POST",
            credentials: "include",
          });
          if (refreshed.ok) {
            const data = await refreshed.json();
            if (data.access_token) {
              setTokenState(data.access_token);
              setAccessToken(data.access_token);
              const r2 = await apiFetch("/auth/me");
              if (r2.ok) {
                const d2 = await r2.json();
                if (mounted) setUser(d2);
              }
            }
          }
        }
      } else {
        // try refresh via apiFetch (uses NEXT_PUBLIC_API_URL)
        const refreshed = await apiFetch("/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshed.ok) {
          const data = await refreshed.json();
          if (data.access_token) {
            setTokenState(data.access_token);
            setAccessToken(data.access_token);
            const r2 = await apiFetch("/auth/me");
            if (r2.ok) {
              const d2 = await r2.json();
              if (mounted) setUser(d2);
            }
          }
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
