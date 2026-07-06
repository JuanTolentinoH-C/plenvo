"use client";

import { STEP_TITLES } from "@/lib/schemas";

type ProgressBarProps = {
  currentStep: number; // 0-based
  unlockedCount?: number; // pasos habilitados en este sprint
};

/**
 * Barra de progreso premium para los 6 pasos del wizard.
 *
 * Estados visuales:
 * - Done:        círculo + check + label en verde, conector con gradiente
 *                azul→verde representando "trayecto completado"
 * - Active:      círculo con gradiente azul→verde + label azul semibold
 *                + sombra glow
 * - Pending:     círculo + label gris claro
 * - Locked:      círculo + label gris, opacidad reducida
 */
export function ProgressBar({ currentStep, unlockedCount = 6 }: ProgressBarProps) {
  return (
    <nav aria-label="Pasos del plan" className="w-full">
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {STEP_TITLES.map((title, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          const isLocked = idx >= unlockedCount;

          const circleBase =
            "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm font-bold transition-all shrink-0";

          const circle = isLocked
            ? `${circleBase} bg-plenvo-gray-100 text-plenvo-gray-500/50 border border-plenvo-gray-300`
            : isDone
            ? `${circleBase} plenvo-gradient-bg text-white shadow-plenvo-sm`
            : isActive
            ? `${circleBase} plenvo-gradient-bg text-white shadow-plenvo-glow ring-4 ring-plenvo-blue/15`
            : `${circleBase} bg-white text-plenvo-gray-500 border border-plenvo-gray-300`;

          const label = isLocked
            ? "text-plenvo-gray-500/50"
            : isActive
            ? "text-plenvo-blue font-bold"
            : isDone
            ? "text-plenvo-green font-semibold"
            : "text-plenvo-gray-500";

          const wrapper = isLocked ? "opacity-70 cursor-not-allowed" : "";

          return (
            <li
              key={title}
              className={`flex-1 min-w-[56px] flex flex-col items-center gap-2 ${wrapper}`}
              title={isLocked ? "Disponible más adelante" : undefined}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="flex items-center w-full">
                {/* Conector izquierdo (excepto en el primero) */}
                {idx > 0 ? (
                  <div
                    aria-hidden="true"
                    className={`flex-1 h-1 -mx-2 rounded-full transition-colors ${
                      isDone || isActive
                        ? "plenvo-gradient-bg"
                        : "bg-plenvo-gray-300"
                    }`}
                  />
                ) : null}

                <span className={circle}>
                  {isDone ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </span>

                {/* Conector derecho (excepto en el último) */}
                {idx < STEP_TITLES.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className={`flex-1 h-1 -mx-2 rounded-full transition-colors ${
                      isDone ? "plenvo-gradient-bg" : "bg-plenvo-gray-300"
                    }`}
                  />
                ) : null}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] text-center leading-tight max-w-[80px] ${label}`}
              >
                {title}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Indicador textual grande "Paso X de 6" */}
      <p
        aria-live="polite"
        className="mt-5 text-center text-xs sm:text-sm font-medium text-plenvo-gray-500"
      >
        Paso{" "}
        <span className="font-bold text-plenvo-blue">
          {Math.min(currentStep + 1, STEP_TITLES.length)}
        </span>{" "}
        de{" "}
        <span className="font-bold text-plenvo-gray">{STEP_TITLES.length}</span>
      </p>
    </nav>
  );
}
