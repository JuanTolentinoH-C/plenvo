"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DownloadState =
  | { kind: "approved"; pid: string; paymentId: string }
  | { kind: "pending"; pid: string; paymentId: string | null }
  | { kind: "failure"; pid: string | null }
  | { kind: "invalid" }
  | { kind: "server_error" }
  | { kind: "downloading"; pid: string; paymentId: string }
  | { kind: "download_error"; message: string }
  | { kind: "download_ok"; pid: string; paymentId: string };

/**
 * Página a la que MP redirige tras el checkout.
 *
 * Lee los query params que pasamos desde /api/payment-callback:
 *   - status: approved | pending | failure | invalid | server_error
 *   - pid: preference_id
 *   - payment_id: id del pago aprobado
 *
 * Si status === "approved", dispara la descarga del .docx Pro
 * apuntando a /api/download-pro?pid=...&payment_id=...
 * El endpoint ya valida contra la API de MP y sirve el archivo
 * con Content-Disposition: attachment, así que el navegador lo
 * descarga sin que tengamos que manejar un blob en cliente.
 */
export function DescargaExitosaClient() {
  const [state, setState] = useState<DownloadState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const pid = params.get("pid");
    const paymentId = params.get("payment_id");

    let next: DownloadState;
    if (status === "approved" && pid && paymentId) {
      next = { kind: "approved", pid, paymentId };
    } else if (status === "pending" && pid) {
      next = { kind: "pending", pid, paymentId };
    } else if (status === "failure") {
      next = { kind: "failure", pid };
    } else {
      next = { kind: "invalid" };
    }
    setState(next);
  }, []);

  // Disparamos la descarga automáticamente cuando el estado es "approved".
  useEffect(() => {
    if (!state || state.kind !== "approved") return;
    const downloadUrl = `/api/download-pro?pid=${encodeURIComponent(
      state.pid
    )}&payment_id=${encodeURIComponent(state.paymentId)}`;

    setState({ kind: "downloading", pid: state.pid, paymentId: state.paymentId });

    // Forzamos la descarga con un <a> temporal: respeta el header
    // Content-Disposition y no abre una pestaña nueva.
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Damos tiempo a que el navegador inicie la descarga antes de
    // mostrar el mensaje de éxito.
    const t = window.setTimeout(() => {
      setState({ kind: "download_ok", pid: state.pid, paymentId: state.paymentId });
    }, 1500);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10">
      <div className="max-w-xl w-full rounded-2xl bg-white border border-plenvo-gray-300 shadow-plenvo-md p-6 sm:p-8 text-center">
        <Header state={state} />
        <Body state={state} />
        <Footer state={state} />
      </div>
    </main>
  );
}

function Header({ state }: { state: DownloadState | null }) {
  const kind = state?.kind;
  let icon: React.ReactNode = null;
  let title = "Procesando tu pago…";

  if (kind === "approved" || kind === "downloading" || kind === "download_ok") {
    icon = (
      <span className="inline-flex w-12 h-12 rounded-full plenvo-gradient-bg text-white items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="m5 12 4 4L19 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
    title =
      kind === "download_ok" ? "¡Tu Plan Pro está listo!" : "¡Pago aprobado!";
  } else if (kind === "pending") {
    icon = (
      <span className="inline-flex w-12 h-12 rounded-full bg-amber-100 text-amber-700 items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7v5l3 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
    title = "Pago pendiente de confirmación";
  } else if (kind === "failure") {
    icon = (
      <span className="inline-flex w-12 h-12 rounded-full bg-red-100 text-red-700 items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M6 18 18 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
    title = "El pago no se completó";
  } else if (kind === "download_error") {
    icon = (
      <span className="inline-flex w-12 h-12 rounded-full bg-amber-100 text-amber-700 items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
    title = "No pudimos iniciar la descarga";
  } else if (kind === "invalid" || kind === "server_error") {
    icon = (
      <span className="inline-flex w-12 h-12 rounded-full bg-plenvo-gray-100 text-plenvo-gray items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    );
    title = "Enlace inválido";
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {icon}
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-plenvo-gray">
        {title}
      </h1>
    </div>
  );
}

function Body({ state }: { state: DownloadState | null }) {
  if (!state) {
    return (
      <p className="mt-4 text-sm text-plenvo-gray-500">
        Espera un momento, estamos validando tu pago con Mercado Pago…
      </p>
    );
  }

  if (state.kind === "approved" || state.kind === "downloading") {
    return (
      <p className="mt-4 text-sm text-plenvo-gray-500 leading-relaxed">
        Estamos preparando tu documento Pro (sin marca de agua, con gráficos y
        sección de riesgos). La descarga debería comenzar en unos segundos.
      </p>
    );
  }

  if (state.kind === "download_ok") {
    return (
      <p className="mt-4 text-sm text-plenvo-gray-500 leading-relaxed">
        Si la descarga no comenzó, usa el botón de abajo. Tu plan está
        disponible por unos minutos; si expira, vuelve a completar el wizard.
      </p>
    );
  }

  if (state.kind === "pending") {
    return (
      <p className="mt-4 text-sm text-plenvo-gray-500 leading-relaxed">
        Tu pago está en revisión. Te enviaremos un correo cuando se confirme.
        En cuanto se apruebe, regenera tu plan desde el wizard para descargar
        la versión Pro.
      </p>
    );
  }

  if (state.kind === "failure") {
    return (
      <p className="mt-4 text-sm text-plenvo-gray-500 leading-relaxed">
        No se procesó el pago. Puedes volver al wizard y volver a intentarlo,
        o seguir con la versión gratuita.
      </p>
    );
  }

  if (state.kind === "download_error") {
    return (
      <p
        role="alert"
        className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3"
      >
        {state.message}
      </p>
    );
  }

  return (
    <p className="mt-4 text-sm text-plenvo-gray-500 leading-relaxed">
      {state.kind === "server_error"
        ? "Ocurrió un error verificando tu pago. Inténtalo de nuevo en unos minutos."
        : "Esta URL no es válida. Vuelve al wizard para continuar."}
    </p>
  );
}

function Footer({ state }: { state: DownloadState | null }) {
  const downloadHref =
    state?.kind === "download_ok"
      ? `/api/download-pro?pid=${encodeURIComponent(
          state.pid
        )}&payment_id=${encodeURIComponent(state.paymentId)}`
      : null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      {downloadHref ? (
        <a
          href={downloadHref}
          className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold text-white plenvo-gradient-bg shadow-plenvo-sm hover:opacity-95"
        >
          Descargar de nuevo
        </a>
      ) : null}

      <Link
        href="/wizard"
        className="inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold border border-plenvo-gray-300 text-plenvo-gray bg-white hover:bg-plenvo-gray-50"
      >
        Volver al wizard
      </Link>
    </div>
  );
}
