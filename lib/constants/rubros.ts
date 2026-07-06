export const RUBROS = [
  "Comercio",
  "Servicios",
  "Manufactura",
  "Agro",
  "Tecnología",
  "Otro",
] as const;

export type Rubro = (typeof RUBROS)[number];