/**
 * FinanceMockup — Tarjeta flotante con proyección financiera (12 meses)
 * Diseñada para superponerse sobre el DocumentMockup en el hero.
 */
export function FinanceMockup() {
  // 12 bars: utilidades mensuales relativas basadas en los datos reales del plan-pro.docx
  // Mes 1..12 utilidades aproximadas (en miles, escala visual)
  const months = [
    { m: "M1", v: 32, neg: true },
    { m: "M2", v: 38, neg: true },
    { m: "M3", v: 44, neg: true },
    { m: "M4", v: 50, neg: true },
    { m: "M5", v: 56, neg: true },
    { m: "M6", v: 62, neg: true },
    { m: "M7", v: 70, neg: false },
    { m: "M8", v: 78, neg: false },
    { m: "M9", v: 86, neg: false },
    { m: "M10", v: 94, neg: false },
    { m: "M11", v: 100, neg: false },
    { m: "M12", v: 100, neg: false },
  ];
  const max = Math.max(...months.map((d) => d.v));

  return (
    <div className="rounded-2xl bg-white shadow-plenvo-lg border border-plenvo-gray-300 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-plenvo-gray-500 font-bold">
            Flujo de caja · 12 meses
          </p>
          <p className="text-sm font-semibold text-plenvo-gray">
            Proyección EcoMiel Andina
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-plenvo-green/10 text-plenvo-green font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-plenvo-green" />
          Punto de equilibrio: mes 7
        </span>
      </div>

      <div className="mt-4 flex items-end gap-1.5 h-24">
        {months.map((d) => {
          const h = (d.v / max) * 100;
          return (
            <div key={d.m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative h-full flex items-end">
                <div
                  className={`w-full rounded-t ${
                    d.neg ? "bg-plenvo-blue/40" : "plenvo-gradient-bg"
                  }`}
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="text-[9px] text-plenvo-gray-500">{d.m}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-plenvo-gray-300">
        {[
          { label: "Ingresos año 1", value: "S/ 142K" },
          { label: "Costos año 1", value: "S/ 145K" },
          { label: "Utilidad mes 12", value: "+S/ 8K" },
        ].map((it) => (
          <div key={it.label}>
            <p className="text-[9px] uppercase text-plenvo-gray-500">{it.label}</p>
            <p className="text-sm font-bold text-plenvo-gray">{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
