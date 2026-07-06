"use client";

import * as React from "react";

type ButtonVariant = "primary" | "gradient" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

/**
 * Sistema de botones Plenvo:
 * - `gradient`: CTA principal (azul → verde), mismo gradiente que la landing
 * - `primary`:  sólido azul Plenvo (#1E3A8A) con buen contraste
 * - `secondary`: outline, texto azul
 * - `ghost`: textual, sin borde
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gradient:
    "text-white border-0 plenvo-gradient-bg shadow-plenvo-sm hover:shadow-plenvo-md hover:opacity-95 active:opacity-90 focus:ring-plenvo-blue-2",
  primary:
    "bg-plenvo-blue text-white border border-plenvo-blue hover:bg-[#172d6e] active:bg-[#11214f] focus:ring-plenvo-blue",
  secondary:
    "bg-white text-plenvo-blue border border-plenvo-gray-300 hover:bg-plenvo-gray-50 active:bg-plenvo-gray-100 focus:ring-plenvo-blue",
  ghost:
    "bg-transparent text-plenvo-gray hover:bg-plenvo-gray-100 active:bg-plenvo-gray-200 focus:ring-plenvo-blue",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      type = "button",
      ...rest
    },
    ref
  ) {
    const cls = [
      "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:cursor-not-allowed",
      "disabled:opacity-60 disabled:hover:opacity-60",
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return <button ref={ref} type={type} className={cls} {...rest} />;
  }
);
