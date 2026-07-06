export const POSTULACIONES = [
  "Startup Perú",
  "Innóvate Perú",
  "Microcrédito bancario",
  "Uso personal",
] as const;

export type Postulacion = (typeof POSTULACIONES)[number];

export const ETAPAS_NEGOCIO = [
  "Idea",
  "Ya vendo informalmente",
  "Negocio formal en marcha",
] as const;

export type EtapaNegocio = (typeof ETAPAS_NEGOCIO)[number];

export const CANALES_VENTA = [
  "Tienda física",
  "Redes sociales",
  "Marketplace",
  "Ferias",
  "Otro",
] as const;

export type CanalVenta = (typeof CANALES_VENTA)[number];