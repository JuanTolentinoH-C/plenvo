/**
 * DocumentMockup
 * Renderiza una vista previa "tipo SaaS" del documento Word generado
 * (basada en la estructura real de `plan-pro.docx`).
 * Mobile: oculta en <lg. En su lugar se usa <FinanceMockup />.
 */
export function DocumentMockup() {
  return (
    <div
      role="img"
      aria-label="Vista previa del documento Word generado por Plenvo"
      className="relative rounded-2xl bg-white shadow-plenvo-xl border border-plenvo-gray-300 overflow-hidden"
    >
      {/* Page chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-plenvo-gray-300 bg-plenvo-gray-50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-[11px] text-plenvo-gray-500 font-medium">
          Plan_de_Negocio_EcoMiel_Andina.docx
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-plenvo-green font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-plenvo-green animate-pulse-slow" />
          Listo para descargar
        </span>
      </div>

      {/* Document body */}
      <div className="p-5 sm:p-7 grid grid-cols-5 gap-5">
        {/* Mini TOC */}
        <aside className="col-span-5 sm:col-span-2 border border-plenvo-gray-300 rounded-xl p-4 bg-plenvo-gray-50">
          <p className="text-[10px] uppercase tracking-wider text-plenvo-gray-500 font-bold mb-3">
            Contenido
          </p>
          <ol className="text-xs text-plenvo-gray space-y-1.5">
            {[
              "Resumen ejecutivo",
              "Descripción del negocio",
              "Análisis de mercado",
              "Estructura de costos",
              "Punto de equilibrio",
              "Flujo de caja 12 meses",
              "Plan de financiamiento",
            ].map((t, i) => (
              <li
                key={t}
                className={`flex items-center gap-2 ${
                  i === 3 ? "text-plenvo-blue font-semibold" : ""
                }`}
              >
                <span
                  className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                    i === 3
                      ? "bg-plenvo-blue text-white"
                      : "bg-plenvo-gray-300 text-plenvo-gray"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="truncate">{t}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 pt-4 border-t border-plenvo-gray-300">
            <p className="text-[10px] uppercase tracking-wider text-plenvo-gray-500 font-bold mb-2">
              Dirigido a
            </p>
            <span className="inline-block text-xs px-2 py-1 rounded-md bg-white border border-plenvo-gray-300 text-plenvo-gray font-semibold">
              Innóvate Perú
            </span>
          </div>
        </aside>

        {/* Main content preview */}
        <div className="col-span-5 sm:col-span-3">
          <div className="text-[10px] uppercase tracking-wider text-plenvo-blue font-bold">
            4. Estructura de costos
          </div>
          <h3 className="mt-1 text-base font-semibold text-plenvo-gray">
            Inversión inicial
          </h3>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "Equipos", value: "S/ 15,500" },
              { label: "Mobiliario", value: "S/ 5,200" },
              { label: "Capital de trabajo", value: "S/ 9,000" },
              { label: "Trámites", value: "S/ 1,800" },
            ].map((it) => (
              <div
                key={it.label}
                className="rounded-lg border border-plenvo-gray-300 p-2.5"
              >
                <p className="text-[10px] text-plenvo-gray-500">{it.label}</p>
                <p className="text-sm font-semibold text-plenvo-gray">
                  {it.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg plenvo-gradient-soft-bg border border-plenvo-blue/20 p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-plenvo-blue-2 font-bold">
                Total
              </p>
              <p className="text-lg font-bold text-plenvo-blue">S/ 31,500.00</p>
            </div>
            <div className="text-[10px] text-plenvo-gray-500">
              Inversión inicial
            </div>
          </div>

          {/* Donut chart simulation */}
          <div className="mt-4 flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle
                  cx="18" cy="18" r="14"
                  fill="none" stroke="#E5E7EB" strokeWidth="4"
                />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none" stroke="#1E3A8A" strokeWidth="4"
                  strokeDasharray="49 100"
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none" stroke="#2563EB" strokeWidth="4"
                  strokeDasharray="17 100"
                  strokeDashoffset="-49"
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none" stroke="#10B981" strokeWidth="4"
                  strokeDasharray="29 100"
                  strokeDashoffset="-66"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-plenvo-gray">
                100%
              </span>
            </div>
            <div className="text-xs space-y-1">
              {[
                { c: "#1E3A8A", t: "Equipos · 49%" },
                { c: "#10B981", t: "Capital · 29%" },
                { c: "#2563EB", t: "Otros · 22%" },
              ].map((l) => (
                <p key={l.t} className="flex items-center gap-2 text-plenvo-gray">
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ background: l.c }}
                    aria-hidden
                  />
                  {l.t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer of doc */}
      <div className="px-5 sm:px-7 py-3 border-t border-plenvo-gray-300 bg-plenvo-gray-50 flex items-center justify-between text-[10px] text-plenvo-gray-500">
        <span>Generado por Plenvo · 25 de junio de 2026</span>
        <span className="font-semibold text-plenvo-gray">Página 4 / 12</span>
      </div>
    </div>
  );
}
