import { NextResponse } from "next/server";
import { planSchema } from "@/lib/schemas";
import { buildPlanDoc } from "@/lib/docx/generatePlan";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Validamos con el mismo schema del cliente: si algo viene mal,
  // rechazamos sin generar un documento corrupto.
  const parsed = planSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const buffer = await buildPlanDoc(parsed.data);
    const safeName = parsed.data.nombreNegocio
      .replace(/[^a-z0-9-_]+/gi, "")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "plan";
    const filename = `plan-de-negocio-${safeName}.docx`;
    // Buffer en Node 18+; convertimos a Uint8Array para Response.
    const body = new Uint8Array(buffer);
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
    console.error("[generate-plan] error:", err);
    return NextResponse.json(
      { error: "Error generando el documento" },
      { status: 500 }
    );
  }
}