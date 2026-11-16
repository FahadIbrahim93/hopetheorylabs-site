/*
  Minimal static server for the exported site (`out/`), so Playwright and the
  evidence capture script exercise the real export without another dependency.
  Usage: node scripts/serve-out.mjs [port]
*/
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd(), "out");
const port = Number(process.argv[2] ?? 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
};

function candidate(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const direct = join(root, clean);
  if (!direct.startsWith(root)) return null;
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const html = join(root, `${clean.replace(/\/$/, "")}.html`);
  if (existsSync(html) && statSync(html).isFile()) return html;
  const index = join(root, clean, "index.html");
  if (existsSync(index) && statSync(index).isFile()) return index;
  return null;
}

if (!existsSync(root)) {
  console.error(`serve-out: ${root} does not exist. Run "npm run build" first.`);
  process.exit(1);
}

createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const file = candidate(url.pathname === "/" ? "/index.html" : url.pathname) ?? candidate("/404.html");
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`serve-out: http://127.0.0.1:${port} → ${root}`);
});
