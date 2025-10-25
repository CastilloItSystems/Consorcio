"use client";
import React, { useState } from "react";
import { apiFetch } from "../../lib/api";
import { clearAccessToken } from "../../lib/auth";

export default function TestRefreshPage() {
  const [log, setLog] = useState<string[]>([]);

  const add = (s: string) => setLog((l) => [s, ...l]);

  const handleClear = () => {
    clearAccessToken();
    add("Access token cleared from memory");
  };

  const callProtected = async () => {
    add("Calling /auth/protected...");
    try {
      const res = await apiFetch("/auth/protected");
      const text = await res.text();
      add(`Status: ${res.status} - ${text}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : String(err);
      add("Request failed: " + msg);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">Test Refresh Flow</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={handleClear} className="px-4 py-2 bg-yellow-400">
          Clear token
        </button>
        <button
          onClick={callProtected}
          className="px-4 py-2 bg-blue-600 text-white"
        >
          Call protected
        </button>
      </div>
      <div className="bg-black/5 p-4 rounded">
        <h2 className="font-medium mb-2">Log</h2>
        <ul>
          {log.map((l, i) => (
            <li key={i} className="text-sm">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
