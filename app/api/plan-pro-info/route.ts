import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Devuelve información pública del Plan Pro.
 *
 * El precio nunca debe escribirse a mano en el frontend: este endpoint
 * lee `NEXT_PUBLIC_PLAN_PRO_PRICE` del servidor y lo expone sin
 * revelar credenciales secretas.
 */
export async function GET() {
  const priceEnv = process.env.NEXT_PUBLIC_PLAN_PRO_PRICE;
  const price = priceEnv ? Number(priceEnv) : 19;
  return NextResponse.json(
    {
      price: Number.isFinite(price) && price > 0 ? price : 19,
      currency: "PEN",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
