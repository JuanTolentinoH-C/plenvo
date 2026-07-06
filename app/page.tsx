import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { DocumentMockup } from "@/components/marketing/DocumentMockup";
import { FinanceMockup } from "@/components/marketing/FinanceMockup";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Reveal } from "@/components/marketing/Reveal";

// ───────── Datos de la página ─────────
const TRUST_BADGES = [
  "Formato alineado a Startup Perú e Innóvate Perú",
  "Cálculos financieros validados (punto de equilibrio, flujo de caja, margen de contribución)",
  "Documento Word listo para descargar e imprimir",
  "100% gratis para crear tu primer plan",
];

const TIMELINE = [
  {
    n: "01",
    title: "Describe tu idea",
    desc: "Cuéntanos tu negocio en 6 pasos cortos: idea, mercado, costos y proyecciones.",
  },
  {
    n: "02",
    title: "Completa datos financieros",
    desc: "Ingresa costos fijos, variables e inversión inicial. No necesitas ser contador.",
  },
  {
    n: "03",
    title: "Plenvo calcula automáticamente",
    desc: "Punto de equilibrio, flujo de caja a 12 meses y margen de contribución al instante.",
  },
  {
    n: "04",
    title: "Descarga tu documento profesional",
    desc: ".docx formateado, listo para postular o presentar a una entidad financiera.",
  },
];

const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Plan de negocio profesional",
    desc: "Estructura formal con resumen ejecutivo, mercado, operaciones y financiamiento.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Proyecciones financieras automáticas",
    desc: "Flujo de caja a 12 meses con crecimiento mensual configurable y gráficos.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 4 6v6c0 4.5 3.4 8.7 8 10 4.6-1.3 8-5.5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2.2 2.2L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Documento listo para Startup Perú",
    desc: "Formato alineado a los requisitos de Startup Perú e Innóvate Perú.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12h4l2-7 4 14 2-7h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Flujo de caja y punto de equilibrio",
    desc: "Sabe exactamente cuántas unidades debes vender al mes para no perder dinero.",
  },
];

const USE_CASES = [
  {
    title: "Emprendedores",
    desc: "Personas con una idea que necesitan un plan claro y presentable.",
    icon: "🚀",
  },
  {
    title: "Startup Perú",
    desc: "Formato alineado a los requisitos de la convocatoria de Startup Perú.",
    icon: "📄",
  },
  {
    title: "Microcréditos",
    desc: "Documento listo para presentar a entidades financieras y cooperativas.",
    icon: "💳",
  },
  {
    title: "Inversionistas",
    desc: "Proyecciones serias para conversaciones con ángeles o fondos.",
    icon: "📈",
  },
  {
    title: "Expansión de negocios",
    desc: "Negocios en marcha que buscan abrir una nueva sede o línea.",
    icon: "🌱",
  },
];

const FAQ_ITEMS = [
  {
    q: "¿Esto sirve para postular a Startup Perú?",
    a: (
      <>
        Sí. El documento generado sigue la estructura solicitada por las
        convocatorias: resumen ejecutivo, problema, solución, mercado,
        operaciones, costos y financiamiento. Puedes editarlo en Word antes de
        enviarlo.
      </>
    ),
  },
  {
    q: "¿Necesito saber de finanzas para usarlo?",
    a: (
      <>
        No. El wizard te pide los datos en lenguaje simple (alquiler, sueldos,
        precio de venta, etc.) y Plenvo calcula por ti el punto de equilibrio,
        el margen de contribución y el flujo de caja a 12 meses.
      </>
    ),
  },
  {
    q: "¿Cuánto cuesta?",
    a: (
      <>
        Crear tu primer plan es <strong>gratis</strong>. Si más adelante
        lanzamos versiones con funciones extra (proyecciones a 3 años, plan
        Pro, etc.), lo avisaremos con tiempo y nunca cobraremos sin tu
        consentimiento.
      </>
    ),
  },
  {
    q: "¿Mis datos quedan guardados en algún lugar?",
    a: (
      <>
        Tus datos se guardan únicamente en tu navegador (localStorage) mientras
        completas el wizard. No pedimos registro ni enviamos tu información a
        ningún servidor externo. El documento final se genera y descarga en
        tu propio equipo.
      </>
    ),
  },
  {
    q: "¿Puedo editar el documento después de descargarlo?",
    a: (
      <>
        Sí. El archivo entregado es un .docx estándar de Microsoft Word, así
        que puedes abrirlo en Word, Google Docs o LibreOffice y modificar lo
        que necesites.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="flex-1">
        {/* ==========================
            HERO
           ========================== */}
        <section className="relative overflow-hidden">
          {/* Blobs decorativos */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] rounded-full plenvo-gradient-soft-bg blur-3xl animate-blob" />
            <div
              className="absolute bottom-[-20%] right-[-10%] w-[520px] h-[520px] rounded-full plenvo-gradient-soft-bg blur-3xl animate-blob"
              style={{ animationDelay: "4s" }}
            />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Copy */}
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plenvo-gray-100 text-plenvo-blue text-xs font-semibold">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full plenvo-gradient-bg" />
                  Nuevo · Business Studio para emprendedores peruanos
                </span>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-plenvo-gray leading-[1.05]">
                  Convierte tu idea en{" "}
                  <span className="plenvo-gradient-text">un negocio financiable</span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-plenvo-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Responde 6 preguntas y genera automáticamente un{" "}
                  <strong className="text-plenvo-gray">plan de negocio profesional</strong>{" "}
                  listo para Startup Perú, Innóvate Perú, inversionistas o entidades
                  financieras.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-start justify-center">
                  <Link href="/wizard" className="w-full sm:w-auto">
                    <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 rounded-lg text-base font-semibold text-white plenvo-gradient-bg shadow-plenvo-md hover:shadow-plenvo-lg hover:opacity-95 active:opacity-90 transition-all">
                      Generar mi plan gratis
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                  <a href="#preview" className="w-full sm:w-auto">
                    <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 rounded-lg text-base font-semibold border border-plenvo-gray-300 text-plenvo-gray bg-white hover:bg-plenvo-gray-50 transition-colors">
                      Ver ejemplo
                    </span>
                  </a>
                </div>

                <p className="mt-4 text-xs text-plenvo-gray-500">
                  Sin registro · Sin tarjeta · Listo en menos de 15 minutos
                </p>
              </div>

              {/* Mockup */}
              <div className="relative">
                <div className="relative">
                  <DocumentMockup />
                  <div className="hidden sm:block absolute -bottom-10 -left-10 w-[88%]">
                    <FinanceMockup />
                  </div>
                </div>

                {/* Glow ring decorativo */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 -z-10 rounded-[40px] plenvo-gradient-soft-bg blur-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================
            TRUST (sin cifras falsas)
           ========================== */}
        <section className="bg-plenvo-gray-50 border-y border-plenvo-gray-300">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-semibold text-plenvo-gray tracking-tight">
                  Construido con cuidado para tu postulación
                </h2>
                <p className="mt-3 text-plenvo-gray-500 leading-relaxed">
                  Plenvo no es una plantilla más: está diseñado alrededor de lo
                  que las convocatorias y entidades financieras evalúan.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TRUST_BADGES.map((t) => (
                  <li
                    key={t}
                    className="rounded-2xl bg-white border border-plenvo-gray-300 p-5 shadow-plenvo-xs hover-lift hover-lift-active"
                  >
                    <div className="w-9 h-9 rounded-lg plenvo-gradient-bg flex items-center justify-center shadow-plenvo-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="m5 12 4 4L19 6"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-medium text-plenvo-gray leading-relaxed">
                      {t}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ==========================
            CÓMO FUNCIONA (timeline 4 pasos)
           ========================== */}
        <section id="como-funciona" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-plenvo-blue/10 text-plenvo-blue text-xs font-semibold uppercase tracking-wider">
                  Cómo funciona
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-plenvo-gray tracking-tight">
                  De tu idea a un documento descargable en minutos
                </h2>
                <p className="mt-3 text-plenvo-gray-500 leading-relaxed">
                  Sin conocimiento técnico, sin hojas de cálculo complejas.
                </p>
              </div>
            </Reveal>

            <ol className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {TIMELINE.map((step, i) => (
                <Reveal key={step.n} delay={i * 80}>
                  <li className="relative bg-white border border-plenvo-gray-300 rounded-2xl p-6 hover-lift hover-lift-active shadow-plenvo-xs h-full">
                    <span className="text-xs font-bold text-plenvo-blue-2 tracking-widest">
                      PASO {step.n}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-plenvo-gray">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-plenvo-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                    {/* línea conectora (oculta en mobile y en el último) */}
                    {i < TIMELINE.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="hidden lg:block absolute top-12 -right-3 w-6 h-px bg-plenvo-gray-300"
                      />
                    ) : null}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ==========================
            BENEFICIOS
           ========================== */}
        <section
          id="beneficios"
          className="bg-plenvo-gray-50 border-y border-plenvo-gray-300 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-plenvo-green text-xs font-semibold uppercase tracking-wider shadow-plenvo-xs">
                  Beneficios
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-plenvo-gray tracking-tight">
                  Todo lo que necesitas en un solo lugar
                </h2>
                <p className="mt-3 text-plenvo-gray-500 leading-relaxed">
                  Sin empezar de cero en Word, sin pelearte con fórmulas.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 60}>
                  <article className="group bg-white border border-plenvo-gray-300 rounded-2xl p-6 shadow-plenvo-xs hover-lift hover-lift-active h-full">
                    <div className="w-11 h-11 rounded-xl plenvo-gradient-soft-bg text-plenvo-blue flex items-center justify-center group-hover:text-plenvo-blue-2 transition-colors">
                      <span className="w-5 h-5 block">{b.icon}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-plenvo-gray">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm text-plenvo-gray-500 leading-relaxed">
                      {b.desc}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================
            VISTA PREVIA DEL RESULTADO
           ========================== */}
        <section id="preview" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-plenvo-blue/10 text-plenvo-blue text-xs font-semibold uppercase tracking-wider">
                  Vista previa
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-plenvo-gray tracking-tight">
                  Así luce tu plan final
                </h2>
                <p className="mt-3 text-plenvo-gray-500 leading-relaxed">
                  Estructura profesional, secciones claras, tablas y gráficos
                  listos para imprimir.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-12 grid lg:grid-cols-5 gap-6">
                {/* Documento grande */}
                <div className="lg:col-span-3">
                  <DocumentMockup />
                </div>

                {/* Lista de secciones + proyección */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                  <div className="rounded-2xl bg-white border border-plenvo-gray-300 p-6 shadow-plenvo-xs">
                    <p className="text-xs uppercase tracking-wider text-plenvo-gray-500 font-bold">
                      El documento incluye
                    </p>
                    <ul className="mt-4 space-y-3">
                      {[
                        "Resumen ejecutivo",
                        "Flujo de caja a 12 meses",
                        "Punto de equilibrio",
                        "Inversión requerida",
                        "Gráficos financieros",
                      ].map((t, i) => (
                        <li key={t} className="flex items-start gap-3">
                          <span className="shrink-0 w-6 h-6 rounded-md plenvo-gradient-bg text-white text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-sm text-plenvo-gray font-medium pt-0.5">
                            {t}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <FinanceMockup />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==========================
            CASOS DE USO
           ========================== */}
        <section
          id="casos-de-uso"
          className="bg-plenvo-gray-50 border-y border-plenvo-gray-300 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-plenvo-blue text-xs font-semibold uppercase tracking-wider shadow-plenvo-xs">
                  Casos de uso
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-plenvo-gray tracking-tight">
                  Pensado para distintos momentos
                </h2>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {USE_CASES.map((c) => (
                  <li
                    key={c.title}
                    className="bg-white border border-plenvo-gray-300 rounded-2xl p-5 shadow-plenvo-xs hover-lift hover-lift-active h-full"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {c.icon}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-plenvo-gray">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs text-plenvo-gray-500 leading-relaxed">
                      {c.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ==========================
            PRÓXIMAMENTE / EARLY ACCESS
           ========================== */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal>
              <div className="rounded-3xl border border-plenvo-gray-300 bg-white p-8 sm:p-12 shadow-plenvo-sm relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute -top-20 -right-20 w-72 h-72 rounded-full plenvo-gradient-soft-bg blur-3xl"
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plenvo-gray-100 text-plenvo-gray text-xs font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full plenvo-gradient-bg animate-pulse-slow" />
                    Próximamente
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-plenvo-gray tracking-tight max-w-2xl">
                    Estamos construyendo Plenvo junto a los primeros
                    emprendedores peruanos que lo están probando.
                  </h2>
                  <p className="mt-3 text-plenvo-gray-500 leading-relaxed max-w-2xl">
                    Sé uno de los primeros en usarlo. Tus comentarios y casos
                    reales nos ayudan a mejorar el producto cada semana.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/wizard">
                      <span className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg shadow-plenvo-sm hover:opacity-95">
                        Probar Plenvo ahora
                      </span>
                    </Link>
                    <a
                      href="mailto:hola@plenvo.pe"
                      className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold border border-plenvo-gray-300 text-plenvo-gray bg-white hover:bg-plenvo-gray-50"
                    >
                      Escribir al equipo
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==========================
            FAQ
           ========================== */}
        <section id="faq" className="bg-plenvo-gray-50 border-y border-plenvo-gray-300 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-plenvo-blue text-xs font-semibold uppercase tracking-wider shadow-plenvo-xs">
                  Preguntas frecuentes
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-plenvo-gray tracking-tight">
                  Resolvemos tus dudas
                </h2>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-10">
                <FaqAccordion items={FAQ_ITEMS} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==========================
            CTA FINAL
           ========================== */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl plenvo-gradient-bg px-6 py-14 sm:px-12 sm:py-20 text-center shadow-plenvo-xl">
                {/* grain decorativo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-overlay opacity-30 bg-grid"
                />

                <div className="relative">
                  <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                    Tu plan de negocio listo
                    <br className="hidden sm:block" /> en menos de 15 minutos
                  </h2>
                  <p className="mt-4 text-white/85 max-w-xl mx-auto leading-relaxed">
                    Empieza gratis, descarga tu .docx y úsalo donde lo
                    necesites.
                  </p>
                  <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/wizard">
                      <span className="inline-flex items-center justify-center h-12 px-7 rounded-lg text-base font-semibold bg-white text-plenvo-blue hover:bg-plenvo-gray-100 shadow-plenvo-md transition-colors">
                        Comenzar ahora
                      </span>
                    </Link>
                  </div>
                  <p className="mt-3 text-xs text-white/75">
                    Sin registro · Sin tarjeta · 100% gratis para tu primer plan
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ==========================
          FOOTER
         ========================== */}
      <footer className="bg-plenvo-blue text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-10">
            {/* Logo + desc */}
            <div className="sm:col-span-5">
              <Image
                src="/logo/horizontal-blanco.png"
                alt="Plenvo · Business Studio"
                width={1200}
                height={675}
                className="h-16 sm:h-20 w-auto"
                sizes="(min-width: 640px) 320px, 220px"
              />
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-plenvo-gray-100/90 max-w-sm">
                Business Studio para emprendedores peruanos. Convierte tu idea
                en un negocio financiable.
              </p>
            </div>

            {/* Producto */}
            <div className="sm:col-span-3">
              <p className="text-xs uppercase tracking-wider text-white/60 font-bold">
                Producto
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#como-funciona"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#beneficios"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Beneficios
                  </a>
                </li>
                <li>
                  <Link
                    href="/wizard"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Crear mi plan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="sm:col-span-4">
              <p className="text-xs uppercase tracking-wider text-white/60 font-bold">
                Legal
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hola@plenvo.pe"
                    className="text-plenvo-gray-100 hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
            <span>
              © {new Date().getFullYear()} Plenvo · Business Studio. Hecho en Perú.
            </span>
            <span>v0.1 · Early access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
