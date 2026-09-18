const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const apiOrigin = new URL(process.env.API_ORIGIN || "http://127.0.0.1:8080");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");
  const pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    const upstream = http.request({
      hostname: apiOrigin.hostname,
      port: apiOrigin.port || (apiOrigin.protocol === "https:" ? 443 : 80),
      protocol: apiOrigin.protocol,
      method: request.method,
      path: `${pathname}${requestUrl.search}`,
      headers: { ...request.headers, host: apiOrigin.host }
    }, upstreamResponse => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
      upstreamResponse.pipe(response);
    });
    upstream.on("error", () => response.writeHead(502, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "NoteFlow API is unavailable." })));
    request.pipe(upstream);
    return;
  }
  const resource = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(root, `.${resource}`);

  if (!filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
}).listen(process.env.PORT || 5500, () => console.log("NoteFlow frontend: http://localhost:5500"));
