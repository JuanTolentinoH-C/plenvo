# Plenvo — Business Studio

Generador de planes de negocio profesionales para emprendedores peruanos, listo para postular a **Startup Perú**, **Innóvate Perú** o microcréditos bancarios.

## Estado

**Sprint 3 — Plan Pro (beta sin pago aún)**

✅ **Gráficos en el `.docx`** (solo `isPro: true`) usando `chartjs-node-canvas`:
  - Barras — ventas proyectadas por mes (12 meses, unidades)
  - Línea — utilidad acumulada por mes (12 meses, S/)
  - Circular (pie) — distribución de la inversión inicial
  - Barras + línea insertados en la sección "6. Flujo de caja"
  - Pie insertado en la sección "4. Estructura de costos"
✅ **Sección "9. Riesgos y mitigación"** (solo `isPro: true`) con tabla 2 columnas.
  4 riesgos según el rubro (Paso 1) + 2 riesgos genéricos. Conclusiones se renombra a sección 10.
✅ **Sin cambios visibles para el usuario gratuito** — el documento free es byte-idéntico al de Sprint 2 (sin gráficos, sin sección 9, marca de agua conservada).
✅ Código modular: `lib/docx/charts.ts` y `lib/docx/risks.ts` listos para extender cuando llegue la API de Anthropic.
✅ `serverExternalPackages` en `next.config.ts` para `chartjs-node-canvas`/`canvas`/`chart.js` (binding nativo).

⏳ **Pendiente (cuando se active el plan Pro real)**
- Integración de pago (Yape/Plin/Stripe).
- Quitar marca de agua cuando `isPro: true` (la lógica ya está lista).
- Análisis de mercado con IA (Anthropic) — stubs ya preparados en `charts.ts` y `risks.ts`.
- Historial de planes generados (Supabase o SQLite).

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **React Hook Form 7** + **Zod 4** (validación con schema compartido cliente/servidor)
- **`docx` 9** (solo en servidor vía `/api/generate-plan`)
- Despliegue pensado para **Vercel**

## Cómo correr

```bash
npm install   # solo la primera vez
npm run dev   # arranca en http://localhost:3000
```

Abre `http://localhost:3000`, haz clic en **"Comenzar mi plan gratis"**, llena los 6 pasos y descarga tu `.docx`.

Build de producción:

```bash
npm run build
npm start
```

## Estructura

```
app/
├── layout.tsx              Root layout, lang="es"
├── page.tsx                Landing con CTA a /wizard
├── wizard/page.tsx         Orquestador: FormProvider + localStorage + descarga
├── globals.css             Tailwind + tokens de color
└── api/
    └── generate-plan/
        └── route.ts        POST → devuelve .docx

components/
├── ui/                     Button, Field, Input, Select, Textarea, Checkbox,
│                           MoneyInput (prefijo S/), Section (totales)
└── wizard/                 ProgressBar, StepShell, Step1..Step6

lib/
├── schemas/                Zod: step1..step6 + planSchema (merge)
├── constants/              rubros, regiones, opciones (postulaciones, etapas, canales)
├── types.ts                EMPTY_DEFAULTS, STORAGE_KEY
├── finance/                Helpers puros: totales, derivaciones, proyección 12m, formateo
└── docx/
    ├── generatePlan.ts     buildPlanDoc() → 10 secciones en Pro / 8 en free, variantes, marca de agua
    ├── charts.ts           Render PNG con chartjs-node-canvas (Pro)
    └── risks.ts            Diccionario de riesgos por rubro + genéricos (Pro)
```

## Cómo probar el documento generado

```bash
npm run build && npm start
```

En otra terminal:

```bash
curl -X POST -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @payload.json \
  http://localhost:3000/api/generate-plan \
  -o plan.docx
file plan.docx
# → Microsoft Word 2007+
```

## Decisiones técnicas

- **Un solo `FormProvider`** en `app/wizard/page.tsx`. Cada step consume `useFormContext()`. Extender a nuevos pasos es agregar un schema y un componente, sin migración de estado.
- **Validación por step**: `trigger(fields)` antes de avanzar. `mode: 'onBlur'`.
- **`competidores` = un textarea con `\n`**, refin ≤3 en Zod.
- **Cálculos puros en `lib/finance`**: las mismas funciones que usa la UI en tiempo real se usan en el generador del .docx, garantizando que lo que el usuario ve es exactamente lo que se descarga.
- **Endpoint `/api/generate-plan`**: mantiene `docx` (~200KB) fuera del bundle del cliente.
- **Marca de agua**: footer centrado en cada página + línea visible en la carátula (la librería `docx` no soporta watermarks nativos de Word, pero la marca es legible y removable al pasar a Pro).

## Licencia

MVP privado. © 2026 Plenvo · Business Studio.