import { z } from "zod";

export const step2Schema = z.object({
  problema: z
    .string()
    .min(20, "Cuéntanos un poco más del problema (mín. 20 caracteres)")
    .max(800, "Máximo 800 caracteres"),
  solucion: z
    .string()
    .min(20, "Cuéntanos un poco más de tu solución (mín. 20 caracteres)")
    .max(800, "Máximo 800 caracteres"),
  clienteIdeal: z
    .string()
    .min(20, "Cuéntanos un poco más de tu cliente ideal (mín. 20 caracteres)")
    .max(500, "Máximo 500 caracteres"),
  diferenciador: z
    .string()
    .min(15, "Cuéntanos qué te diferencia (mín. 15 caracteres)")
    .max(500, "Máximo 500 caracteres"),
});

export type Step2Values = z.infer<typeof step2Schema>;