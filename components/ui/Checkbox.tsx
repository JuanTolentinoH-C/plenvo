"use client";

import * as React from "react";

type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value"
> & {
  label: string;
  value: string;
};

const baseClasses =
  "h-5 w-5 rounded-md border-plenvo-gray-300 text-plenvo-blue-2 focus:ring-2 focus:ring-plenvo-blue/30 cursor-pointer accent-plenvo-blue";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, value, id, className, ...rest }, ref) {
    const inputId = id ?? React.useId();
    return (
      <label
        htmlFor={inputId}
        className="flex items-center gap-3 min-h-[44px] px-2 rounded-md cursor-pointer hover:bg-plenvo-gray-50 transition-colors"
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          value={value}
          className={[baseClasses, className].filter(Boolean).join(" ")}
          {...rest}
        />
        <span className="text-sm text-plenvo-gray">{label}</span>
      </label>
    );
  }
);
