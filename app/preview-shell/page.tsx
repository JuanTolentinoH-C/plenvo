/**
 * Página de inspección visual — renderiza SOLO el header (en sus 3 estados:
 * arriba, con scroll = blur) y el footer, sin el resto de la landing.
 * Útil para validar tamaños y contraste sin hacer scroll.
 *
 * Para verla: http://localhost:3000/preview-shell
 */

import Link from "next/link";

export default function PreviewShellPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ───────── HEADER (top-of-page = sin blur) ───────── */}
      <header className="border-b border-plenvo-gray-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0" aria-label="Plenvo">
            {/*
              Usamos <img> aquí solo para esta página de inspección, evitando la
              optimización de Next (que requiere width/height en PNG). Las clases
              controlan exactamente lo que necesitamos.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/horizontal-azul.png"
              alt="Plenvo"
              className="h-11 sm:h-12 md:h-14 w-auto"
              style={{ imageRendering: "auto" }}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <span className="text-sm font-medium text-plenvo-gray">Cómo funciona</span>
            <span className="text-sm font-medium text-plenvo-gray">Beneficios</span>
            <span className="text-sm font-medium text-plenvo-gray">Casos de uso</span>
            <span className="text-sm font-medium text-plenvo-gray">FAQ</span>
          </nav>
          <Link
            href="/wizard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg shadow-plenvo-sm"
          >
            Crear mi plan
          </Link>
        </div>
        <p className="bg-amber-50 text-amber-800 text-[11px] font-medium text-center py-1.5 border-t border-amber-200">
          Estado 1 · Header sticky, top-of-page (sin scroll, fondo blanco sólido)
        </p>
      </header>

      {/* ───────── HEADER (scrolled = con nav-blur) ───────── */}
      <header className="sticky top-0 z-40 mt-10 nav-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center shrink-0" aria-label="Plenvo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/horizontal-azul.png"
              alt="Plenvo"
              className="h-11 sm:h-12 md:h-14 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <span className="text-sm font-medium text-plenvo-gray">Cómo funciona</span>
            <span className="text-sm font-medium text-plenvo-gray">Beneficios</span>
            <span className="text-sm font-medium text-plenvo-gray">Casos de uso</span>
            <span className="text-sm font-medium text-plenvo-gray">FAQ</span>
          </nav>
          <Link
            href="/wizard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg shadow-plenvo-sm"
          >
            Crear mi plan
          </Link>
        </div>
        <p className="bg-amber-50 text-amber-800 text-[11px] font-medium text-center py-1.5 border-t border-amber-200">
          Estado 2 · Header con scroll (efecto blur + saturación)
        </p>
      </header>

      {/* spacer para emular contenido entre los dos headers */}
      <div className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 py-16 text-plenvo-gray">
        <h1 className="text-2xl font-semibold">Vista previa aislada de chrome</h1>
        <p className="mt-2 text-plenvo-gray-500 leading-relaxed max-w-2xl">
          Esta página existe sólo para inspeccionar el header (en sus dos
          estados) y el footer sin distracciones. Hacé scroll para ver la
          transición de blur en el header pegajoso.
        </p>
      </div>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-plenvo-blue text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-10">
            <div className="sm:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/horizontal-blanco.png"
                alt="Plenvo · Business Studio"
                className="h-16 sm:h-20 w-auto"
              />
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-plenvo-gray-100/90 max-w-sm">
                Business Studio para emprendedores peruanos. Convierte tu idea
                en un negocio financiable.
              </p>
            </div>
            <div className="sm:col-span-3">
              <p className="text-xs uppercase tracking-wider text-white/60 font-bold">
                Producto
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Beneficios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Crear mi plan
                  </a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-4">
              <p className="text-xs uppercase tracking-wider text-white/60 font-bold">
                Legal
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-plenvo-gray-100 hover:text-white">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
            <span>© {new Date().getFullYear()} Plenvo · Business Studio. Hecho en Perú.</span>
            <span>v0.1 · Early access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
