"use client";

/**
 * Panel premium de "Documento listo" — se muestra DENTRO del Paso 6
 * (porque Step6 usa hideFooter). Inspirado en el DocumentMockup del hero
 * de la landing: estilo SaaS, banda superior con semáforo, contenido
 * realista del .docx, footer con paginación.
 *
 * Ofrece dos opciones al usuario:
 *  - "Descargar plan gratuito" (isPro: false, marca de agua)
 *  - "Obtener Plan Pro" → abre checkout de Mercado Pago
 */
export function DocumentoListo({
  nombreNegocio,
  isGenerating,
  onGenerate,
  onUpgrade,
  isUpgrading,
  upgradeError,
  downloadError,
  proPrice,
}: {
  nombreNegocio?: string;
  isGenerating: boolean;
  onGenerate: () => void | Promise<void>;
  onUpgrade?: () => void | Promise<void>;
  isUpgrading?: boolean;
  upgradeError?: string | null;
  downloadError?: string | null;
  proPrice?: number;
}) {
  const safeName = (nombreNegocio ?? "mi-negocio")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "plenvo";

  const priceLabel =
    typeof proPrice === "number" && Number.isFinite(proPrice) && proPrice > 0
      ? `S/${proPrice.toFixed(0)}`
      : "S/19";

  return (
    <div className="flex flex-col gap-5">
      {/* Eyebrow + título */}
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plenvo-gray-100 text-plenvo-blue text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full plenvo-gradient-bg" />
          Paso final
        </span>
        <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-plenvo-gray">
          Tu documento profesional está listo para descargar
        </h2>
        <p className="mt-1.5 text-sm text-plenvo-gray-500 leading-relaxed">
          Haz clic en el botón para generar y descargar el .docx.
        </p>
      </div>

      {/* Mockup del documento */}
      <div className="relative rounded-2xl bg-white shadow-plenvo-xl border border-plenvo-gray-300 overflow-hidden">
        {/* Page chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-plenvo-gray-300 bg-plenvo-gray-50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-[11px] text-plenvo-gray-500 font-medium">
            Plan_de_Negocio_{safeName}.docx
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-plenvo-green font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-plenvo-green animate-pulse-slow" />
            Listo para generar
          </span>
        </div>

        {/* Contenido del documento */}
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-plenvo-blue font-bold">
                PLAN DE NEGOCIO
              </p>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-plenvo-gray tracking-tight">
                {nombreNegocio || "Tu negocio"}
              </h3>
              <p className="mt-1 text-xs text-plenvo-gray-500">
                Generado por Plenvo · 12 secciones · Gráficos y tablas
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-plenvo-gray-500">
                Formato
              </span>
              <span className="text-xs font-bold text-plenvo-blue">
                .docx · Word
              </span>
            </div>
          </div>

          {/* Mini TOC */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "Resumen ejecutivo",
              "Mercado",
              "Costos",
              "Inversión",
              "P. equilibrio",
              "Flujo 12m",
              "Financiamiento",
              "Anexos",
            ].map((t, i) => (
              <div
                key={t}
                className="rounded-lg border border-plenvo-gray-300 px-2.5 py-2"
              >
                <p className="text-[9px] uppercase tracking-wider text-plenvo-gray-500 font-bold">
                  0{i + 1}
                </p>
                <p className="mt-0.5 text-xs text-plenvo-gray font-medium truncate">
                  {t}
                </p>
              </div>
            ))}
          </div>

          {/* Indicadores destacados (estilo "Inversión inicial" del hero) */}
          <div className="mt-5 rounded-xl plenvo-gradient-soft-bg border border-plenvo-blue/20 p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-plenvo-blue-2 font-bold">
                Inversión total
              </p>
              <p className="text-lg sm:text-xl font-bold text-plenvo-blue">
                Listo para calcularse
              </p>
            </div>
            <div className="text-[10px] text-plenvo-gray-500 text-right">
              actualizado en vivo
            </div>
          </div>
        </div>

        {/* Footer del doc */}
        <div className="px-5 sm:px-7 py-3 border-t border-plenvo-gray-300 bg-plenvo-gray-50 flex items-center justify-between text-[10px] text-plenvo-gray-500">
          <span>Plenvo · Business Studio</span>
          <span className="font-semibold text-plenvo-gray">Listo para descargar</span>
        </div>
      </div>

      {/* CTA: 2 opciones (gratis vs Pro) */}
      <div className="flex flex-col items-stretch gap-3 pt-2">
        {/* Plan Pro (primario) */}
        {onUpgrade ? (
          <button
            type="button"
            onClick={onUpgrade}
            disabled={isGenerating || isUpgrading}
            className="w-full inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg text-base font-semibold text-white border-0 plenvo-gradient-bg shadow-plenvo-md hover:shadow-plenvo-lg hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-plenvo-blue-2 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUpgrading ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                />
                Abriendo Mercado Pago…
              </>
            ) : (
              <>
                Obtener Plan Pro · {priceLabel}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        ) : null}

        {/* Plan gratuito (secundario) */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || isUpgrading}
          className="w-full inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg text-base font-semibold border border-plenvo-gray-300 text-plenvo-gray bg-white hover:bg-plenvo-gray-50 focus:outline-none focus:ring-2 focus:ring-plenvo-blue focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 border-2 border-plenvo-gray-300 border-t-plenvo-gray rounded-full animate-spin"
              />
              Generando documento…
            </>
          ) : (
            <>
              Descargar plan gratuito
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 4v12m0 0-5-5m5 5 5-5M4 20h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-plenvo-gray-500 text-center">
          Versión gratuita incluye marca de agua. El Plan Pro se descarga sin
          marca de agua, con gráficos y sección de riesgos.
        </p>
        {downloadError ? (
          <p
            role="alert"
            className="mt-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 max-w-md text-center"
          >
            {downloadError}
          </p>
        ) : null}
        {upgradeError ? (
          <p
            role="alert"
            className="mt-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 max-w-md text-center"
          >
            {upgradeError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
