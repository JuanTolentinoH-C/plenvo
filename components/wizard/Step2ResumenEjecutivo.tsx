"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { StepShell } from "./StepShell";
import type { PlanForm } from "@/lib/schemas";

type Props = {
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

const FIELDS = [
  "problema",
  "solucion",
  "clienteIdeal",
  "diferenciador",
] as const satisfies ReadonlyArray<keyof PlanForm>;

export function Step2ResumenEjecutivo({ stepIndex, onPrev, onNext }: Props) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<PlanForm>();

  const clienteIdeal = watch("clienteIdeal") ?? "";

  return (
    <StepShell
      stepIndex={stepIndex}
      eyebrow="Resumen ejecutivo"
      title="Cuéntanos tu idea de negocio"
      description="Escribe con naturalidad, como si se lo contaras a un socio. Lo puliremos al generar el documento."
      fields={FIELDS}
      onPrev={onPrev}
      onNext={onNext}
    >
      <Textarea
        label="¿Qué problema resuelves?"
        placeholder="Describe el dolor o necesidad que detectaste en tus clientes…"
        required
        rows={4}
        maxLength={800}
        error={errors.problema?.message}
        {...register("problema")}
      />

      <Textarea
        label="¿Cuál es tu solución o producto?"
        placeholder="¿Qué vendes o qué servicio ofreces para resolver ese problema?"
        required
        rows={4}
        maxLength={800}
        error={errors.solucion?.message}
        {...register("solucion")}
      />

      <Textarea
        label="¿Quién es tu cliente ideal?"
        placeholder="Ej. Madres de familia, 25-40 años, NSE B y C, zona norte de Lima…"
        hint={`${clienteIdeal.length}/500 caracteres`}
        required
        rows={3}
        maxLength={500}
        error={errors.clienteIdeal?.message}
        {...register("clienteIdeal")}
      />

      <Textarea
        label="¿Qué te hace diferente de la competencia?"
        placeholder="¿Por qué un cliente te elegiría a ti y no a otro?"
        required
        rows={3}
        maxLength={500}
        error={errors.diferenciador?.message}
        {...register("diferenciador")}
      />
    </StepShell>
  );
}