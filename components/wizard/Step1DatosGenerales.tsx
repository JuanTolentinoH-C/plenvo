"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StepShell } from "./StepShell";
import { RUBROS } from "@/lib/constants/rubros";
import { REGIONES } from "@/lib/constants/regiones";
import {
  ETAPAS_NEGOCIO,
  POSTULACIONES,
} from "@/lib/constants/opciones";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

const FIELDS = [
  "nombreNegocio",
  "rubro",
  "region",
  "postulacion",
  "etapaNegocio",
] as const satisfies ReadonlyArray<keyof PlanForm>;

export function Step1DatosGenerales({ stepIndex, onPrev, onNext }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlanForm>();

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Datos generales"
      title="Cuéntanos sobre tu negocio"
      description="Estos datos definen el formato final del documento y el tipo de postulación a la que aplicarás."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onNext}
    >
      <Input
        label="Nombre del negocio"
        placeholder="Ej. Bodega Doña Rosa"
        required
        autoComplete="organization"
        error={errors.nombreNegocio?.message}
        {...register("nombreNegocio")}
      />

      <Select
        label="Rubro"
        required
        options={RUBROS}
        error={errors.rubro?.message}
        {...register("rubro")}
      />

      <Select
        label="Región / Provincia"
        required
        options={REGIONES}
        error={errors.region?.message}
        {...register("region")}
      />

      <Select
        label="¿A qué postulas?"
        required
        hint="Esto ajustará el énfasis del documento final."
        options={POSTULACIONES}
        error={errors.postulacion?.message}
        {...register("postulacion")}
      />

      <Select
        label="Etapa del negocio"
        required
        options={ETAPAS_NEGOCIO}
        error={errors.etapaNegocio?.message}
        {...register("etapaNegocio")}
      />
    </StepShell>
  );
}