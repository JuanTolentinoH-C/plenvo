import { z } from "zod";

const money = (msg = "Ingresa un número") =>
  z
    .number({ message: msg })
    .min(0, "No puede ser negativo")
    .max(10_000_000, "Valor demasiado grande");

const optionalMoney = (msg = "Ingresa un número") =>
  z
    .number({ message: msg })
    .min(0, "No puede ser negativo")
    .max(10_000_000, "Valor demasiado grande")
    .optional();

export const step4Schema = z.object({
  // Costos fijos mensuales
  costoAlquiler: money("Ingresa el alquiler mensual"),
  costoServicios: money("Ingresa servicios básicos"),
  costoSueldos: money("Ingresa sueldos fijos"),
  costoFijosOtros: optionalMoney("Ingresa el monto"),
  // Costos variables por unidad
  costoMateriaPrima: money("Ingresa materia prima por unidad"),
  costoEmpaque: money("Ingresa empaque por unidad"),
  costoComision: optionalMoney("Ingresa comisión por unidad"),
  // Inversión inicial
  inversionEquipos: money("Ingresa inversión en equipos"),
  inversionMobiliario: money("Ingresa inversión en mobiliario"),
  inversionCapitalTrabajo: money("Ingresa capital de trabajo inicial"),
  inversionTramites: optionalMoney("Ingresa trámites y licencias"),
});

export type Step4Values = z.infer<typeof step4Schema>;