"use client";

import * as React from "react";
import { Field } from "./Field";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  options: readonly string[];
  placeholder?: string;
};

const baseClasses =
  "block w-full min-h-[48px] rounded-2xl border bg-white pl-4 pr-10 text-base text-plenvo-gray transition-colors focus:outline-none focus:ring-4 appearance-none cursor-pointer disabled:opacity-60 disabled:bg-plenvo-gray-50";

const stateClasses = (hasError: boolean) =>
  hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-plenvo-gray-300 hover:border-plenvo-gray-500/50 focus:border-plenvo-blue focus:ring-plenvo-blue/15";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      required,
      id,
      className,
      options,
      placeholder = "Selecciona una opción",
      ...rest
    },
    ref
  ) {
    const selectId = id ?? React.useId();
    return (
      <Field
        label={label}
        hint={hint}
        error={error}
        required={required}
        htmlFor={selectId}
      >
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={[baseClasses, stateClasses(!!error), className]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-plenvo-gray-500"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Field>
    );
  }
);
