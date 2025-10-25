import Link from "next/link";
import React from "react";

export default function AppCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 mb-4">{description}</p>
      {href ? (
        <Link href={href} className="text-sm text-blue-600">
          Abrir
        </Link>
      ) : (
        <span className="text-sm text-zinc-400">No disponible</span>
      )}
    </div>
  );
}
