// Tiny clean-URL static server for the exported site (out/).
// Maps /templates/dashboard -> out/templates/dashboard.html so link clicks
// behave like the deployed site. Only used for the width self-check.
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const PORT = 3123;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let path = url === "/" ? "/index.html" : url;
  let file = join(ROOT, path);
  if (!existsSync(file) || !statSync(file).isFile()) {
    const html = join(ROOT, `${path.replace(/\/$/, "")}.html`);
    if (existsSync(html)) file = html;
    else {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found: " + url);
      return;
    }
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, "127.0.0.1", () => console.log(`serving out/ on 127.0.0.1:${PORT}`));
