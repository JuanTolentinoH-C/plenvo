export const REGIONES = [
  "Lima",
  "Arequipa",
  "Cusco",
  "La Libertad",
  "Piura",
  "Lambayeque",
  "Junín",
  "Cajamarca",
  "Puno",
  "Loreto",
  "Ica",
  "Áncash",
  "San Martín",
  "Tacna",
  "Callao",
  "Otra",
] as const;

export type Region = (typeof REGIONES)[number];