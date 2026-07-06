// Validador OOXML estructural para .docx generados con la librería `docx`.
//
// Detecta las clases de error más comunes que hacen que Word muestre
// "Word detectó un error al intentar abrir el archivo":
//
//   - ZIP íntegro y descomprimible.
//   - [Content_Types].xml bien formado y con los Overrides requeridos.
//   - _rels/.rels apunta a docProps/core.xml.
//   - word/_rels/document.xml.rels apunta a styles/numbering/footnotes/etc.
//   - Cada r:embed="rIdN" en document.xml existe en document.xml.rels.
//   - Cada Target de tipo "image" en rels apunta a un archivo existente en
//     word/media/ y su tamaño es > 0.
//   - Tamaños wp:extent razonables (<= 30" en EMU).
//
// No reemplaza a Word, pero detecta errores estructurales que Word/LibreOffice
// también detectarían.
import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sax from "sax";

type Finding = { severity: "error" | "warn" | "info"; message: string };
const fail = (m: string): Finding => ({ severity: "error", message: m });
const warn = (m: string): Finding => ({ severity: "warn", message: m });
const info = (m: string): Finding => ({ severity: "info", message: m });

const EMU_PER_INCH = 914_400;

function unzip(docxPath: string, outDir: string): { ok: boolean; error?: string } {
  try {
    execSync(`unzip -o "${docxPath}" -d "${outDir}"`, { stdio: "pipe" });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

interface XmlElement {
  tagName: string;
  attrs: Record<string, string>;
}
type Handler = (el: XmlElement) => void;

function parseXmlFile(xmlPath: string, onElement: Handler): { ok: boolean; error?: string } {
  const raw = readFileSync(xmlPath, "utf8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = (sax as any).parser(true, { trim: false, normalize: false });
  let ok = true;
  let error: string | undefined;
  parser.onerror = (e: Error) => {
    ok = false;
    error = e.message;
    parser.error = null;
    parser.resume();
  };
  parser.onopentag = (raw: { name: string; attributes: Record<string, string> }) => {
    onElement({ tagName: raw.name, attrs: raw.attributes ?? {} });
  };
  try {
    parser.write(raw).close();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
  return { ok, error };
}

function main() {
  const docxPath = process.argv[2];
  if (!docxPath) {
    console.error("uso: tsx scripts/validate-docx.ts <ruta.docx>");
    process.exit(2);
  }
  const abs = resolve(docxPath);
  if (!existsSync(abs)) {
    console.error(`no existe: ${abs}`);
    process.exit(2);
  }

  const findings: Finding[] = [];
  const tmp = `${tmpdir()}/validate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const u = unzip(abs, tmp);
  if (!u.ok) {
    findings.push(fail(`ZIP no se pudo descomprimir: ${u.error}`));
    printReport(abs, findings);
    process.exit(1);
  }

  info(`[info] archivo validado: ${basename(abs)}`);

  // 1) [Content_Types].xml
  const ctPath = `${tmp}/[Content_Types].xml`;
  if (!existsSync(ctPath)) {
    findings.push(fail("falta [Content_Types].xml"));
  } else {
    const r = parseXmlFile(ctPath, (el) => {
      if (el.tagName === "Default" && el.attrs.Extension === "png") {
        if (el.attrs.ContentType !== "image/png")
          findings.push(fail('Default Extension="png" tiene ContentType incorrecto'));
      }
      if (el.tagName === "Override") {
        void el; // ya cubierto por chequeos posteriores
      }
    });
    if (!r.ok) findings.push(fail(`[Content_Types].xml mal formado: ${r.error}`));
    else {
      const required = [
        "/word/document.xml",
        "/word/styles.xml",
        "/docProps/core.xml",
        "/word/settings.xml",
        "/word/fontTable.xml",
      ];
      const ctRaw = readFileSync(ctPath, "utf8");
      for (const req of required) {
        if (!ctRaw.includes(`PartName="${req}"`))
          findings.push(fail(`falta Override PartName="${req}" en [Content_Types].xml`));
      }
      if (!ctRaw.includes('Extension="png"') || !ctRaw.includes('ContentType="image/png"'))
        findings.push(fail('falta Default png → image/png en [Content_Types].xml'));
    }
  }

  // 2) _rels/.rels
  const relsTop = `${tmp}/_rels/.rels`;
  if (!existsSync(relsTop)) findings.push(fail("falta _rels/.rels"));
  else {
    const r = parseXmlFile(relsTop, () => {});
    if (!r.ok) findings.push(fail(`_rels/.rels mal formado: ${r.error}`));
    const raw = readFileSync(relsTop, "utf8");
    if (!raw.includes("core.xml")) findings.push(fail("_rels/.rels no apunta a core.xml"));
  }

  // 3) word/_rels/document.xml.rels
  const docRels = `${tmp}/word/_rels/document.xml.rels`;
  const relMap = new Map<string, { type: string; target: string }>();
  if (!existsSync(docRels)) findings.push(fail("falta word/_rels/document.xml.rels"));
  else {
    const r = parseXmlFile(docRels, (el) => {
      if (el.tagName === "Relationship" && el.attrs.Id) {
        relMap.set(el.attrs.Id, {
          type: el.attrs.Type ?? "",
          target: el.attrs.Target ?? "",
        });
      }
    });
    if (!r.ok) findings.push(fail(`document.xml.rels mal formado: ${r.error}`));
    else {
      const requiredTypes = [
        "styles",
        "numbering",
        "settings",
        "fontTable",
        "footnotes",
        "theme",
      ];
      for (const t of requiredTypes) {
        if (![...relMap.values()].some((v) => v.type.endsWith(`/${t}`))) {
          // theme y numbering son opcionales en algunos perfiles, sólo advertimos
          if (t === "theme" || t === "numbering") {
            findings.push(warn(`document.xml.rels no contiene relación /${t}`));
          } else {
            findings.push(fail(`document.xml.rels no contiene relación /${t}`));
          }
        }
      }
    }
  }

  // 4) word/document.xml — embed refs + extent sanity
  const docPath = `${tmp}/word/document.xml`;
  if (!existsSync(docPath)) findings.push(fail("falta word/document.xml"));
  else {
    const r = parseXmlFile(docPath, () => {});
    if (!r.ok) findings.push(fail(`word/document.xml mal formado: ${r.error}`));
    const docRaw = readFileSync(docPath, "utf8");
    const embedRe = /r:embed="(rId\d+)"/g;
    const seenEmbeds = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = embedRe.exec(docRaw)) !== null) seenEmbeds.add(m[1]);

    for (const rid of seenEmbeds) {
      const rel = relMap.get(rid);
      if (!rel) {
        findings.push(fail(`document.xml referencia ${rid} que no existe en document.xml.rels`));
        continue;
      }
      if (rel.type.endsWith("/image")) {
        const targetPath = rel.target.startsWith("/")
          ? `${tmp}${rel.target}`
          : `${tmp}/word/${rel.target}`;
        if (!existsSync(targetPath)) {
          findings.push(fail(`imagen ${rid} apunta a ${rel.target} — archivo no existe`));
        } else {
          const size = readFileSync(targetPath).byteLength;
          if (size === 0)
            findings.push(fail(`imagen ${rid} (${rel.target}) está vacía (0 bytes)`));
          else info(`[info] imagen ${rid} → ${rel.target} OK (${size} bytes)`);
        }
      }
    }

    const extentRe = /<wp:extent\s+cx="(\d+)"\s+cy="(\d+)"\s*\/>/g;
    let em: RegExpExecArray | null;
    while ((em = extentRe.exec(docRaw)) !== null) {
      const cx = Number(em[1]);
      const cy = Number(em[2]);
      const cxIn = cx / EMU_PER_INCH;
      const cyIn = cy / EMU_PER_INCH;
      if (cxIn > 30 || cyIn > 30) {
        findings.push(
          fail(
            `wp:extent cx=${cx} cy=${cy} = ${cxIn.toFixed(1)}"×${cyIn.toFixed(1)}" — fuera de página, Word lo rechaza.`
          )
        );
      } else {
        info(`[info] wp:extent OK (${cxIn.toFixed(2)}"×${cyIn.toFixed(2)}")`);
      }
    }
  }

  // 5) word/styles.xml well-formed
  const stylesPath = `${tmp}/word/styles.xml`;
  if (existsSync(stylesPath)) {
    const r = parseXmlFile(stylesPath, () => {});
    if (!r.ok) findings.push(fail(`word/styles.xml mal formado: ${r.error}`));
  }

  printReport(abs, findings);
  const errs = findings.filter((f) => f.severity === "error");
  process.exit(errs.length > 0 ? 1 : 0);
}

function printReport(path: string, findings: Finding[]) {
  const errs = findings.filter((f) => f.severity === "error");
  const warns = findings.filter((f) => f.severity === "warn");
  const infos = findings.filter((f) => f.severity === "info");
  console.log(`\n=== ${basename(path)} ===`);
  console.log(`errores: ${errs.length},  warnings: ${warns.length},  info: ${infos.length}`);
  for (const f of findings) console.log(`  [${f.severity.toUpperCase()}] ${f.message}`);
  if (errs.length === 0) console.log("\nOK — estructura OOXML básica válida.\n");
}

main();
