"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CheckboxGroupField } from "@/components/ui/CheckboxGroupField";
import { StepShell } from "./StepShell";
import { CANALES_VENTA } from "@/lib/constants/opciones";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

const FIELDS = [
  "clientesPotenciales",
  "precioVenta",
  "competidores",
  "canalesVenta",
] as const satisfies ReadonlyArray<keyof PlanForm>;

export function Step3MercadoCompetencia({ stepIndex, onPrev, onNext }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlanForm>();

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Mercado y competencia"
      title="Tu mercado y tus competidores"
      description="Datos simples y honestos nos sirven más que cifras infladas. Lo afinaremos juntos."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Clientes potenciales en tu zona"
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="Ej. 500"
          error={errors.clientesPotenciales?.message}
          {...register("clientesPotenciales", { valueAsNumber: true })}
        />
        <Input
          label="Precio de venta (S/)"
          type="number"
          inputMode="decimal"
          step="0.10"
          min={0.1}
          required
          placeholder="Ej. 25.00"
          error={errors.precioVenta?.message}
          {...register("precioVenta", { valueAsNumber: true })}
        />
      </div>

      <Textarea
        label="Principales competidores"
        hint="Uno por línea, hasta 3."
        required
        rows={3}
        placeholder={"Bodega El Vecino\nMercado Mayorista X\nVenta por Facebook (competencia informal)"}
        error={errors.competidores?.message}
        {...register("competidores")}
      />

      <CheckboxGroupField
        name="canalesVenta"
        legend="Canales de venta"
        required
        options={CANALES_VENTA}
        columns={2}
      />
    </StepShell>
  );
}
