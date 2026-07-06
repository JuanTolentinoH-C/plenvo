"use client";

import { useFormContext } from "react-hook-form";
import { MoneyInput } from "@/components/ui/MoneyInput";
import { Section } from "@/components/ui/Section";
import { CheckboxGroupField } from "@/components/ui/CheckboxGroupField";
import { StepShell } from "./StepShell";
import { DocumentoListo } from "./DocumentoListo";
import { CoverageBar } from "./CoverageBar";
import { KpiCard } from "./KpiCard";
import { USOS_FINANCIAMIENTO } from "@/lib/schemas/step6.schema";
import { formatSoles, derivarCostos } from "@/lib/finance";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onGenerate: () => void | Promise<void>;
  onUpgrade?: () => void | Promise<void>;
  isGenerating?: boolean;
  isUpgrading?: boolean;
  downloadError?: string | null;
  upgradeError?: string | null;
  proPrice?: number;
};

const FIELDS = [
  "montoSolicitado",
  "usosFinanciamiento",
  "capitalPropio",
] as const satisfies ReadonlyArray<keyof PlanForm>;

export function Step6Financiamiento({
  stepIndex,
  onPrev,
  onGenerate,
  onUpgrade,
  isGenerating,
  isUpgrading,
  downloadError,
  upgradeError,
  proPrice,
}: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PlanForm>();

  const v = watch();
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

  const totalAporte = (v.montoSolicitado || 0) + (v.capitalPropio || 0);
  const coberturaPct =
    deriv.inversionTotal > 0
      ? Math.min(100, (totalAporte / deriv.inversionTotal) * 100)
      : 0;
  const falta = Math.max(0, deriv.inversionTotal - totalAporte);

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Financiamiento"
      title="¿Cuánto necesitas y en qué lo usarás?"
      description="Al final generaremos tu plan descargable."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onPrev} /* placeholder: en este paso no hay "Siguiente"; usamos Anterior como acción primaria. */
      nextLabel="← Volver al paso anterior"
      hideFooter
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MoneyInput
          label="Monto que buscas (S/)"
          placeholder="0.00"
          required
          error={errors.montoSolicitado?.message}
          {...register("montoSolicitado", { valueAsNumber: true })}
        />
        <MoneyInput
          label="Capital propio disponible (S/)"
          placeholder="0.00"
          required
          error={errors.capitalPropio?.message}
          {...register("capitalPropio", { valueAsNumber: true })}
        />
      </div>

      <CheckboxGroupField
        name="usosFinanciamiento"
        legend="¿Para qué lo usarás?"
        required
        options={USOS_FINANCIAMIENTO}
        columns={2}
      />

      {/* Resumen + Cobertura */}
      <Section
        title="Cobertura de la inversión"
        description="Suma de los aportes vs. inversión total."
        total={`${coberturaPct.toFixed(0)}%`}
        totalLabel="Cubierto"
      >
        <div className="col-span-1 sm:col-span-2 flex flex-col gap-4">
          {/*
            Grid responsivo propio para los KPIs (no depender del grid
            2-col de Section que apretaba las tarjetas). En mobile 1 col,
            en ≥sm 2 cols, en ≥lg 3 cols (ancho suficiente para "S/100,000.00").
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <KpiCard
              label="Monto solicitado"
              value={formatSoles(v.montoSolicitado || 0)}
            />
            <KpiCard
              label="Capital propio"
              value={formatSoles(v.capitalPropio || 0)}
            />
            <KpiCard
              label="Inversión total"
              value={formatSoles(deriv.inversionTotal)}
              tone="highlight"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-plenvo-gray-500 mb-1.5">
              <span>Aportes confirmados</span>
              <span className="font-semibold text-plenvo-gray">
                {formatSoles(totalAporte)} / {formatSoles(deriv.inversionTotal)}
              </span>
            </div>
            <CoverageBar pct={coberturaPct} />
          </div>

          {falta > 0 ? (
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
                Falta cubrir <strong>{formatSoles(falta)}</strong> para
                completar la inversión. Considera otras fuentes de
                financiamiento.
              </span>
            </p>
          ) : coberturaPct >= 100 ? (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl bg-plenvo-green/10 border border-plenvo-green/30 text-plenvo-green text-sm px-4 py-3"
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
                  d="m5 12 4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Tu cobertura cubre el <strong>100%</strong> de la inversión
                inicial. Buen equilibrio entre aporte externo y capital propio.
              </span>
            </p>
          ) : null}
        </div>
      </Section>

      {/* Botón "Volver al paso anterior" cuando hideFooter=true */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-semibold bg-white text-plenvo-blue border border-plenvo-gray-300 hover:bg-plenvo-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-plenvo-blue focus:ring-offset-2"
        >
          ← Anterior
        </button>
      </div>

      {/* Pantalla final: documento listo */}
      <DocumentoListo
        nombreNegocio={v.nombreNegocio}
        isGenerating={!!isGenerating}
        isUpgrading={isUpgrading}
        onGenerate={onGenerate}
        onUpgrade={onUpgrade}
        downloadError={downloadError}
        upgradeError={upgradeError}
        proPrice={proPrice}
      />
    </StepShell>
  );
}
