"use client";

import * as React from "react";
import { Field } from "./Field";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

const baseClasses =
  "block w-full min-h-[48px] rounded-2xl border bg-white px-4 text-base text-plenvo-gray placeholder:text-plenvo-gray-500/70 transition-colors focus:outline-none focus:ring-4 disabled:opacity-60 disabled:bg-plenvo-gray-50";

const stateClasses = (hasError: boolean) =>
  hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-plenvo-gray-300 hover:border-plenvo-gray-500/50 focus:border-plenvo-blue focus:ring-plenvo-blue/15";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, hint, error, required, id, className, wrapperClassName, ...rest },
    ref
  ) {
    const inputId = id ?? React.useId();
    return (
      <Field
        label={label}
        hint={hint}
        error={error}
        required={required}
        htmlFor={inputId}
      >
        <div className={wrapperClassName}>
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={[baseClasses, stateClasses(!!error), className]
              .filter(Boolean)
              .join(" ")}
            {...rest}
          />
        </div>
      </Field>
    );
  }
);
