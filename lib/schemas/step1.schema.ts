import { z } from "zod";
import { RUBROS } from "@/lib/constants/rubros";
import { REGIONES } from "@/lib/constants/regiones";
import {
  ETAPAS_NEGOCIO,
  POSTULACIONES,
} from "@/lib/constants/opciones";

export const step1Schema = z.object({
  nombreNegocio: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "Máximo 80 caracteres"),
  rubro: z.enum(RUBROS, {
    message: "Selecciona un rubro",
  }),
  region: z.enum(REGIONES, {
    message: "Selecciona una región",
  }),
  postulacion: z.enum(POSTULACIONES, {
    message: "Selecciona a qué postulas",
  }),
  etapaNegocio: z.enum(ETAPAS_NEGOCIO, {
    message: "Selecciona la etapa de tu negocio",
  }),
});

export type Step1Values = z.infer<typeof step1Schema>;