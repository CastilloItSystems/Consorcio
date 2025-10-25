"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "../../lib/schemas/auth";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Label } from "primereact/label";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import handleError from "@/lib/errorHandler";
import { motion } from "framer-motion";

// Componente de fondo animado (Aurora)
function AuroraBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="animate-pulse-slow-1 absolute top-0 left-0 h-[50vh] w-[50vw] bg-purple-600 opacity-30 blur-[150px] filter"></div>
      <div className="animate-pulse-slow-2 absolute top-1/2 left-1/4 h-[50vh] w-[50vw] bg-blue-500 opacity-30 blur-[150px] filter"></div>
      <div className="animate-pulse-slow-3 absolute right-0 bottom-0 h-[50vh] w-[50vw] bg-pink-500 opacity-30 blur-[150px] filter"></div>
    </div>
  );
}

const LoginPage2 = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const ok = await login(data.email, data.password, data.tenantId || undefined);
      setLoading(false);

      if (ok) {
        await Swal.fire({
          icon: "success",
          title: "Signed in",
          showConfirmButton: false,
          timer: 1200,
        });
        router.push("/"); // ajustar ruta según app
      } else {
        setError("Invalid credentials");
        Swal.fire({
          icon: "error",
          title: "Invalid credentials",
          text: "Please check your email and password.",
        });
      }
    } catch (err: unknown) {
      setLoading(false);
      handleError(err); // middleware / logging centralizado
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Fondo de Aurora */}
      <AuroraBackground />

      {/* Tarjeta de Login (Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <h2 className="mb-4 text-center text-3xl font-bold text-white">Acceso Exclusivo</h2>
        <p className="mb-8 text-center text-white/70">Bienvenido de nuevo a la plataforma.</p>

        <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de Email */}
          <div className="relative">
            <i
              className="pi pi-envelope absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} /> */}
            {/* <InputText
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              aria-label="Correo Electrónico"
              required
              // className="w-full rounded-lg border border-transparent bg-white/5 py-3 pr-4 pl-11 transition-all outline-none placeholder:text-white/40 focus:border-white/50 focus:bg-white/10 focus:ring-0"
            /> */}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Label.Float>
                  <InputText
                    id="email"
                    type="email"
                    value={field.value}
                    onInput={(e: React.FormEvent<HTMLInputElement>) =>
                      field.onChange(e.currentTarget.value)
                    }
                    className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
                  />
                  <Label className="pl-11" htmlFor="username">
                    Correo electrónico
                  </Label>
                </Label.Float>
              )}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Campo de Contraseña */}
          <div className="relative">
            <i
              className="pi pi-lock absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} /> */}
            {/* <InputText
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              aria-label="Contraseña"
              required
              // className="w-full rounded-lg border border-transparent bg-white/5 py-3 pr-4 pl-11 transition-all outline-none placeholder:text-white/40 focus:border-white/50 focus:bg-white/10 focus:ring-0"
            /> */}
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Label.Float>
                  <InputText
                    id="password"
                    type="password"
                    // placeholder="••••••••"
                    className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
                    value={field.value ?? ""}
                    onInput={(e: React.FormEvent<HTMLInputElement>) =>
                      field.onChange(e.currentTarget.value)
                    }
                    onBlur={field.onBlur}
                  />
                  <Label className="pl-11" htmlFor="password">
                    Contraseña
                  </Label>
                </Label.Float>
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="relative">
            <i
              className="pi pi-building absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <Controller
              control={control}
              name="tenantId"
              render={({ field }) => (
                <Label.Float>
                  <InputText
                    id="tenantId"
                    type="text"
                    className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none"
                    value={field.value ?? ""}
                    onInput={(e: React.FormEvent<HTMLInputElement>) =>
                      field.onChange(e.currentTarget.value)
                    }
                    onBlur={field.onBlur}
                  />
                  <Label className="pl-11" htmlFor="tenantId">
                    Tenant ID (optional)
                  </Label>
                </Label.Float>
              )}
            />
            {errors.tenantId && (
              <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
            )}
            {/* Mensaje de Error */}
            {error && (
              <div role="alert" className="text-center text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Botón de Submit */}
          <Button
            type="submit"
            className="mr-2 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <i className="pi pi-spinner animate-spin" aria-hidden />
            ) : (
              <i className="pi pi-sign-in" aria-hidden />
            )}
            <span>{loading ? "Verificando..." : "Ingresar"}</span>
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          ¿No tienes cuenta?{" "}
          <a href="#" className="font-medium text-white hover:underline">
            Regístrate
          </a>
        </p>
      </motion.div>
    </div>
  );
};
export default LoginPage2;
