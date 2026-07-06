"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Casos de uso", href: "#casos-de-uso" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between gap-6">
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

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-plenvo-gray hover:text-plenvo-blue transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/wizard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg hover:opacity-95 active:opacity-90 shadow-plenvo-sm transition-all"
          >
            Crear mi plan
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-plenvo-gray-300 text-plenvo-gray"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-plenvo-gray-300 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-plenvo-gray py-2"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/wizard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg shadow-plenvo-sm"
            >
              Crear mi plan
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
