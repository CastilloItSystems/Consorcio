"use client";
import React from "react";
import LoginPage2 from "@/components/login-versions/LoginPage2";

// Clean, minimal login page that delegates to the chosen login component.
// If later you want to switch versions, replace <LoginPage2 /> with
// <HybridLoginPage /> or another implementation.
export default function LoginPage() {
  return <LoginPage2 />;
}
