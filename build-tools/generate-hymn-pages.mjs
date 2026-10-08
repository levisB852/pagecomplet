import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hymnRoot = path.join(root, "himnario", "himnos");
const templatePath = path.join(root, "himnario", "hymn.html");
const dataPath = path.join(root, "himnario", "js", "himnos_seccion_1.json");
const sitemapPath = path.join(root, "sitemap.xml");

const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const hymns = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");
const lastmod = new Date().toISOString().slice(0, 10);

fs.rmSync(hymnRoot, { recursive: true, force: true });
fs.mkdirSync(hymnRoot, { recursive: true });

for (const hymn of hymns) {
  const number = Number(hymn.number);
  if (!Number.isInteger(number) || !hymn.title || !Array.isArray(hymn.content)) continue;

  const title = `${number} - ${hymn.title} | Himnario Digital IADSDER`;
  const description = `Letra y pista del himno ${number}, ${hymn.title}, en el Himnario Digital IADSDER.`;
  const canonical = `https://iadsder.org/himnario/himnos/${number}/`;
  const lyrics = hymn.content.map(block => {
    const type = block.type === "chorus" ? "coro" : "estrofa";
    const lines = (block.lines || []).map(line => `<p>${escapeHtml(line)}</p>`).join("");
    return `<div class="${type}"><h3>${escapeHtml(block.label || "")}</h3>${lines}</div>`;
  }).join("");

  let page = template
    .replace("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>", '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n  <base href="/himnario/" />')
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" id="hymnCanonical" href="${canonical}" />`)
    .replace('<h2 id="hymnTitle"></h2>', `<h2 id="hymnTitle">${escapeHtml(number)} - ${escapeHtml(hymn.title)}</h2>`)
    .replace('<div id="hymnLyrics"></div>', `<div id="hymnLyrics">${lyrics}</div>`);

  const outputDir = path.join(hymnRoot, String(number));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), page);
}

if (!process.argv.includes("--no-sitemap")) {
  let sitemap = fs.readFileSync(sitemapPath, "utf8")
    .replace(/\s*<!-- GENERATED_HYMNS_START -->[\s\S]*?<!-- GENERATED_HYMNS_END -->/g, "");
  const hymnUrls = hymns.map(hymn => `
  <url>
    <loc>https://iadsder.org/himnario/himnos/${Number(hymn.number)}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.60</priority>
  </url>`).join("");
  sitemap = sitemap.replace("</urlset>", `  <!-- GENERATED_HYMNS_START -->${hymnUrls}\n  <!-- GENERATED_HYMNS_END -->\n</urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
}

console.log(`Generadas ${hymns.length} paginas SEO de himnos.`);
