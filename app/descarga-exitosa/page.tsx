import { Suspense } from "react";
import { DescargaExitosaClient } from "./DescargaExitosaClient";

export const metadata = {
  title: "Plenvo · Pago procesado",
  description: "Tu Plan Pro se está descargando.",
};

export default function DescargaExitosaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-plenvo-gray-500">Cargando…</div>}>
      <DescargaExitosaClient />
    </Suspense>
  );
}
