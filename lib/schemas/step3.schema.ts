import { z } from "zod";
import { CANALES_VENTA } from "@/lib/constants/opciones";

export const step3Schema = z.object({
  clientesPotenciales: z
    .number({ message: "Ingresa un número" })
    .int("Debe ser un número entero")
    .positive("Debe ser mayor a 0")
    .max(10_000_000, "Valor demasiado grande"),
  precioVenta: z
    .number({ message: "Ingresa un número" })
    .positive("Debe ser mayor a 0")
    .max(10_000_000, "Valor demasiado grande"),
  competidores: z
    .string()
    .refine(
      (v) => {
        const items = v
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        return items.length >= 1 && items.length <= 3;
      },
      { message: "Lista entre 1 y 3 competidores (uno por línea)" }
    ),
  canalesVenta: z
    .array(z.enum(CANALES_VENTA))
    .min(1, "Selecciona al menos un canal de venta"),
});

export type Step3Values = z.infer<typeof step3Schema>;