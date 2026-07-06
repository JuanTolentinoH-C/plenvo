"use client";

import * as React from "react";

type SectionProps = {
  title: string;
  description?: string;
  /** Contenido derecho: tipicamente un total monetario grande. */
  total?: React.ReactNode;
  totalLabel?: string;
  children: React.ReactNode;
};

/**
 * Bloque visual agrupador con título, descripción opcional y un "total"
 * destacado a la derecha (usado en Step 4 y 6 para mostrar sumas en vivo).
 * - Card premium: rounded-2xl, border, shadow
 * - Total en color azul Plenvo, fuente grande y tabular-nums
 */
export function Section({ title, description, total, totalLabel, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-plenvo-gray-300 bg-white p-5 sm:p-6 shadow-plenvo-xs">
      <header className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-plenvo-gray">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-xs text-plenvo-gray-500 leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        {total !== undefined ? (
          <div className="text-right shrink-0">
            {totalLabel ? (
              <p className="text-[10px] uppercase tracking-wider text-plenvo-gray-500 font-bold">
                {totalLabel}
              </p>
            ) : null}
            <p className="text-xl sm:text-2xl font-bold text-plenvo-blue tabular-nums leading-tight">
              {total}
            </p>
          </div>
        ) : null}
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}
