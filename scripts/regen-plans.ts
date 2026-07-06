// Script temporal de validación: regenera plan-free.docx y plan-pro.docx
// a partir de payload-free.json y payload-pro.json (mismas entradas que se
// enviaron al endpoint /api/generate-plan en producción).
//
// Uso: npx tsx scripts/regen-plans.ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildPlanDoc } from "../lib/docx/generatePlan";

type Payload = Parameters<typeof buildPlanDoc>[0];

async function main() {
  const root = resolve(__dirname, "..");

  const freePayload = JSON.parse(
    readFileSync(resolve(root, "payload-free.json"), "utf8")
  ) as Payload;
  const proPayload = JSON.parse(
    readFileSync(resolve(root, "payload-pro.json"), "utf8")
  ) as Payload;

  console.log("[regen] generando plan-free.docx ...");
  const freeBuf = await buildPlanDoc({ ...freePayload, isPro: false });
  writeFileSync(resolve(root, "plan-free.docx"), freeBuf);
  console.log(`[regen] plan-free.docx: ${freeBuf.byteLength} bytes`);

  console.log("[regen] generando plan-pro.docx ...");
  const proBuf = await buildPlanDoc({ ...proPayload, isPro: true });
  writeFileSync(resolve(root, "plan-pro.docx"), proBuf);
  console.log(`[regen] plan-pro.docx: ${proBuf.byteLength} bytes`);
}

main().catch((err) => {
  console.error("[regen] error:", err);
  process.exit(1);
});
