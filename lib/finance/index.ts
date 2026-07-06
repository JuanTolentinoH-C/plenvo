/**
 * Helpers financieros puros para Plenvo.
 *
 * Todas las funciones son determinísticas (sin estado, sin red) para que
 * el mismo cálculo se use en la UI en tiempo real y en la generación del
 * documento .docx final.
 */

import type { PlanForm } from "@/lib/schemas";

/** Suma segura: trata `undefined` como 0. */
export const safeSum = (...vals: Array<number | undefined>): number =>
  vals.reduce<number>((acc, v) => acc + (typeof v === "number" && isFinite(v) ? v : 0), 0);

export type CostosFijos = {
  costoAlquiler: number;
  costoServicios: number;
  costoSueldos: number;
  costoFijosOtros?: number;
};

export type CostosVariablesUnit = {
  costoMateriaPrima: number;
  costoEmpaque: number;
  costoComision?: number;
};

export type InversionInicial = {
  inversionEquipos: number;
  inversionMobiliario: number;
  inversionCapitalTrabajo: number;
  inversionTramites?: number;
};

/** Costos fijos mensuales totales. */
export const totalCostosFijos = (c: CostosFijos): number =>
  safeSum(c.costoAlquiler, c.costoServicios, c.costoSueldos, c.costoFijosOtros);

/** Costos variables por unidad (unit cost). */
export const totalCostosVariablesUnit = (c: CostosVariablesUnit): number =>
  safeSum(c.costoMateriaPrima, c.costoEmpaque, c.costoComision);

/** Inversión inicial total. */
export const totalInversion = (i: InversionInicial): number =>
  safeSum(
    i.inversionEquipos,
    i.inversionMobiliario,
    i.inversionCapitalTrabajo,
    i.inversionTramites
  );

/**
 * Indicadores que NO dependen del Paso 5 (ventas mes 1).
 * Son los que mostramos en la vista previa del Paso 4.
 */
export type DerivacionesCostos = {
  costosFijosMensuales: number;
  costoVariableUnitario: number;
  inversionTotal: number;
  /** Margen de contribución unitario (precio − costo variable). */
  margenContribucionUnitario: number;
  /** Margen de contribución como % del precio. */
  margenContribucionPct: number;
  /** Punto de equilibrio en unidades (entero, redondeado hacia arriba). */
  puntoEquilibrioUnidades: number;
  /** Punto de equilibrio en soles (precio × PE redondeado). */
  puntoEquilibrioSoles: number;
};

/**
 * Deriva los indicadores del Paso 4 a partir de los costos + inversión + precio.
 * NO requiere `ventasMes1` (Paso 5): solo usa el margen y el PE.
 *
 * Fórmulas:
 *   margen unitario     = precio − costoVariable
 *   margen %            = margen unitario / precio
 *   PE unidades         = ceil(costosFijos / margen unitario)   (0 si margen ≤ 0)
 *   PE soles            = PE unidades × precio
 */
export const derivarCostos = (
  costos: CostosFijos & CostosVariablesUnit,
  inversion: InversionInicial,
  precioVenta: number
): DerivacionesCostos => {
  const costosFijosMensuales = totalCostosFijos(costos);
  const costoVariableUnitario = totalCostosVariablesUnit(costos);
  const inversionTotal = totalInversion(inversion);
  const precio = Math.max(0, precioVenta);

  const margenUnitario = precio - costoVariableUnitario;
  const margenPct = precio > 0 ? margenUnitario / precio : 0;

  const puntoEquilibrioUnidades =
    margenUnitario > 0 ? Math.ceil(costosFijosMensuales / margenUnitario) : 0;
  const puntoEquilibrioSoles = puntoEquilibrioUnidades * precio;

  return {
    costosFijosMensuales,
    costoVariableUnitario,
    inversionTotal,
    margenContribucionUnitario: margenUnitario,
    margenContribucionPct: margenPct,
    puntoEquilibrioUnidades,
    puntoEquilibrioSoles,
  };
};

/**
 * Indicador adicional que SÍ depende del Paso 5.
 * Solo se muestra en el documento final (no en la UI del Paso 4).
 *
 * Fórmula:
 *   costoUnitarioVolumenOperativo = costoVariable + (costosFijos / ventasMes1)
 *
 * Solo es válido si `ventasMes1 > 0`. En otro caso devuelve `null`
 * (el documento debe omitir la fila, no mostrar un valor falso).
 */
export const costoUnitarioVolumenOperativo = (
  costoVariableUnitario: number,
  costosFijosMensuales: number,
  ventasMes1: number
): number | null => {
  if (!Number.isFinite(ventasMes1) || ventasMes1 <= 0) return null;
  if (!Number.isFinite(costosFijosMensuales) || costosFijosMensuales < 0) return null;
  return costoVariableUnitario + costosFijosMensuales / ventasMes1;
};

/** Una fila del flujo de caja proyectado. */
export type FlujoMes = {
  mes: number; // 1..12
  unidades: number;
  ingresos: number;
  costosVariables: number;
  costosFijos: number;
  costosTotales: number;
  utilidadMensual: number;
  utilidadAcumulada: number;
};

/**
 * Proyecta el flujo de caja a 12 meses.
 *
 * Fórmula: unidades_m = unidades_1 × (1 + g)^(m-1), redondeado hacia abajo
 * (no podemos vender fracciones).
 *
 * Costos totales = costosVariables × unidades + costosFijosMensuales.
 */
export const proyectarFlujo12Meses = (
  ventasMes1: number,
  crecimientoMensualPct: number,
  precioVenta: number,
  costoVariableUnitario: number,
  costosFijosMensuales: number
): FlujoMes[] => {
  const g = (crecimientoMensualPct || 0) / 100;
  let acumulada = 0;
  const rows: FlujoMes[] = [];

  for (let mes = 1; mes <= 12; mes++) {
    const unidades =
      mes === 1
        ? Math.max(0, Math.floor(ventasMes1))
        : Math.max(0, Math.floor(ventasMes1 * Math.pow(1 + g, mes - 1)));
    const ingresos = unidades * Math.max(0, precioVenta);
    const costosVariables = unidades * Math.max(0, costoVariableUnitario);
    const costosTotales = costosVariables + Math.max(0, costosFijosMensuales);
    const utilidadMensual = ingresos - costosTotales;
    acumulada += utilidadMensual;
    rows.push({
      mes,
      unidades,
      ingresos,
      costosVariables,
      costosFijos: Math.max(0, costosFijosMensuales),
      costosTotales,
      utilidadMensual,
      utilidadAcumulada: acumulada,
    });
  }
  return rows;
};

/** Formato de moneda en soles (S/) con 2 decimales. */
export const formatSoles = (n: number): string => {
  if (!isFinite(n)) return "S/ 0.00";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

/** Formato entero con separador de miles. */
export const formatInt = (n: number): string => {
  if (!isFinite(n)) return "0";
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(n);
};

/** Formato porcentaje con 1 decimal. */
export const formatPct = (n: number): string => {
  if (!isFinite(n)) return "0%";
  return new Intl.NumberFormat("es-PE", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n);
};

/**
 * Helper "todo-en-uno" usado por la UI del Paso 5, el Paso 6 y la generación
 * del .docx. Devuelve:
 *  - `deriv`: indicadores del Paso 4 (sin dependencia de ventas mes 1).
 *  - `flujo`: tabla 12 meses (depende de ventas mes 1).
 *  - `costoUnitarioVolumenOperativo`: número o null (solo cuando ventasMes1 > 0).
 */
export const calcularDesdeForm = (data: PlanForm) => {
  const deriv = derivarCostos(
    {
      costoAlquiler: data.costoAlquiler,
      costoServicios: data.costoServicios,
      costoSueldos: data.costoSueldos,
      costoFijosOtros: data.costoFijosOtros,
      costoMateriaPrima: data.costoMateriaPrima,
      costoEmpaque: data.costoEmpaque,
      costoComision: data.costoComision,
    },
    {
      inversionEquipos: data.inversionEquipos,
      inversionMobiliario: data.inversionMobiliario,
      inversionCapitalTrabajo: data.inversionCapitalTrabajo,
      inversionTramites: data.inversionTramites,
    },
    data.precioVenta
  );

  const flujo = proyectarFlujo12Meses(
    data.ventasMes1,
    data.crecimientoMensualPct,
    data.precioVenta,
    deriv.costoVariableUnitario,
    deriv.costosFijosMensuales
  );

  const costoUnitarioVolOp = costoUnitarioVolumenOperativo(
    deriv.costoVariableUnitario,
    deriv.costosFijosMensuales,
    data.ventasMes1
  );

  return { deriv, flujo, costoUnitarioVolumenOperativo: costoUnitarioVolOp };
};