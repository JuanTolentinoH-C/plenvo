"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import type { PlanForm } from "@/lib/schemas";

type StepShellProps = {
  stepIndex: number;
  title: string;
  /** Eyebrow sobre el título (ej: "Paso 1 · Datos generales"). */
  eyebrow?: string;
  description?: string;
  fields: ReadonlyArray<keyof PlanForm>;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext?: boolean;
  /** Si es true, oculta los botones Anterior/Siguiente (útil para el último
   *  paso que tiene su propio CTA de "Generar documento"). */
  hideFooter?: boolean;
  /** CTA principal custom (string) — si pasás esto, se usa como label del botón "Siguiente". */
  nextLabel?: string;
  children: React.ReactNode;
};

/**
 * Shell premium para los 6 pasos del wizard.
 * - Card blanco con borde, sombra y radio 16px
 * - Eyebrow azul semi-bold + título grande + descripción
 * - Footer con botones:
 *      • "Anterior"  → outline (secondary)
 *      • "Siguiente" → gradient (azul → verde), mismo CTA que la landing
 */
export function StepShell({
  stepIndex,
  title,
  eyebrow,
  description,
  fields,
  onNext,
  onPrev,
  canGoNext,
  hideFooter,
  nextLabel = "Siguiente →",
  children,
}: StepShellProps) {
  const { trigger, formState } = useFormContext<PlanForm>();
  const [submitting, setSubmitting] = React.useState(false);

  const handleNext = async () => {
    setSubmitting(true);
    const ok = await trigger(
      fields as unknown as Parameters<typeof trigger>[0],
      { shouldFocus: true }
    );
    setSubmitting(false);
    if (ok) onNext?.();
  };

  const errorCount =
    formState.errors ? Object.keys(formState.errors).length : 0;
  const showErrors = errorCount > 0;

  return (
    <section className="flex flex-col gap-7">
      <header className="flex flex-col gap-2">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wider text-plenvo-blue-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-plenvo-gray">
          {title}
        </h1>
        {description ? (
          <p className="text-sm sm:text-base text-plenvo-gray-500 leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-5">{children}</div>

      {hideFooter ? null : (
        <>
          <footer className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-6 border-t border-plenvo-gray-300">
            <Button
              variant="secondary"
              size="md"
              onClick={onPrev}
              disabled={stepIndex === 0}
              fullWidth
              className="sm:w-auto"
            >
              ← Anterior
            </Button>

            <Button
              variant="gradient"
              size="md"
              onClick={handleNext}
              disabled={submitting || canGoNext === false}
              fullWidth
              className="sm:w-auto"
            >
              {submitting ? "Validando…" : nextLabel}
            </Button>
          </footer>

          {showErrors ? (
            <p
              role="status"
              className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 flex items-center gap-2"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 7v6m0 3.5v.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                Revisa{" "}
                <strong>
                  {errorCount === 1 ? "el campo marcado" : `los ${errorCount} campos marcados`}
                </strong>{" "}
                antes de continuar.
              </span>
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
