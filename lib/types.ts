import type { PlanForm } from "@/lib/schemas";

export type { PlanForm };

export const STORAGE_KEY = "gestionpyme-plan";

// Strings vacíos en los enums: los <select> los emiten así naturalmente,
// y Zod los rechazará con el mensaje definido en cada schema.
export const EMPTY_DEFAULTS: PlanForm = {
  // Step 1
  nombreNegocio: "",
  rubro: "" as PlanForm["rubro"],
  region: "" as PlanForm["region"],
  postulacion: "" as PlanForm["postulacion"],
  etapaNegocio: "" as PlanForm["etapaNegocio"],
  // Step 2
  problema: "",
  solucion: "",
  clienteIdeal: "",
  diferenciador: "",
  // Step 3
  clientesPotenciales: 0,
  precioVenta: 0,
  competidores: "",
  canalesVenta: [],
  // Step 4 — Estructura de costos
  costoAlquiler: 0,
  costoServicios: 0,
  costoSueldos: 0,
  costoFijosOtros: 0,
  costoMateriaPrima: 0,
  costoEmpaque: 0,
  costoComision: 0,
  inversionEquipos: 0,
  inversionMobiliario: 0,
  inversionCapitalTrabajo: 0,
  inversionTramites: 0,
  // Step 5 — Proyección
  ventasMes1: 0,
  crecimientoMensualPct: 5, // valor sugerido por el prompt
  // Step 6 — Financiamiento
  montoSolicitado: 0,
  usosFinanciamiento: [],
  capitalPropio: 0,
  // Flag
  isPro: false,
};