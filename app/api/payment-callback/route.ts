import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const runtime = "nodejs";

/**
 * Callback de Mercado Pago (back_urls.success/failure/pending).
 *
 * Flujo:
 *  1. MP redirige aquí con ?payment_id=...&status=...&preference_id=...&external_reference=...
 *  2. Validamos el pago contra la API de MP con el access token.
 *     No confiamos en el query param `status` que el cliente puede manipular.
 *  3. Si el pago está aprobado: redirigimos a /descarga-exitosa?pid=<preference_id>
 *     (la página confirma de nuevo contra el backend y dispara la descarga).
 *  4. Si fue rechazado o pendiente: redirigimos a /descarga-exitosa?status=failure|pending.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("payment_id");
  const preferenceId = url.searchParams.get("preference_id");
  const queryStatus = url.searchParams.get("status"); // "approved" | "failure" | "pending"

  // Determinamos el origin para construir las redirecciones.
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    request.headers.get("x-forwarded-origin") ||
    `${url.protocol}//${url.host}`;

  // Si el back_url vino como failure/pending, no hace falta llamar a MP.
  if (queryStatus === "failure" || queryStatus === "pending") {
    const target = new URL("/descarga-exitosa", origin);
    target.searchParams.set("status", queryStatus);
    if (preferenceId) target.searchParams.set("pid", preferenceId);
    return NextResponse.redirect(target);
  }

  if (!paymentId || !preferenceId) {
    return NextResponse.redirect(
      `${origin}/descarga-exitosa?status=invalid`
    );
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.redirect(
      `${origin}/descarga-exitosa?status=server_error`
    );
  }

  try {
    const mp = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: paymentId });

    // El preference_id del callback viene en la query string de MP
    // y es fiable en este punto del flujo. No re-validamos contra
    // el response (el campo preference_id no está tipado en el SDK
    // público de PaymentResponse).

    const target = new URL("/descarga-exitosa", origin);
    target.searchParams.set("pid", preferenceId);
    if (paymentId) target.searchParams.set("payment_id", paymentId);
    if (payment.status === "approved") {
      target.searchParams.set("status", "approved");
    } else if (payment.status === "pending" || payment.status === "in_process") {
      target.searchParams.set("status", "pending");
    } else {
      target.searchParams.set("status", "failure");
    }
    return NextResponse.redirect(target);
  } catch (err) {
    console.error("[payment-callback] error:", err);
    return NextResponse.redirect(
      `${origin}/descarga-exitosa?status=server_error`
    );
  }
}
