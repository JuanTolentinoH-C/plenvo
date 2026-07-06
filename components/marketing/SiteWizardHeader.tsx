import Link from "next/link";
import Image from "next/image";

/**
 * Header del wizard — consistente con la landing:
 * - Logo horizontal grande (mismo tratamiento visual que SiteHeader)
 * - Link sutil "← Volver al inicio" a la derecha
 * - Sticky con blur al hacer scroll (decorativo: no oculta el contenido
 *   debajo, el shell del wizard separa el header del formulario con su padding)
 * - Oculta el botón "Crear mi plan" de la landing porque ya estamos dentro
 */
export function SiteWizardHeader() {
  return (
    <header className="sticky top-0 z-40 nav-blur">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Plenvo — inicio"
        >
          <Image
            src="/logo/horizontal-azul.png"
            alt="Plenvo"
            width={1200}
            height={675}
            priority
            sizes="(min-width: 640px) 220px, 180px"
            className="h-11 sm:h-12 md:h-14 w-auto"
          />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-plenvo-gray-500 hover:text-plenvo-blue transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5m6-6-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="hidden sm:inline">Volver al inicio</span>
        </Link>
      </div>
    </header>
  );
}
