// Módulo puro: genera la lista de riesgos y mitigaciones según el rubro.
//
// Estructura del documento (Sprint 3, isPro = true):
//   - Sección 9 "Riesgos y mitigación" con tabla de 2 columnas (Riesgo | Mitigación).
//   - 4 riesgos específicos del rubro (Paso 1) + 2 riesgos genéricos que
//     aplican a cualquier pyme.
//   - Si el rubro es "Otro" o no está en el diccionario, se usan los 4
//     riesgos del bucket "Otro".
//
// Este archivo NO toca `docx`: devuelve datos. La capa de presentación
// (`lib/docx/generatePlan.ts`) los convierte en `Table` + `Paragraph`.
//
// Cuando se active la API de Anthropic, este módulo se extenderá para
// personalizar riesgos según el `diferenciador` / `problema` / `solucion`
// del Paso 2 sin romper la API actual.
import type { PlanForm } from "@/lib/schemas";
import type { Rubro } from "@/lib/constants/rubros";

export type Riesgo = {
  riesgo: string;
  mitigacion: string;
};

/** 2 riesgos genéricos que aplican a cualquier pyme peruana. */
const RIESGOS_GENERICOS: ReadonlyArray<Riesgo> = [
  {
    riesgo: "Baja demanda inicial",
    mitigacion:
      "Validar el producto con una muestra pequeña antes del lanzamiento, ajustar precio y canales según feedback temprano y reforzar alianzas con clientes ancla.",
  },
  {
    riesgo: "Incremento de costos de insumos",
    mitigacion:
      "Mantener al menos dos proveedores alternativos por insumo crítico, negociar contratos a 3–6 meses y revisar mensualmente la estructura de costos variables.",
  },
];

/**
 * Diccionario base: 4 riesgos típicos por rubro.
 *
 * NOTA: las mitigaciones están escritas en tono genérico-aplicable para que
 * el emprendedor las adapte a su contexto (no prometen cifras mágicas).
 */
const RIESGOS_POR_RUBRO: Record<Rubro, ReadonlyArray<Riesgo>> = {
  Comercio: [
    {
      riesgo: "Alta rotación de inventario / mercancía varada",
      mitigacion:
        "Implementar control de stock semanal, priorizar productos de alta rotación y negociar devoluciones con proveedores para piezas de baja salida.",
    },
    {
      riesgo: "Competencia por precio en el entorno local",
      mitigacion:
        "Diferenciarse por servicio post-venta, fidelización (programa de puntos/descuentos) y exhibición; evitar guerras de precios que erosionan margen.",
    },
    {
      riesgo: "Dependencia de un solo proveedor",
      mitigacion:
        "Mantener un proveedor secundario evaluado para cada categoría crítica y exigir contratos simples que contemplen plazos y reemplazos.",
    },
    {
      riesgo: "Robo, mermas o pérdidas operativas",
      mitigacion:
        "Establecer protocolos de apertura/cierre, cámara CCTV básica, arqueos de caja diarios y seguro multirriesgo cuando el inventario lo justifique.",
    },
  ],
  Servicios: [
    {
      riesgo: "Dependencia de personal clave (cuello de botella humano)",
      mitigacion:
        "Documentar procesos, entrenar al menos a dos personas por función crítica y vincular al equipo con incentivos variables por resultados.",
    },
    {
      riesgo: "Cobranza morosa o clientes que no pagan a tiempo",
      mitigacion:
        "Política de pago adelantada o 50/50, contratos con cláusulas claras y software de facturación con recordatorios automáticos.",
    },
    {
      riesgo: "Estacionalidad de la demanda",
      mitigacion:
        "Diversificar cartera de clientes y servicios complementarios, y reservar caja para los meses bajos identificados en la proyección.",
    },
    {
      riesgo: "Reputación / mala calidad percibida del servicio",
      mitigacion:
        "Encuesta NPS al cliente, protocolo de respuesta a reclamos en <24h y registro público de casos resueltos.",
    },
  ],
  Manufactura: [
    {
      riesgo: "Fallas en maquinaria que paralizan la producción",
      mitigacion:
        "Mantenimiento preventivo programado, repuestos críticos en stock y contrato de soporte técnico del fabricante.",
    },
    {
      riesgo: "Variabilidad en la calidad de la materia prima",
      mitigacion:
        "Control de calidad al ingreso (muestreo), relación de largo plazo con proveedores certificados y rechazo documentado de lotes fuera de spec.",
    },
    {
      riesgo: "Accidentes laborales o incumplimientos de SST",
      mitigacion:
        "Implementar plan de seguridad y salud en el trabajo (SST), EPPs obligatorios y capacitaciones trimestrales; documentar todo para SUNAFIL.",
    },
    {
      riesgo: "Capacidad instalada insuficiente ante picos de demanda",
      mitigacion:
        "Plan de turnos extras y terceros subcontratados previamente validados; evitar comprar capacidad fija hasta validar volumen sostenido.",
    },
  ],
  Agro: [
    {
      riesgo: "Clima adverso (sequía, heladas, plagas)",
      mitigacion:
        "Diversificar cultivos/lotes, sistema de monitoreo agroclimático básico y seguro agrícola cuando esté disponible para el cultivo.",
    },
    {
      riesgo: "Volatilidad de precios en chacra",
      mitigacion:
        "Venta escalonada en lugar de cosecha única, contratos simples con acopiadores y exploración de canales cortos (ferias, venta directa).",
    },
    {
      riesgo: "Acceso a agua para riego",
      mitigacion:
        "Reservorio / sistema de riego tecnificado y, si aplica, trámite de licencia de uso de agua ante ANA con anticipación.",
    },
    {
      riesgo: "Plazos de cobranza a intermediarios",
      mitigacion:
        "Prefacturación al despacho, adelantos del 30–50% y, cuando sea posible, venta directa sin intermediarios para mejorar margen.",
    },
  ],
  Tecnología: [
    {
      riesgo: "Obsolescencia rápida del stack / producto",
      mitigacion:
        "Releases quincenales pequeñas, deuda técnica documentada y revisión trimestral del roadmap vs. tendencias del mercado.",
    },
    {
      riesgo: "Pérdida de datos o caídas del servicio",
      mitigacion:
        "Backups automatizados off-site (3-2-1), monitoreo con alertas y plan de recuperación ante desastres documentado y probado.",
    },
    {
      riesgo: "Dificultad para captar y retener talento técnico",
      mitigacion:
        "Trabajo remoto/híbrido, plan de carrera claro y participación en equity para perfiles clave cuando el tamaño lo permita.",
    },
    {
      riesgo: "Churn de clientes / baja adopción",
      mitigacion:
        "Onboarding estructurado, métricas de activación y un owner de éxito del cliente dedicado al feedback recurrente.",
    },
  ],
  Otro: [
    {
      riesgo: "Validación insuficiente del modelo de negocio",
      mitigacion:
        "Realizar entrevistas con al menos 10 potenciales clientes antes de invertir, y ajustar propuesta de valor con base en evidencia.",
    },
    {
      riesgo: "Subestimación del capital de trabajo inicial",
      mitigacion:
        "Proyectar flujo de caja conservador (sin ingresos los primeros 2–3 meses) y mantener una reserva de emergencia equivalente a 3 meses de costos fijos.",
    },
    {
      riesgo: "Dependencia del fundador (todo pasa por una persona)",
      mitigacion:
        "Documentar procedimientos operativos estándar desde el día 1 y delegar al menos 2 funciones críticas a colaboradores o socios.",
    },
    {
      riesgo: "Incumplimiento tributario o regulatorio",
      mitigacion:
        "Régimen tributario adecuado al tamaño, contador mensual desde el inicio y checklist de licencias / permisos del sector aplicables.",
    },
  ],
};

/**
 * Devuelve los 4 riesgos del rubro + 2 genéricos, en ese orden.
 * Si el rubro recibido no está en el diccionario, usa "Otro".
 */
export const riesgosParaPlan = (data: PlanForm): ReadonlyArray<Riesgo> => {
  const rubro: Rubro = (RUBRO_VALIDO.has(data.rubro) ? data.rubro : "Otro") as Rubro;
  const especificos = RIESGOS_POR_RUBRO[rubro];
  return [...especificos, ...RIESGOS_GENERICOS];
};

// Guard en runtime: por si el form trae un rubro futuro no listado.
const RUBRO_VALIDO: Set<string> = new Set([
  "Comercio",
  "Servicios",
  "Manufactura",
  "Agro",
  "Tecnología",
  "Otro",
]);