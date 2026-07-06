import { z } from "zod";
import { step1Schema } from "./step1.schema";
import { step2Schema } from "./step2.schema";
import { step3Schema } from "./step3.schema";
import { step4Schema } from "./step4.schema";
import { step5Schema } from "./step5.schema";
import { step6Schema } from "./step6.schema";

export const planSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  // Flag presente desde el día 1 — Sprint 2 lo usará para gating de marca de agua.
  // Nunca se persiste como true desde el cliente sin un flujo de pago real.
  .extend({
    isPro: z.boolean(),
  });

export type PlanForm = z.infer<typeof planSchema>;

// Lista plana de campos por step para usar con `trigger([...])` de RHF.
// Cada elemento es la tupla exacta que RHF acepta: array de keys del form.
export const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof PlanForm>> = [
  ["nombreNegocio", "rubro", "region", "postulacion", "etapaNegocio"],
  ["problema", "solucion", "clienteIdeal", "diferenciador"],
  ["clientesPotenciales", "precioVenta", "competidores", "canalesVenta"],
  [
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
  ],
  ["ventasMes1", "crecimientoMensualPct"],
  ["montoSolicitado", "usosFinanciamiento", "capitalPropio"],
];

export const STEP_TITLES = [
  "Datos generales",
  "Resumen ejecutivo",
  "Mercado y competencia",
  "Estructura de costos",
  "Proyección de ventas",
  "Financiamiento",
] as const;

export const TOTAL_STEPS = STEP_TITLES.length;