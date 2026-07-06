"use client";

import { useFormContext } from "react-hook-form";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Section } from "@/components/ui/Section";
import { StepShell } from "./StepShell";
import { KpiCard } from "./KpiCard";
import {
  formatInt,
  formatPct,
  formatSoles,
  totalCostosFijos,
  totalCostosVariablesUnit,
  totalInversion,
  derivarCostos,
} from "@/lib/finance";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

const FIELDS = [
  "costoAlquiler",
  "costoServicios",
  "costoSueldos",
  "costoFijosOtros",
  "costoMateriaPrima",
  "costoEmpaque",
  "costoComision",
  "inversionEquipos",
  "inversionMobiliario",
  "inversionCapitalTrabajo",
  "inversionTramites",
] as const satisfies ReadonlyArray<keyof PlanForm>;

const Icons = {
  cash: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v16m-6-10h12M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
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
  layers: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function Step4EstructuraCostos({ stepIndex, onPrev, onNext }: Props) {
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
  const costosVarUnit = totalCostosVariablesUnit({
    costoMateriaPrima: v.costoMateriaPrima,
    costoEmpaque: v.costoEmpaque,
    costoComision: v.costoComision,
  });
  const inversion = totalInversion({
    inversionEquipos: v.inversionEquipos,
    inversionMobiliario: v.inversionMobiliario,
    inversionCapitalTrabajo: v.inversionCapitalTrabajo,
    inversionTramites: v.inversionTramites,
  });

  const deriv = derivarCostos(
    {
      costoAlquiler: v.costoAlquiler,
      costoServicios: v.costoServicios,
      costoSueldos: v.costoSueldos,
      costoFijosOtros: v.costoFijosOtros,
      costoMateriaPrima: v.costoMateriaPrima,
      costoEmpaque: v.costoEmpaque,
      costoComision: v.costoComision,
    },
    {
      inversionEquipos: v.inversionEquipos,
      inversionMobiliario: v.inversionMobiliario,
      inversionCapitalTrabajo: v.inversionCapitalTrabajo,
      inversionTramites: v.inversionTramites,
    },
    v.precioVenta
  );

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Estructura de costos"
      title="Calcula cuánto te cuesta operar"
      description="Calculamos todo en tiempo real. Si te falta un dato, déjalo en 0 y seguimos."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onNext}
    >
      <Section
        title="Costos fijos mensuales"
        description="Lo que pagas cada mes sin importar cuánto vendas."
        total={formatSoles(costosFijos)}
        totalLabel="Total mensual"
      >
        <MoneyInput
          label="Alquiler"
          placeholder="0.00"
          error={errors.costoAlquiler?.message}
          {...register("costoAlquiler", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Servicios (luz, agua, internet)"
          placeholder="0.00"
          error={errors.costoServicios?.message}
          {...register("costoServicios", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Sueldos fijos"
          placeholder="0.00"
          error={errors.costoSueldos?.message}
          {...register("costoSueldos", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Otros costos fijos"
          placeholder="0.00 (opcional)"
          error={errors.costoFijosOtros?.message}
          {...register("costoFijosOtros", { valueAsNumber: true })}
        />
      </Section>

      <Section
        title="Costos variables por unidad"
        description="Lo que te cuesta producir o entregar una unidad."
        total={formatSoles(costosVarUnit)}
        totalLabel="Costo unitario"
      >
        <MoneyInput
          label="Materia prima"
          placeholder="0.00"
          error={errors.costoMateriaPrima?.message}
          {...register("costoMateriaPrima", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Empaque"
          placeholder="0.00"
          error={errors.costoEmpaque?.message}
          {...register("costoEmpaque", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Comisión por venta"
          placeholder="0.00 (opcional)"
          error={errors.costoComision?.message}
          {...register("costoComision", { valueAsNumber: true })}
        />
      </Section>

      <Section
        title="Inversión inicial"
        description="Lo que necesitas para arrancar."
        total={formatSoles(inversion)}
        totalLabel="Inversión total"
      >
        <MoneyInput
          label="Equipos"
          placeholder="0.00"
          error={errors.inversionEquipos?.message}
          {...register("inversionEquipos", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Mobiliario"
          placeholder="0.00"
          error={errors.inversionMobiliario?.message}
          {...register("inversionMobiliario", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Capital de trabajo"
          placeholder="0.00"
          error={errors.inversionCapitalTrabajo?.message}
          {...register("inversionCapitalTrabajo", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Trámites y licencias"
          placeholder="0.00 (opcional)"
          error={errors.inversionTramites?.message}
          {...register("inversionTramites", { valueAsNumber: true })}
        />
      </Section>

      {/* ─── Indicadores en vivo ───────────────────────────── */}
      <section className="flex flex-col gap-4">
        <header>
          <h3 className="text-base sm:text-lg font-semibold text-plenvo-gray">
            Indicadores calculados
          </h3>
          <p className="mt-1 text-xs text-plenvo-gray-500">
            Se actualizan automáticamente con lo que vas completando.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <KpiCard
            label="Costo variable unitario"
            value={formatSoles(deriv.costoVariableUnitario)}
            icon={Icons.cash}
          />
          <KpiCard
            label="Margen de contribución"
            value={formatSoles(deriv.margenContribucionUnitario)}
            hint={`${formatPct(deriv.margenContribucionPct)} por unidad`}
            tone="highlight"
            icon={Icons.chart}
          />
          <KpiCard
            label="Punto de equilibrio"
            value={`${formatInt(deriv.puntoEquilibrioUnidades)} und`}
            hint="Unidades mínimas al mes para no perder"
            tone="highlight"
            icon={Icons.target}
          />
          <KpiCard
            label="PE en ventas (S/)"
            value={formatSoles(deriv.puntoEquilibrioSoles)}
            icon={Icons.cash}
          />
          <KpiCard
            label="Inversión total"
            value={formatSoles(deriv.inversionTotal)}
            icon={Icons.layers}
          />
        </div>

        {deriv.margenContribucionUnitario <= 0 ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              Tu precio de venta no cubre los costos variables. Ajusta el precio
              o los costos antes de continuar.
            </span>
          </p>
        ) : null}

        <p className="text-xs text-plenvo-gray-500">
          El costo unitario a volumen operativo (mes 1) aparecerá en el documento
          final, una vez completes las ventas esperadas en el siguiente paso.
        </p>
      </section>
    </StepShell>
  );
}
