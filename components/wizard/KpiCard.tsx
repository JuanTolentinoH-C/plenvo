"use client";

import * as React from "react";

type KpiCardProps = {
  label: string;
  value: React.ReactNode;
  /** Pequeño texto debajo del número, ej: "(51.1%)". */
  hint?: React.ReactNode;
  /** Variante visual: neutro (azul) o destacado (verde, ej: punto de equilibrio). */
  tone?: "neutral" | "highlight";
  icon?: React.ReactNode;
};

/**
 * Tarjeta KPI premium para mostrar un número calculado en vivo.
 *
 * Resistente al overflow:
 * - Padding compacto en mobile para dejar más ancho al número
 * - Etiqueta truncada con ellipsis si es muy larga
 * - Número con `text-[clamp()]` que escala según el ancho disponible
 * - `min-w-0` y `break-words` en todas las capas para que el grid lo respete
 * - En mobile (`<sm`) la etiqueta y el número comparten una sola línea
 */
export function KpiCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: KpiCardProps) {
  const isHighlight = tone === "highlight";
  return (
    <div
      className={`relative rounded-2xl border p-3.5 sm:p-5 transition-all min-w-0 ${
        isHighlight
          ? "border-plenvo-green/40 plenvo-gradient-soft-bg shadow-plenvo-xs"
          : "border-plenvo-gray-300 bg-white shadow-plenvo-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-plenvo-gray-500 truncate min-w-0 flex-1">
          {label}
        </p>
        {icon ? (
          <span
            aria-hidden="true"
            className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center ${
              isHighlight
                ? "bg-white/70 text-plenvo-green"
                : "bg-plenvo-gray-100 text-plenvo-blue"
            }`}
          >
            {icon}
          </span>
        ) : null}
      </div>

      {/*
        Tamaño de fuente fluido (clamp):
          - Mínimo 1.125rem (18px) en mobile (apenas espacio)
          - Ideal 1.875rem (30px) en desktop
          - Máximo 2.25rem (36px) en pantallas amplias
        `tabular-nums` mantiene alineación de dígitos en todos los tamaños.
        `break-all` permite cortar si el monto es muy largo en pantallas chicas.
      */}
      <p
        className={`mt-2 font-bold tabular-nums tracking-tight leading-none ${
          isHighlight ? "text-plenvo-green" : "text-plenvo-gray"
        } text-[clamp(1.125rem,1.125rem+1.5cqw,2.25rem)] sm:text-2xl lg:text-3xl break-all min-w-0`}
        style={{ containerType: "inline-size" }}
      >
        {value}
      </p>

      {hint ? (
        <p className="mt-1.5 text-[11px] sm:text-xs text-plenvo-gray-500 leading-snug">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
