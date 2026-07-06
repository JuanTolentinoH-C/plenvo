import { z } from "zod";

export const step5Schema = z.object({
  ventasMes1: z
    .number({ message: "Ingresa las ventas esperadas del mes 1" })
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .max(1_000_000, "Valor demasiado grande"),
  crecimientoMensualPct: z
    .number({ message: "Ingresa el porcentaje de crecimiento" })
    .min(-50, "Demasiado bajo (mínimo -50%)")
    .max(100, "Demasiado alto (máximo 100%)"),
});

export type Step5Values = z.infer<typeof step5Schema>;