import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { planSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * Almacén en memoria de payloads pendientes de pago.
 *
 * Guardamos el payload del wizard por `preference_id` para poder
 * regenerar el .docx Pro cuando MP confirme el pago.
 *
 * IMPORTANTE: vive en el proceso del servidor. Si el server se reinicia
 * entre la creación de la preferencia y el callback, se pierde.
 * Aceptable para MVP; migrar a Redis/KV si se vuelve un problema.
 */
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

const PAYLOAD_TTL_MS = 1000 * 60 * 60; // 1 hora

export async function POST(request: Request) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "MP_ACCESS_TOKEN no configurado en el servidor" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Validamos el payload (sin isPro, ya que aún no se pagó).
  const parsed = planSchema.safeParse({ ...(body as object), isPro: false });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos del wizard inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const priceEnv = process.env.NEXT_PUBLIC_PLAN_PRO_PRICE;
  const unitPrice = priceEnv ? Number(priceEnv) : 19;
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_PLAN_PRO_PRICE inválido" },
      { status: 500 }
    );
  }

  // Determinamos el base URL para los back_urls. En producción Next.js
  // expone el host a través de headers; en dev usamos NEXTAUTH_URL o
  // un fallback al origin del request.
  const url = new URL(request.url);
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    request.headers.get("x-forwarded-origin") ||
    `${url.protocol}//${url.host}`;

  // Mercado Pago rechaza back_urls que apunten a localhost o a IPs
  // privadas. En desarrollo local, `auto_return` con localhost falla;
  // por eso solo lo activamos cuando el origen parece producción
  // (https + host no local).
  const isLocalhost =
    origin.includes("localhost") || origin.includes("127.0.0.1");
  const autoReturn = isLocalhost ? undefined : "approved";

  try {
    const mp = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(mp);

    const result = await preferenceClient.create({
      body: {
        items: [
          {
            id: "plenvo-plan-pro",
            title: "Plenvo Plan Pro - Plan de Negocio Profesional",
            description:
              "Versión Pro del plan de negocio: sin marca de agua, con gráficos financieros y sección de riesgos.",
            quantity: 1,
            unit_price: unitPrice,
            currency_id: "PEN",
          },
        ],
        back_urls: {
          success: `${origin}/api/payment-callback`,
          failure: `${origin}/api/payment-callback?status=failure`,
          pending: `${origin}/api/payment-callback?status=pending`,
        },
        ...(autoReturn ? { auto_return: autoReturn } : {}),
        external_reference: `plenvo-${Date.now()}`,
        statement_descriptor: "PLENVO PRO",
      },
    });

    const initPoint = result.init_point || result.sandbox_init_point;
    if (!initPoint || !result.id) {
      console.error("[create-preference] respuesta sin init_point/id", result);
      return NextResponse.json(
        { error: "No se pudo obtener la URL de checkout" },
        { status: 502 }
      );
    }

    // Guardamos el payload por preference_id (limpiando entradas viejas).
    const store = getStore();
    const now = Date.now();
    for (const [k, v] of store) {
      if (now - v.createdAt > PAYLOAD_TTL_MS) store.delete(k);
    }
    store.set(result.id, { payload: parsed.data, createdAt: now });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (err) {
    console.error("[create-preference] error:", err);
    const message =
      err instanceof Error ? err.message : "Error creando la preferencia";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
