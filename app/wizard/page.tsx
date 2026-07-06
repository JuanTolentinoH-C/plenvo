"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSchema, TOTAL_STEPS } from "@/lib/schemas";
import type { PlanForm } from "@/lib/schemas";
import { EMPTY_DEFAULTS, STORAGE_KEY } from "@/lib/types";
import { SiteWizardHeader } from "@/components/marketing/SiteWizardHeader";
import { ProgressBar } from "@/components/wizard/ProgressBar";
import { Step1DatosGenerales } from "@/components/wizard/Step1DatosGenerales";
import { Step2ResumenEjecutivo } from "@/components/wizard/Step2ResumenEjecutivo";
import { Step3MercadoCompetencia } from "@/components/wizard/Step3MercadoCompetencia";
import { Step4EstructuraCostos } from "@/components/wizard/Step4EstructuraCostos";
import { Step5Proyeccion } from "@/components/wizard/Step5Proyeccion";
import { Step6Financiamiento } from "@/components/wizard/Step6Financiamiento";

export default function WizardPage() {
  const [step, setStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);
  const [upgrading, setUpgrading] = React.useState(false);
  const [upgradeError, setUpgradeError] = React.useState<string | null>(null);
  const [proPrice, setProPrice] = React.useState<number | undefined>(undefined);

  // Leemos el precio del Plan Pro del backend (config server-side)
  // al montar la página, para que la UI muestre el mismo número
  // que cobrará Mercado Pago.
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/plan-pro-info", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { price?: number } | null) => {
        if (cancelled || !data) return;
        if (typeof data.price === "number" && data.price > 0) {
          setProPrice(data.price);
        }
      })
      .catch(() => {
        // Si falla, caemos al valor por defecto.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const form = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: EMPTY_DEFAULTS,
    mode: "onBlur",
  });

  // Hidratar desde localStorage una sola vez al montar.
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PlanForm>;
        form.reset({ ...EMPTY_DEFAULTS, ...parsed, isPro: false });
      }
    } catch {
      // localStorage no disponible / corrupto: ignorar silenciosamente.
    }
    setHydrated(true);
  }, [form]);

  // Persistir cualquier cambio del formulario (sin el flag isPro).
  React.useEffect(() => {
    if (!hydrated) return;
    const subscription = form.watch((value) => {
      try {
        const { isPro: _ignored, ...rest } = value as PlanForm;
        void _ignored;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      } catch {
        // sin espacio o sin localStorage: ignorar.
      }
    });
    return () => subscription.unsubscribe();
  }, [form, hydrated]);

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleGenerate = async () => {
    setDownloadError(null);
    // Validamos todo el plan antes de pedir el documento.
    const valid = await form.trigger();
    if (!valid) {
      // Saltamos al primer step con errores para que el usuario los vea.
      const errors = form.formState.errors;
      const order: Array<keyof PlanForm> = [
        "nombreNegocio",
        "rubro",
        "region",
        "postulacion",
        "etapaNegocio",
        "problema",
        "solucion",
        "clienteIdeal",
        "diferenciador",
        "clientesPotenciales",
        "precioVenta",
        "competidores",
        "canalesVenta",
        "costoAlquiler",
        "costoServicios",
        "costoSueldos",
        "costoMateriaPrima",
        "costoEmpaque",
        "inversionEquipos",
        "inversionMobiliario",
        "inversionCapitalTrabajo",
        "ventasMes1",
        "crecimientoMensualPct",
        "montoSolicitado",
        "usosFinanciamiento",
        "capitalPropio",
      ];
      const firstBad = order.findIndex((k) => errors[k]);
      if (firstBad >= 0) {
        const stepForField: Record<string, number> = {
          nombreNegocio: 0,
          rubro: 0,
          region: 0,
          postulacion: 0,
          etapaNegocio: 0,
          problema: 1,
          solucion: 1,
          clienteIdeal: 1,
          diferenciador: 1,
          clientesPotenciales: 2,
          precioVenta: 2,
          competidores: 2,
          canalesVenta: 2,
          costoAlquiler: 3,
          costoServicios: 3,
          costoSueldos: 3,
          costoMateriaPrima: 3,
          costoEmpaque: 3,
          inversionEquipos: 3,
          inversionMobiliario: 3,
          inversionCapitalTrabajo: 3,
          ventasMes1: 4,
          crecimientoMensualPct: 4,
          montoSolicitado: 5,
          usosFinanciamiento: 5,
          capitalPropio: 5,
        };
        const target = stepForField[order[firstBad] as string] ?? 0;
        setStep(target);
      }
      return;
    }

    setGenerating(true);
    try {
      const payload = { ...form.getValues(), isPro: false } satisfies PlanForm;
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `plan-de-negocio-${payload.nombreNegocio
        .replace(/[^a-z0-9-_]+/gi, "-")
        .toLowerCase()
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "plenvo"}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[wizard] download error:", err);
      setDownloadError(
        err instanceof Error
          ? err.message
          : "No pudimos generar el documento. Inténtalo de nuevo."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeError(null);
    setDownloadError(null);

    const valid = await form.trigger();
    if (!valid) {
      setUpgradeError(
        "Completa todos los pasos del wizard antes de pagar el Plan Pro."
      );
      return;
    }

    setUpgrading(true);
    try {
      // Enviamos el payload sin isPro (la fuente de verdad es el server).
      const values = form.getValues();
      const { isPro: _ignore, ...payload } = values as PlanForm;
      void _ignore;
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        initPoint?: string;
        sandboxInitPoint?: string;
      };
      const checkoutUrl = data.initPoint || data.sandboxInitPoint;
      if (!checkoutUrl) {
        throw new Error("Mercado Pago no devolvió una URL de checkout.");
      }
      // Redirigimos al checkout de MP. Tras pagar, MP nos devuelve a
      // /api/payment-callback, que valida y redirige a /descarga-exitosa.
      window.location.assign(checkoutUrl);
    } catch (err) {
      console.error("[wizard] upgrade error:", err);
      setUpgradeError(
        err instanceof Error
          ? err.message
          : "No pudimos iniciar el pago. Inténtalo de nuevo en unos minutos."
      );
      setUpgrading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen flex flex-col bg-plenvo-gray-50">
        <SiteWizardHeader />

        {/* Decoración: blobs suaves con gradiente Plenvo */}
        <div aria-hidden="true" className="relative -z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full plenvo-gradient-soft-bg blur-3xl opacity-60 pointer-events-none" />
        </div>

        <main className="relative z-10 flex-1">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 sm:pt-10 pb-16">
            {/* ProgressBar */}
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-plenvo-gray-300 px-4 sm:px-6 py-5 sm:py-6 shadow-plenvo-xs">
              <ProgressBar currentStep={step} unlockedCount={TOTAL_STEPS} />
            </div>

            {/* Card del paso */}
            <div className="mt-6 sm:mt-8 rounded-2xl bg-white border border-plenvo-gray-300 shadow-plenvo-md p-5 sm:p-10">
              {step === 0 ? (
                <Step1DatosGenerales
                  stepIndex={step}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              ) : null}
              {step === 1 ? (
                <Step2ResumenEjecutivo
                  stepIndex={step}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              ) : null}
              {step === 2 ? (
                <Step3MercadoCompetencia
                  stepIndex={step}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              ) : null}
              {step === 3 ? (
                <Step4EstructuraCostos
                  stepIndex={step}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              ) : null}
              {step === 4 ? (
                <Step5Proyeccion
                  stepIndex={step}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              ) : null}
              {step === 5 ? (
                <Step6Financiamiento
                  stepIndex={step}
                  onPrev={handlePrev}
                  onGenerate={handleGenerate}
                  onUpgrade={handleUpgrade}
                  isGenerating={generating}
                  isUpgrading={upgrading}
                  downloadError={downloadError}
                  upgradeError={upgradeError}
                  proPrice={proPrice}
                />
              ) : null}
            </div>

            {downloadError ? (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-3 text-center shadow-plenvo-xs"
              >
                {downloadError}
              </p>
            ) : null}

            <p className="mt-8 text-center text-xs text-plenvo-gray-500">
              Tus datos se guardan automáticamente en este navegador.
            </p>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}
