// Sin "use server": este módulo solo se invoca desde el route handler
// /api/generate-plan (servidor). No debe importarse desde el cliente
// porque arrastra `docx` (~200KB) al bundle.
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import type { PlanForm } from "@/lib/schemas";
import {
  calcularDesdeForm,
  formatInt,
  formatPct,
  formatSoles,
} from "@/lib/finance";
import {
  renderInversionInicialChart,
  renderUtilidadAcumuladaChart,
  renderVentas12MesesChart,
} from "./charts";
import { riesgosParaPlan } from "./risks";

/**
 * Generador del documento Word (.docx) del plan de negocio.
 *
 * Estructura (9 secciones según el prompt original):
 *   1. Carátula
 *   2. Resumen ejecutivo
 *   3. Descripción del negocio y propuesta de valor
 *   4. Análisis de mercado
 *   5. Estructura de costos
 *   6. Punto de equilibrio
 *   7. Flujo de caja proyectado a 12 meses
 *   8. Plan de financiamiento solicitado
 *   9. Conclusiones
 *
 * El énfasis varía según "¿A qué postulas?":
 *   - Startup Perú / Innóvate Perú → innovación y escalabilidad.
 *   - Microcrédito bancario → capacidad de pago y flujo de caja.
 *   - Uso personal → tono neutro.
 *
 * Si `isPro === false` se aplica marca de agua en footer + carátula.
 */

type Postulacion = PlanForm["postulacion"];
type Variante = "innovacion" | "credito" | "neutro";

const variantePara = (postulacion: Postulacion): Variante => {
  if (postulacion === "Startup Perú" || postulacion === "Innóvate Perú") return "innovacion";
  if (postulacion === "Microcrédito bancario") return "credito";
  return "neutro";
};

const COLOR_PRIMARY = "1D4ED8";
const COLOR_ACCENT = "059669";
const COLOR_MUTED = "64748B";
const COLOR_WARN = "B45309";

const MARCA_FREE = "Plenvo — Versión gratuita";

const fechaActual = (): string =>
  new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const p = (text: string, opts: { bold?: boolean; italics?: boolean; size?: number; color?: string } = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italics,
        size: opts.size ?? 22,
        color: opts.color ?? "0F172A",
        font: "Calibri",
      }),
    ],
  });

const heading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    children: [
      new TextRun({ text, bold: true, color: COLOR_PRIMARY, font: "Calibri" }),
    ],
  });

const cell = (
  text: string,
  opts: {
    bold?: boolean;
    italics?: boolean;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    fill?: string;
    color?: string;
  } = {}
) =>
  new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    shading: opts.fill
      ? { type: ShadingType.CLEAR, fill: opts.fill, color: "auto" }
      : undefined,
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [
          new TextRun({
            text,
            bold: opts.bold,
            italics: opts.italics,
            size: 20,
            color: opts.color ?? "0F172A",
            font: "Calibri",
          }),
        ],
      }),
    ],
  });

const buildTable = (headers: string[], rows: string[][]): Table => {
  const colCount = headers.length;
  const widths = Array(colCount).fill(Math.floor(100 / colCount));
  widths[widths.length - 1] += 100 - widths.reduce((a, b) => a + b, 0);

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      cell(h, {
        bold: true,
        fill: COLOR_PRIMARY,
        color: "FFFFFF",
        align: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
      })
    ),
  });

  const dataRows = rows.map(
    (r, idx) =>
      new TableRow({
        children: r.map((val, i) =>
          cell(val, {
            fill: idx % 2 === 0 ? "FFFFFF" : "F8FAFC",
            align: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT,
          })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_MUTED },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_MUTED },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_MUTED },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_MUTED },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
    },
  });
};

const competidoresParas = (raw: string): Paragraph[] => {
  const items = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (items.length === 0) return [p("—")];
  return items.map(
    (item) =>
      new Paragraph({
        spacing: { after: 60 },
        bullet: { level: 0 },
        children: [new TextRun({ text: item, size: 22, font: "Calibri", color: "0F172A" })],
      })
  );
};

// --- Sprint 3 helpers (Pro) -------------------------------------------------

/**
 * Inserta una imagen PNG como un párrafo centrado. Solo se invoca desde el
 * branch `isPro === true`, así que el módulo `charts.ts` (servidor-only)
 * nunca se importa en el bundle del cliente.
 *
 * NOTA: la librería `docx` interpreta `transformation.width/height` como
 * **píxeles** y los convierte a EMU multiplicando por 9525 (1 píxel ≈
 * 9525 EMU @ 96 DPI). Por eso usamos 600 px y 320 px (= 6.25" × 3.33").
 * Pasar valores en EMU directamente (p. ej. 5_715_000) inflaba el extent a
 * ~60" y Word rechazaba el archivo.
 */
const chartParagraph = (pngBuffer: Buffer): Paragraph =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new ImageRun({
        type: "png",
        data: pngBuffer,
        transformation: {
          width: 600,
          height: 320,
        },
      }),
    ],
  });

const caption = (text: string): Paragraph =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 18,
        color: COLOR_MUTED,
        font: "Calibri",
      }),
    ],
  });

const parrafosResumen = (data: PlanForm, variante: Variante): Paragraph[] => {
  const base: Paragraph[] = [
    p(`Problema: ${data.problema}`),
    p(`Solución: ${data.solucion}`),
    p(`Cliente ideal: ${data.clienteIdeal}`),
    p(`Diferenciador: ${data.diferenciador}`),
  ];

  if (variante === "innovacion") {
    return [
      p(
        `Este proyecto se presenta a ${data.postulacion}. El siguiente plan destaca el componente de innovación, la propuesta de valor diferencial y el potencial de escalabilidad del modelo de negocio "${data.nombreNegocio}".`,
        { bold: true }
      ),
      ...base,
      p(
        `El modelo apunta a capturar ${formatInt(data.clientesPotenciales)} clientes potenciales en la región ${data.region}, mediante los siguientes canales: ${data.canalesVenta.join(", ")}.`
      ),
    ];
  }

  if (variante === "credito") {
    return [
      p(
        `Este proyecto se presenta como solicitud de microcrédito bancario. El plan prioriza la demostración de la capacidad de pago, la sostenibilidad del flujo de caja y el uso productivo del financiamiento solicitado.`,
        { bold: true }
      ),
      ...base,
      p(
        `El negocio "${data.nombreNegocio}", ubicado en ${data.region}, atiende un mercado estimado de ${formatInt(data.clientesPotenciales)} clientes potenciales a través de: ${data.canalesVenta.join(", ")}.`
      ),
    ];
  }

  return [
    p(
      `Resumen del negocio "${data.nombreNegocio}" (${data.rubro}) en ${data.region}.`,
      { bold: true }
    ),
    ...base,
  ];
};

export const buildPlanDoc = async (data: PlanForm): Promise<Buffer> => {
  const variante = variantePara(data.postulacion);
  const isFree = data.isPro === false;
  const isPro = data.isPro === true;
  const { deriv, flujo, costoUnitarioVolumenOperativo } = calcularDesdeForm(data);
  const fecha = fechaActual();

  // 1. CARÁTULA
  const caratula: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 200 },
      children: [
        new TextRun({
          text: "PLAN DE NEGOCIO",
          bold: true,
          size: 56,
          color: COLOR_PRIMARY,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [
        new TextRun({
          text: data.nombreNegocio,
          bold: true,
          size: 44,
          color: "0F172A",
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${data.rubro} · ${data.region}`,
          size: 28,
          color: COLOR_MUTED,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 2000 },
      children: [
        new TextRun({
          text: `Etapa: ${data.etapaNegocio}`,
          italics: true,
          size: 24,
          color: COLOR_MUTED,
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: fecha, size: 22, color: "0F172A", font: "Calibri" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Dirigido a: ${data.postulacion}`,
          bold: true,
          size: 24,
          color: COLOR_ACCENT,
          font: "Calibri",
        }),
      ],
    }),
    isFree
      ? new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 200 },
          children: [
            new TextRun({
              text: MARCA_FREE,
              italics: true,
              size: 20,
              color: COLOR_WARN,
              font: "Calibri",
            }),
          ],
        })
      : new Paragraph({ children: [] }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 2. RESUMEN EJECUTIVO
  const resumenEjecutivo: (Paragraph | Table)[] = [
    heading("1. Resumen ejecutivo"),
    ...parrafosResumen(data, variante),
  ];

  // 3. DESCRIPCIÓN DEL NEGOCIO
  const descripcionNegocio: (Paragraph | Table)[] = [
    heading("2. Descripción del negocio y propuesta de valor"),
    p(
      `${data.nombreNegocio} es un negocio del rubro ${data.rubro} con sede en ${data.region}, actualmente en etapa de "${data.etapaNegocio}".`
    ),
    p(`Problema que aborda:`, { bold: true }),
    p(data.problema),
    p(`Solución ofrecida:`, { bold: true }),
    p(data.solucion),
    p(`Propuesta de valor — diferenciador:`, { bold: true }),
    p(data.diferenciador),
  ];

  if (variante === "innovacion") {
    descripcionNegocio.push(
      p(
        `Potencial de escalabilidad: el modelo es replicable a otras regiones del Perú y puede incorporar canales digitales para ampliar el alcance sin requerir inversión proporcional en infraestructura física.`,
        { color: COLOR_PRIMARY }
      )
    );
  }

  // 4. ANÁLISIS DE MERCADO
  const canalesVenta = data.canalesVenta.length > 0 ? data.canalesVenta.join(", ") : "—";

  const analisisMercado: (Paragraph | Table)[] = [
    heading("3. Análisis de mercado"),
    p(`Tamaño estimado del mercado objetivo:`, { bold: true }),
    p(`${formatInt(data.clientesPotenciales)} clientes potenciales en la zona de influencia.`),
    p(`Precio de venta por unidad:`, { bold: true }),
    p(`${formatSoles(data.precioVenta)} por unidad.`),
    p(`Principales competidores:`, { bold: true }),
    ...competidoresParas(data.competidores),
    p(`Canales de venta:`, { bold: true }),
    p(canalesVenta),
  ];

  if (variante === "credito") {
    analisisMercado.push(
      p(
        `Indicador clave: con un precio de ${formatSoles(data.precioVenta)} y un mercado de ${formatInt(data.clientesPotenciales)} clientes, el ingreso máximo potencial anual en escenario de captura total sería de ${formatSoles(data.precioVenta * data.clientesPotenciales)}.`,
        { color: COLOR_PRIMARY }
      )
    );
  }

  // 5. ESTRUCTURA DE COSTOS
  const estructuraCostos: (Paragraph | Table)[] = [
    heading("4. Estructura de costos"),
    p(`Costos fijos mensuales:`, { bold: true }),
    buildTable(
      ["Concepto", "Monto mensual (S/)"],
      [
        ["Alquiler", formatSoles(data.costoAlquiler)],
        ["Servicios (luz, agua, internet)", formatSoles(data.costoServicios)],
        ["Sueldos fijos", formatSoles(data.costoSueldos)],
        ["Otros costos fijos", formatSoles(data.costoFijosOtros ?? 0)],
        ["Total costos fijos", formatSoles(deriv.costosFijosMensuales)],
      ]
    ),
    p(`Costos variables por unidad:`, { bold: true }),
    buildTable(
      ["Concepto", "Monto por unidad (S/)"],
      [
        ["Materia prima", formatSoles(data.costoMateriaPrima)],
        ["Empaque", formatSoles(data.costoEmpaque)],
        ["Comisión por venta", formatSoles(data.costoComision ?? 0)],
        ["Total costo variable unitario", formatSoles(deriv.costoVariableUnitario)],
      ]
    ),
    p(`Inversión inicial:`, { bold: true }),
    buildTable(
      ["Concepto", "Monto (S/)"],
      [
        ["Equipos", formatSoles(data.inversionEquipos)],
        ["Mobiliario", formatSoles(data.inversionMobiliario)],
        ["Capital de trabajo", formatSoles(data.inversionCapitalTrabajo)],
        ["Trámites y licencias", formatSoles(data.inversionTramites ?? 0)],
        ["Total inversión inicial", formatSoles(deriv.inversionTotal)],
      ]
    ),
  ];

  // Pro-only: gráfico circular con la distribución de la inversión inicial.
  if (isPro) {
    const piePng = await renderInversionInicialChart({
      equipos: data.inversionEquipos,
      mobiliario: data.inversionMobiliario,
      capitalTrabajo: data.inversionCapitalTrabajo,
      tramites: data.inversionTramites ?? 0,
    });
    estructuraCostos.push(chartParagraph(piePng));
    estructuraCostos.push(
      caption(
        `Figura 1. Distribución porcentual de la inversión inicial requerida (total: ${formatSoles(deriv.inversionTotal)}).`
      )
    );
  }

  // 6. PUNTO DE EQUILIBRIO
  const puntoEquilibrio: (Paragraph | Table)[] = [
    heading("5. Punto de equilibrio"),
    p(
      `Con un precio de venta de ${formatSoles(data.precioVenta)} y un costo variable unitario de ${formatSoles(deriv.costoVariableUnitario)}, el margen de contribución unitario es de ${formatSoles(deriv.margenContribucionUnitario)} (${formatPct(deriv.margenContribucionPct)}).`
    ),
    buildTable(
      ["Indicador", "Valor"],
      [
        ["Costos fijos mensuales", formatSoles(deriv.costosFijosMensuales)],
        ["Costo variable unitario", formatSoles(deriv.costoVariableUnitario)],
        ["Costo unitario a volumen operativo (mes 1)", costoUnitarioVolumenOperativo !== null ? formatSoles(costoUnitarioVolumenOperativo) : "—"],
        ["Margen de contribución unitario", formatSoles(deriv.margenContribucionUnitario)],
        ["Margen de contribución %", formatPct(deriv.margenContribucionPct)],
        ["Punto de equilibrio (unidades/mes)", formatInt(deriv.puntoEquilibrioUnidades)],
        ["Punto de equilibrio (S/ ventas/mes)", formatSoles(deriv.puntoEquilibrioSoles)],
      ]
    ),
    p(
      "Costo unitario a volumen operativo calculado asignando los costos fijos mensuales sobre las ventas estimadas para el primer mes de operación.",
      { italics: true, size: 18, color: COLOR_MUTED }
    ),
    p(
      deriv.puntoEquilibrioUnidades > 0
        ? `El negocio alcanza su punto de equilibrio cuando vende ${formatInt(deriv.puntoEquilibrioUnidades)} unidades al mes, equivalentes a ${formatSoles(deriv.puntoEquilibrioSoles)} en ventas mensuales.`
        : `Con los valores actuales no se alcanza punto de equilibrio (margen no positivo).`
    ),
  ];

  // 7. FLUJO DE CAJA 12 MESES
  const flujoCaja: (Paragraph | Table)[] = [
    heading("6. Flujo de caja proyectado a 12 meses"),
    p(
      `Supuestos: ventas mes 1 = ${formatInt(data.ventasMes1)} und, crecimiento mensual = ${formatPct(data.crecimientoMensualPct / 100)}, precio = ${formatSoles(data.precioVenta)}.`
    ),
    buildTable(
      [
        "Mes",
        "Unidades",
        "Ingresos",
        "Costos totales",
        "Utilidad mensual",
        "Utilidad acumulada",
      ],
      flujo.map((r) => [
        `Mes ${r.mes}`,
        formatInt(r.unidades),
        formatSoles(r.ingresos),
        formatSoles(r.costosTotales),
        formatSoles(r.utilidadMensual),
        formatSoles(r.utilidadAcumulada),
      ])
    ),
  ];

  // Pro-only: gráficos de barras (ventas por mes) y línea (utilidad acumulada).
  if (isPro) {
    const [barPng, linePng] = await Promise.all([
      renderVentas12MesesChart(flujo),
      renderUtilidadAcumuladaChart(flujo),
    ]);
    flujoCaja.push(chartParagraph(barPng));
    flujoCaja.push(
      caption(
        `Figura 2. Ventas proyectadas en unidades para los próximos 12 meses (crecimiento mensual ${formatPct(data.crecimientoMensualPct / 100)}).`
      )
    );
    flujoCaja.push(chartParagraph(linePng));
    flujoCaja.push(
      caption(
        `Figura 3. Utilidad acumulada en soles durante los 12 meses proyectados. Línea base 0 = punto de equilibrio acumulado.`
      )
    );
  }

  if (variante === "credito") {
    const mesesBreakEven =
      flujo.findIndex((r) => r.utilidadAcumulada >= 0 && r.utilidadMensual > 0);
    flujoCaja.push(
      p(
        `Análisis de capacidad de pago: con la proyección actual, ${
          mesesBreakEven >= 0
            ? `el negocio alcanza utilidad acumulada positiva alrededor del mes ${mesesBreakEven + 1}.`
            : `el negocio aún no recupera la inversión inicial en el horizonte de 12 meses.`
        } El flujo de caja mensual positivo permite atender cuotas de microcrédito regulares.`,
        { color: COLOR_PRIMARY }
      )
    );
  }

  // 8. PLAN DE FINANCIAMIENTO
  const usos = data.usosFinanciamiento.length > 0 ? data.usosFinanciamiento.join(", ") : "—";
  const financiamiento: (Paragraph | Table)[] = [
    heading("7. Plan de financiamiento solicitado"),
    p(`Monto solicitado: ${formatSoles(data.montoSolicitado)}`, { bold: true }),
    p(`Capital propio disponible: ${formatSoles(data.capitalPropio)}`, { bold: true }),
    p(`Uso del financiamiento: ${usos}`),
    p(`Inversión total requerida: ${formatSoles(deriv.inversionTotal)}`),
    p(
      deriv.inversionTotal > 0
        ? `El monto solicitado representa el ${formatPct(
            data.montoSolicitado / Math.max(1, deriv.inversionTotal)
          )} de la inversión total estimada; el resto se cubre con capital propio y otras fuentes.`
        : `—`
    ),
  ];

  // 9. RIESGOS Y MITIGACIÓN (Pro-only)
  const riesgos: (Paragraph | Table)[] = isPro
    ? [
        heading("9. Riesgos y mitigación"),
        p(
          `Identificamos los principales riesgos del negocio "${data.nombreNegocio}" (rubro ${data.rubro}) y una mitigación concreta para cada uno. Los dos últimos son riesgos comunes a cualquier pyme.`,
          { italics: true, color: COLOR_MUTED }
        ),
        buildTable(
          ["Riesgo", "Mitigación"],
          riesgosParaPlan(data).map((r) => [r.riesgo, r.mitigacion])
        ),
      ]
    : [];

  // 10. CONCLUSIONES (número dinámico: 8 en free, 10 en Pro)
  const numConclusiones = isPro ? "10" : "8";
  const conclusiones: (Paragraph | Table)[] = [heading(`${numConclusiones}. Conclusiones`)];
  if (variante === "innovacion") {
    conclusiones.push(
      p(
        `El proyecto "${data.nombreNegocio}" presenta una propuesta de valor diferenciada en el sector ${data.rubro} con potencial de escalabilidad.`
      ),
      p(
        `La inversión inicial de ${formatSoles(deriv.inversionTotal)} es razonable frente al tamaño de mercado (${formatInt(data.clientesPotenciales)} clientes potenciales).`
      ),
      p(
        `El modelo puede expandirse a otras regiones, diversificar canales y aprovechar herramientas digitales para acelerar el crecimiento.`
      )
    );
  } else if (variante === "credito") {
    conclusiones.push(
      p(
        `El negocio "${data.nombreNegocio}" demuestra una estructura de costos clara y un margen de contribución de ${formatPct(deriv.margenContribucionPct)}.`
      ),
      p(
        `El punto de equilibrio se alcanza vendiendo ${formatInt(deriv.puntoEquilibrioUnidades)} unidades al mes, lo que respalda la capacidad de pago del crédito solicitado.`
      ),
      p(
        `El flujo de caja proyectado permite atender las obligaciones del microcrédito con margen de seguridad.`
      )
    );
  } else {
    conclusiones.push(
      p(
        `El plan de negocio "${data.nombreNegocio}" está listo para ser utilizado en la postulación seleccionada.`
      ),
      p(
        `Resumen financiero: inversión ${formatSoles(deriv.inversionTotal)}, costo variable unitario ${formatSoles(deriv.costoVariableUnitario)}, precio ${formatSoles(data.precioVenta)}.`
      )
    );
  }

  const footer = isFree
    ? new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: MARCA_FREE,
                italics: true,
                size: 18,
                color: COLOR_WARN,
                font: "Calibri",
              }),
            ],
          }),
        ],
      })
    : undefined;

  const doc = new Document({
    creator: "Plenvo",
    title: `Plan de negocio — ${data.nombreNegocio}`,
    description: `Plan generado el ${fecha} para ${data.postulacion}`,
    sections: [
      {
        properties: {},
        footers: footer ? { default: footer } : undefined,
        children: [
          ...caratula,
          ...resumenEjecutivo,
          ...descripcionNegocio,
          ...analisisMercado,
          ...estructuraCostos,
          ...puntoEquilibrio,
          ...flujoCaja,
          ...financiamiento,
          ...riesgos,
          ...conclusiones,
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
};