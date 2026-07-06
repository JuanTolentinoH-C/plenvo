"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { StepShell } from "./StepShell";
import { KpiCard } from "./KpiCard";
import {
  formatInt,
  formatPct,
  formatSoles,
  calcularDesdeForm,
  totalCostosFijos,
  totalCostosVariablesUnit,
} from "@/lib/finance";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

const FIELDS = ["ventasMes1", "crecimientoMensualPct"] as const satisfies ReadonlyArray<
  keyof PlanForm
>;

const Icons = {
  chart: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V10M10 20V4M16 20v-8M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  target: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  bag: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h14l-1.2 11.4a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function Step5Proyeccion({ stepIndex, onPrev, onNext }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PlanForm>();

  const v = watch();

  const costosFijos = totalCostosFijos({
    costoAlquiler: v.costoAlquiler,
    costoServicios: v.costoServicios,
    costoSueldos: v.costoSueldos,
    costoFijosOtros: v.costoFijosOtros,
  });
  const costoVarUnit = totalCostosVariablesUnit({
    costoMateriaPrima: v.costoMateriaPrima,
    costoEmpaque: v.costoEmpaque,
    costoComision: v.costoComision,
  });

  const { flujo } = calcularDesdeForm({
    ...v,
  } as PlanForm);

  const totalUnidades = flujo.reduce((acc, r) => acc + r.unidades, 0);
  const totalIngresos = flujo.reduce((acc, r) => acc + r.ingresos, 0);
  const totalUtilidad = flujo[flujo.length - 1]?.utilidadAcumulada ?? 0;

  // Encontrar el primer mes donde utilidadAcumulada >= 0 (punto de equilibrio)
  const breakEvenMes = flujo.find((r) => r.utilidadAcumulada >= 0);
  const breakEvenLabel = breakEvenMes ? `Mes ${breakEvenMes.mes}` : "No en 12m";

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Proyección de ventas"
      title="Tu flujo de caja a 12 meses"
      description="Estimamos cómo crecen tus ventas mes a mes. Edita el % si quieres afinar la proyección."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Ventas esperadas en el mes 1 (unidades)"
          type="number"
          inputMode="numeric"
          min={0}
          required
          placeholder="Ej. 100"
          error={errors.ventasMes1?.message}
          {...register("ventasMes1", { valueAsNumber: true })}
        />
        <Input
          label="Crecimiento mensual estimado"
          type="number"
          inputMode="decimal"
          step="0.5"
          min={-50}
          max={100}
          required
          placeholder="5"
          hint="Valor sugerido: 5%. Puede ser negativo si esperas caída."
          error={errors.crecimientoMensualPct?.message}
          {...register("crecimientoMensualPct", { valueAsNumber: true })}
        />
      </div>

      {/* ── KPIs en vivo ── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <KpiCard
          label="Unidades año 1"
          value={formatInt(totalUnidades)}
          icon={Icons.bag}
        />
        <KpiCard
          label="Ingresos año 1"
          value={formatSoles(totalIngresos)}
          icon={Icons.chart}
        />
        <KpiCard
          label="Punto de equilibrio"
          value={breakEvenLabel}
          hint="Mes en el que recuperas la inversión"
          tone="highlight"
          icon={Icons.target}
        />
      </section>

      {/* ── Tabla premium ── */}
      <section className="rounded-2xl border border-plenvo-gray-300 bg-white overflow-hidden shadow-plenvo-xs">
        <header className="px-4 sm:px-5 py-4 border-b border-plenvo-gray-300">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-base font-semibold text-plenvo-gray">
                Flujo de caja proyectado
              </h3>
              <p className="mt-1 text-xs text-plenvo-gray-500 leading-relaxed">
                Costos fijos: {formatSoles(costosFijos)} · Costo variable:{" "}
                {formatSoles(costoVarUnit)}/und · Precio:{" "}
                {formatSoles(v.precioVenta)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-plenvo-gray-500">
              <span className="w-1.5 h-1.5 rounded-full plenvo-gradient-bg animate-pulse-slow" />
              En vivo
            </span>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-plenvo-gray-50 text-plenvo-gray-500">
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">Mes</th>
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-right font-semibold text-xs uppercase tracking-wider">Unidades</th>
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-right font-semibold text-xs uppercase tracking-wider">Ingresos</th>
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-right font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Costos</th>
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-right font-semibold text-xs uppercase tracking-wider">Mensual</th>
                <th scope="col" className="px-3 sm:px-4 py-2.5 text-right font-semibold text-xs uppercase tracking-wider">Acumulada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plenvo-gray-300">
              {flujo.map((r) => {
                const isPos = r.utilidadMensual >= 0;
                const isBreakEven =
                  r.utilidadAcumulada >= 0 &&
                  (r.mes === 1 ||
                    flujo[r.mes - 2]?.utilidadAcumulada < 0);
                return (
                  <tr
                    key={r.mes}
                    className={`hover:bg-plenvo-gray-50 transition-colors ${
                      isBreakEven ? "bg-plenvo-green/5" : ""
                    }`}
                  >
                    <td className="px-3 sm:px-4 py-2 font-medium text-plenvo-gray whitespace-nowrap">
                      Mes {r.mes}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-right tabular-nums text-plenvo-gray">
                      {formatInt(r.unidades)}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-right tabular-nums text-plenvo-gray">
                      {formatSoles(r.ingresos)}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-right tabular-nums text-plenvo-gray-500 hidden sm:table-cell">
                      {formatSoles(r.costosTotales)}
                    </td>
                    <td
                      className={`px-3 sm:px-4 py-2 text-right tabular-nums font-medium ${
                        isPos ? "text-plenvo-green" : "text-red-600"
                      }`}
                    >
                      {formatSoles(r.utilidadMensual)}
                    </td>
                    <td
                      className={`px-3 sm:px-4 py-2 text-right tabular-nums font-bold ${
                        r.utilidadAcumulada >= 0
                          ? "text-plenvo-green"
                          : "text-red-600"
                      }`}
                    >
                      {formatSoles(r.utilidadAcumulada)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-plenvo-gray-50 font-bold border-t-2 border-plenvo-gray-300">
                <td className="px-3 sm:px-4 py-3 text-plenvo-gray">
                  Total 12 meses
                </td>
                <td className="px-3 sm:px-4 py-3 text-right tabular-nums">
                  {formatInt(totalUnidades)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right tabular-nums">
                  {formatSoles(totalIngresos)}
                </td>
                <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-plenvo-gray-500 hidden sm:table-cell">
                  —
                </td>
                <td className="px-3 sm:px-4 py-3 text-right tabular-nums text-plenvo-gray-500">
                  —
                </td>
                <td
                  className={`px-3 sm:px-4 py-3 text-right tabular-nums ${
                    totalUtilidad >= 0 ? "text-plenvo-green" : "text-red-600"
                  }`}
                >
                  {formatSoles(totalUtilidad)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <p className="text-xs text-plenvo-gray-500 leading-relaxed">
        Crecimiento aplicado:{" "}
        <span className="font-semibold text-plenvo-gray">
          {formatPct((v.crecimientoMensualPct ?? 0) / 100)}
        </span>{" "}
        mensual. La fila en verde marca el primer mes con utilidad acumulada
        positiva.
      </p>
    </StepShell>
  );
}
