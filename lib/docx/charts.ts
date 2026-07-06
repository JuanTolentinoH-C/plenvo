// Módulo servidor-only: genera gráficos como PNG para insertar en el .docx.
//
// Usa `chartjs-node-canvas` (que internamente usa `canvas` y `chart.js`).
// El bundle de estas libs NO debe llegar al cliente: este archivo solo se
// importa desde `/api/generate-plan/route.ts` → `lib/docx/generatePlan.ts`.
//
// Estructura:
//   - renderVentas12MesesChart(): gráfico de barras — unidades por mes.
//   - renderUtilidadAcumuladaChart(): gráfico de línea — utilidad acumulada (S/).
//   - renderInversionInicialChart(): gráfico circular — distribución de inversión.
//
// NOTA (Sprint 4+):
//   Cuando se active la API de Anthropic para análisis de mercado, aquí se
//   agregará `renderAnalisisMercadoChart()` que producirá gráficos más ricos
//   a partir del output del modelo. La interfaz `ChartInput` está diseñada
//   para que sea trivial extenderla sin tocar `generatePlan.ts`.
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { ChartConfiguration } from "chart.js/auto";

import type { FlujoMes } from "@/lib/finance";

// Paleta alineada con la marca Plenvo (azul principal #1E3A8A + verde éxito
// #10B981 + acentos gris y ámbar para textos de soporte).
const COLOR_PRIMARY = "#1E3A8A";
const COLOR_ACCENT = "#10B981";
const COLOR_MUTED = "#64748B";
const COLOR_WARN = "#B45309";

// Dimensiones del canvas del renderer (se ajustan al tamaño final del gráfico
// mediante `transformation` al insertar en docx — no afectan calidad).
const RENDERER_WIDTH = 900;
const RENDERER_HEIGHT = 480;

// Singleton del renderer: reusar la instancia entre invocaciones es crítico
// porque `canvas` crea un contexto nativo pesado. Cada request entrante
// reutiliza este renderer.
let rendererSingleton: ChartJSNodeCanvas | null = null;

const getRenderer = (): ChartJSNodeCanvas => {
  if (rendererSingleton) return rendererSingleton;
  rendererSingleton = new ChartJSNodeCanvas({
    width: RENDERER_WIDTH,
    height: RENDERER_HEIGHT,
    backgroundColour: "#FFFFFF",
  });
  return rendererSingleton;
};

/** Etiquetas comunes "Mes 1".."Mes 12". */
const labelsMeses = (): string[] =>
  Array.from({ length: 12 }, (_, i) => `Mes ${i + 1}`);

/**
 * (a) Barras — ventas proyectadas por mes (unidades).
 */
export const renderVentas12MesesChart = async (
  flujo: ReadonlyArray<FlujoMes>
): Promise<Buffer> => {
  const config: ChartConfiguration<"bar"> = {
    type: "bar",
    data: {
      labels: labelsMeses(),
      datasets: [
        {
          label: "Unidades vendidas",
          data: flujo.map((r) => r.unidades),
          backgroundColor: COLOR_PRIMARY,
          borderColor: COLOR_PRIMARY,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Ventas proyectadas por mes (unidades)",
          color: "#0F172A",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        x: { ticks: { color: COLOR_MUTED }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: COLOR_MUTED, precision: 0 },
          grid: { color: "#E2E8F0" },
          title: {
            display: true,
            text: "Unidades",
            color: COLOR_MUTED,
          },
        },
      },
    },
  };
  return getRenderer().renderToBuffer(config, "image/png");
};

/**
 * (b) Línea — utilidad acumulada por mes (S/).
 */
export const renderUtilidadAcumuladaChart = async (
  flujo: ReadonlyArray<FlujoMes>
): Promise<Buffer> => {
  const config: ChartConfiguration<"line"> = {
    type: "line",
    data: {
      labels: labelsMeses(),
      datasets: [
        {
          label: "Utilidad acumulada (S/)",
          data: flujo.map((r) => Number(r.utilidadAcumulada.toFixed(2))),
          borderColor: COLOR_ACCENT,
          backgroundColor: "rgba(5, 150, 105, 0.12)",
          fill: true,
          tension: 0.25,
          pointBackgroundColor: COLOR_ACCENT,
          pointRadius: 4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Utilidad acumulada proyectada (S/)",
          color: "#0F172A",
          font: { size: 16, weight: "bold" },
        },
      },
      scales: {
        x: { ticks: { color: COLOR_MUTED }, grid: { display: false } },
        y: {
          ticks: {
            color: COLOR_MUTED,
            // Formato corto: 1.2k, 15k, etc.
            callback: (v) => {
              const n = Number(v);
              if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
              return String(n);
            },
          },
          grid: { color: "#E2E8F0" },
          title: {
            display: true,
            text: "Soles (S/)",
            color: COLOR_MUTED,
          },
        },
      },
    },
  };
  return getRenderer().renderToBuffer(config, "image/png");
};

/**
 * (c) Circular (pie) — distribución de la inversión inicial.
 * Si todos los valores son 0, devuelve un PNG vacío de cortesía.
 */
export const renderInversionInicialChart = async (input: {
  equipos: number;
  mobiliario: number;
  capitalTrabajo: number;
  tramites: number;
}): Promise<Buffer> => {
  const labels = ["Equipos", "Mobiliario", "Capital de trabajo", "Trámites"];
  const data = [
    Math.max(0, input.equipos),
    Math.max(0, input.mobiliario),
    Math.max(0, input.capitalTrabajo),
    Math.max(0, input.tramites),
  ];
  const total = data.reduce((a, b) => a + b, 0);

  const config: ChartConfiguration<"pie"> = {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: total > 0 ? data : [1],
          backgroundColor: [
            COLOR_PRIMARY,
            COLOR_ACCENT,
            "#0EA5E9",
            COLOR_WARN,
          ],
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#0F172A", font: { size: 13 } },
        },
        title: {
          display: true,
          text: "Distribución de la inversión inicial (S/)",
          color: "#0F172A",
          font: { size: 16, weight: "bold" },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.parsed);
              if (total === 0) return `${ctx.label}: —`;
              const pct = ((v / total) * 100).toFixed(1);
              return `${ctx.label}: S/ ${v.toFixed(2)} (${pct}%)`;
            },
          },
        },
      },
    },
  };
  return getRenderer().renderToBuffer(config, "image/png");
};

/**
 * Stub para Sprint 4+: cuando llegue la integración con la API de Anthropic,
 * aquí se generarán gráficos adicionales para el análisis de mercado
 * (TAM/SAM/SOM, competidores, etc.). Dejar la firma ayuda a que
 * `generatePlan.ts` ya pueda referenciarla condicionalmente.
 */
export const renderAnalisisMercadoChart = async (
  _payload: unknown
): Promise<Buffer | null> => {
  // Pendiente de implementación cuando se configure la API key de Anthropic.
  void _payload;
  return null;
};