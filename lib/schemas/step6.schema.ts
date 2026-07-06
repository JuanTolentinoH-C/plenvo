import { z } from "zod";

export const USOS_FINANCIAMIENTO = [
  "Equipos",
  "Capital de trabajo",
  "Marketing",
  "Formalización",
] as const;

export type UsoFinanciamiento = (typeof USOS_FINANCIAMIENTO)[number];

export const step6Schema = z.object({
  montoSolicitado: z
    .number({ message: "Ingresa el monto solicitado" })
    .positive("Debe ser mayor a 0")
    .max(10_000_000, "Valor demasiado grande"),
  usosFinanciamiento: z
    .array(z.enum(USOS_FINANCIAMIENTO))
    .min(1, "Selecciona al menos un uso"),
  capitalPropio: z
    .number({ message: "Ingresa tu capital propio" })
    .min(0, "No puede ser negativo")
    .max(10_000_000, "Valor demasiado grande"),
});

export type Step6Values = z.infer<typeof step6Schema>;