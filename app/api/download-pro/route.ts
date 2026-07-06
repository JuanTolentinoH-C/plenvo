import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { planSchema } from "@/lib/schemas";
import { buildPlanDoc } from "@/lib/docx/generatePlan";

export const runtime = "nodejs";

declare global {
  // eslint-disable-next-line no-var
  var __plenvoPaymentPayloads:
    | Map<string, { payload: unknown; createdAt: number }>
    | undefined;
}

function getStore() {
  if (!globalThis.__plenvoPaymentPayloads) {
    globalThis.__plenvoPaymentPayloads = new Map();
  }
  return globalThis.__plenvoPaymentPayloads;
}

/**
 * Descarga del .docx Pro.
 *
 * Llamado por la página /descarga-exitosa tras un pago aprobado.
 *  1. Recupera el payload del wizard guardado por `pid` (preference_id).
 *  2. Verifica contra la API de MP que el `payment_id` está `approved`
 *     y que su `preference_id` coincide con el `pid`.
 *  3. Genera el .docx con `isPro: true` y lo devuelve para descarga.
 *
 * Invalidamos el payload después de generarlo para evitar descargas
 * duplicadas con la misma preferencia.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const preferenceId = url.searchParams.get("pid");
  const paymentId = url.searchParams.get("payment_id");

  if (!preferenceId || !paymentId) {
    return NextResponse.json(
      { error: "Faltan parámetros pid o payment_id" },
      { status: 400 }
    );
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "MP_ACCESS_TOKEN no configurado" },
      { status: 500 }
    );
  }

  const store = getStore();
  const entry = store.get(preferenceId);
  if (!entry) {
    return NextResponse.json(
      {
        error:
          "No encontramos los datos de tu plan. El enlace pudo haber expirado; vuelve a completar el wizard.",
      },
      { status: 404 }
    );
  }

  // Validamos el payload persistido antes de usarlo.
  const parsed = planSchema.safeParse(entry.payload);
  if (!parsed.success) {
    store.delete(preferenceId);
    return NextResponse.json(
      { error: "Datos del wizard corruptos" },
      { status: 500 }
    );
  }

  try {
    // Verificamos el pago contra la API de MP con el access token.
    const mp = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return NextResponse.json(
        { error: `El pago no está aprobado (estado: ${payment.status})` },
        { status: 402 }
      );
    }

    // Generamos el .docx con isPro: true.
    const buffer = await buildPlanDoc({ ...parsed.data, isPro: true });

    const safeName = parsed.data.nombreNegocio
      .replace(/[^a-z0-9-_]+/gi, "")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "plan";
    const filename = `plan-de-negocio-pro-${safeName}.docx`;
    const body = new Uint8Array(buffer);

    // Invalidamos el payload: un pago = una descarga.
    store.delete(preferenceId);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[download-pro] error:", err);
    const message =
      err instanceof Error ? err.message : "Error generando el documento Pro";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
