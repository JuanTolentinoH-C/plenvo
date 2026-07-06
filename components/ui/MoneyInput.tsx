"use client";

import * as React from "react";
import { Field } from "./Field";

type MoneyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "prefix"
> & {
  label: string;
  hint?: string;
  error?: string;
};

/**
 * Input monetario con prefijo "S/" visible, optimizado para teclado móvil
 * (inputMode="decimal"). Hereda el lenguaje visual de Plenvo.
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  function MoneyInput(
    { label, hint, error, required, id, className, ...rest },
    ref
  ) {
    const inputId = id ?? React.useId();
    const wrapperState = error
      ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
      : "border-plenvo-gray-300 hover:border-plenvo-gray-500/50 focus-within:border-plenvo-blue focus-within:ring-plenvo-blue/15";
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <div
          className={`flex items-stretch rounded-2xl border bg-white overflow-hidden transition-colors focus-within:ring-4 ${wrapperState}`}
        >
          <span
            className="flex items-center px-3 text-sm font-semibold text-plenvo-gray bg-plenvo-gray-50 border-r border-plenvo-gray-300 select-none"
            aria-hidden="true"
          >
            S/
          </span>
          <input
            ref={ref}
            id={inputId}
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            aria-invalid={!!error}
            className={`flex-1 min-h-[48px] px-4 text-base text-plenvo-gray placeholder:text-plenvo-gray-500/70 focus:outline-none ${className ?? ""}`}
            {...rest}
          />
        </div>
      </Field>
    );
  }
);

export { MoneyInput };
export type { MoneyInputProps };
