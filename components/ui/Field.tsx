"use client";

import * as React from "react";

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
};

/**
 * Wrapper de campo de formulario con jerarquía tipográfica Plenvo:
 * - Label en gris oscuro con semi-bold
 * - Requerido: asterisco en azul (no rojo) — menos agresivo, mejor contraste
 * - Errores: línea base + mensaje con ícono, role="alert"
 * - Hint: gris medio
 */
export function Field({ label, hint, error, required, children, htmlFor }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-plenvo-gray"
      >
        {label}
        {required ? (
          <span className="text-plenvo-blue-2 ml-0.5" aria-hidden="true">*</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="flex items-start gap-1.5 text-sm text-red-600" role="alert">
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v6m0 3.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-xs text-plenvo-gray-500 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}
