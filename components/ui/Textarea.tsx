"use client";

import * as React from "react";
import { Field } from "./Field";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

const baseClasses =
  "block w-full min-h-[120px] rounded-2xl border border-plenvo-gray-300 bg-white px-4 py-3 text-base text-plenvo-gray placeholder:text-plenvo-gray-500/70 transition-colors focus:outline-none focus:ring-4 focus:border-plenvo-blue focus:ring-plenvo-blue/15 hover:border-plenvo-gray-500/50 resize-y leading-relaxed disabled:opacity-60 disabled:bg-plenvo-gray-50";

const errorClasses = "border-red-400 focus:border-red-500 focus:ring-red-100";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, required, id, className, ...rest },
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
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={[baseClasses, error ? errorClasses : "", className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
      </Field>
    );
  }
);
