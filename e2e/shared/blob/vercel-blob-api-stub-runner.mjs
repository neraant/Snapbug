import { createServer } from "node:http";
import { writeFileSync } from "node:fs";

const e2eBlobReadWriteToken = "vercel_blob_rw_e2estore";
const blobs = new Map();

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function json(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(payload));
}

function pathnameFromBlobUrl(urlValue) {
  if (urlValue.startsWith("http://") || urlValue.startsWith("https://")) {
    return new URL(urlValue).pathname.replace(/^\//, "");
  }
  return urlValue;
}

function blobContentUrl(origin, pathname) {
  return `${origin}/blob/${pathname}`;
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end();
    return;
  }

  const requestUrl = new URL(request.url, "http://127.0.0.1");
  const origin = `http://127.0.0.1:${server.address().port}`;

  if (requestUrl.pathname.startsWith("/blob/")) {
    const pathname = decodeURIComponent(requestUrl.pathname.slice("/blob/".length));
    const stored = blobs.get(pathname);
    if (!stored) {
      response.writeHead(404);
      response.end();
      return;
    }

    response.writeHead(200, {
      "content-type": stored.contentType,
      "content-length": String(stored.body.length),
      etag: stored.etag,
      "last-modified": stored.uploadedAt.toUTCString(),
    });
    response.end(stored.body);
    return;
  }

  if (!requestUrl.pathname.startsWith("/api/blob")) {
    response.writeHead(404);
    response.end();
    return;
  }

  if (request.method === "PUT") {
    const pathname = requestUrl.searchParams.get("pathname")?.trim();
    if (!pathname) {
      json(response, 400, { error: { code: "bad_request", message: "pathname is required" } });
      return;
    }

    const body = await readRequestBody(request);
    const contentType = request.headers["x-content-type"]?.toString() ?? "application/octet-stream";
    const uploadedAt = new Date();
    const etag = `W/"${body.length}-${uploadedAt.getTime()}"`;
    blobs.set(pathname, { body, contentType, uploadedAt, etag });

    const url = blobContentUrl(origin, pathname);
    json(response, 200, {
      url,
      downloadUrl: `${url}?download=1`,
      pathname,
      contentType,
      contentDisposition: "",
      etag,
    });
    return;
  }

  if (request.method === "GET") {
    const urlValue = requestUrl.searchParams.get("url")?.trim();
    if (!urlValue) {
      json(response, 400, { error: { code: "bad_request", message: "url is required" } });
      return;
    }

    const pathname = pathnameFromBlobUrl(urlValue);
    const stored = blobs.get(pathname);
    if (!stored) {
      json(response, 404, { error: { code: "not_found", message: "Blob not found" } });
      return;
    }

    const blobUrl = blobContentUrl(origin, pathname);
    json(response, 200, {
      url: blobUrl,
      downloadUrl: `${blobUrl}?download=1`,
      pathname,
      size: stored.body.length,
      contentType: stored.contentType,
      contentDisposition: "",
      cacheControl: "",
      uploadedAt: stored.uploadedAt.toISOString(),
      etag: stored.etag,
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/blob/delete") {
    await readRequestBody(request);
    response.writeHead(200, { "content-type": "application/json" });
    response.end("{}");
    return;
  }

  response.writeHead(405);
  response.end();
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/blob`;
  const readyPath = process.env.SNAPBUG_BLOB_STUB_READY_PATH;
  if (!readyPath) {
    process.stderr.write("SNAPBUG_BLOB_STUB_READY_PATH is required\n");
    process.exit(1);
    return;
  }

  writeFileSync(
    readyPath,
    JSON.stringify({
      baseUrl,
      token: e2eBlobReadWriteToken,
    }),
  );
});
