"use client";

import * as React from "react";
import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  name: keyof PlanForm;
  legend: string;
  options: readonly string[];
  columns?: 1 | 2;
  required?: boolean;
  /** Validación extra para RHF (e.g. mínimo 1 seleccionado). */
  rules?: RegisterOptions<PlanForm, keyof PlanForm>;
  hint?: string;
};

/**
 * Group de checkboxes premium:
 * - Fieldset con legend estilizado (label + asterisco azul + hint opcional)
 * - Tarjetas seleccionables (border Plenvo, hover, focus, estado checked con gradiente)
 * - Errores con el mismo lenguaje visual que Field
 */
export function CheckboxGroupField({
  name,
  legend,
  options,
  columns = 2,
  required,
  rules,
  hint,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<PlanForm>();

  const error = errors[name]?.message as string | undefined;
  const errorId = `${String(name)}-error`;
  const hintId = `${String(name)}-hint`;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const value = (field.value ?? []) as string[];
        return (
          <fieldset className="flex flex-col gap-2">
            <legend
              className="text-sm font-semibold text-plenvo-gray"
              id={`${String(name)}-legend`}
            >
              {legend}
              {required ? (
                <span className="text-plenvo-blue-2 ml-0.5" aria-hidden="true">
                  *
                </span>
              ) : null}
            </legend>

            {hint ? (
              <p className="text-xs text-plenvo-gray-500" id={hintId}>
                {hint}
              </p>
            ) : null}

            <div
              role="group"
              aria-labelledby={`${String(name)}-legend`}
              aria-describedby={
                error ? errorId : hint ? hintId : undefined
              }
              className={`grid gap-2 ${
                columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {options.map((option) => {
                const checked = value.includes(option);
                const id = `${String(name)}-${option.replace(/\s+/g, "-")}`;
                return (
                  <label
                    key={option}
                    htmlFor={id}
                    className={`group flex items-center gap-3 min-h-[48px] px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${
                      checked
                        ? "border-plenvo-blue bg-plenvo-blue/5 shadow-plenvo-xs"
                        : "border-plenvo-gray-300 bg-white hover:border-plenvo-gray-500/60 hover:bg-plenvo-gray-50"
                    }`}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      value={option}
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...value, option]);
                        } else {
                          field.onChange(value.filter((v) => v !== option));
                        }
                      }}
                      aria-invalid={!!error}
                      className="sr-only peer"
                    />
                    <span
                      aria-hidden="true"
                      className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        checked
                          ? "plenvo-gradient-bg border-transparent"
                          : "border-plenvo-gray-300 bg-white group-hover:border-plenvo-gray-500/60"
                      }`}
                    >
                      {checked ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path
                            d="m5 12 4 4L19 6"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <span className="text-sm text-plenvo-gray leading-snug">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>

            {error ? (
              <p
                id={errorId}
                role="alert"
                className="flex items-start gap-1.5 text-sm text-red-600"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 7v6m0 3.5v.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{error}</span>
              </p>
            ) : null}
          </fieldset>
        );
      }}
    />
  );
}
