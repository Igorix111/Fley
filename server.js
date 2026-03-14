const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(path.join(root, ".env"));

const port = Number(process.env.PORT || process.argv[2] || 5173);
// Optional fallback if you prefer pasting the key directly into code.
const GEMINI_API_KEY_FALLBACK = "";
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK).trim();
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const GEMINI_IMAGE_FALLBACK = "gemini-3.1-flash-image-preview";
const AIRFORCE_API_KEY_FALLBACK = "";
const AIRFORCE_API_KEY = (process.env.AIRFORCE_API_KEY || AIRFORCE_API_KEY_FALLBACK).trim();
const AIRFORCE_API_BASE = "https://api.airforce/v1";
const AIRFORCE_IMAGE_MODEL = (process.env.AIRFORCE_IMAGE_MODEL || "grok-imagine").trim();
const POLLINATIONS_MODEL = "flux";
const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt/";
const POLLINATIONS_MIN_INTERVAL_MS = 8000;
let lastPollinationsRequestAt = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function writeApiCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getImageSizeByAspect(aspectRatio) {
  switch (aspectRatio) {
    case "3:2":
      return { width: 1152, height: 768 };
    case "2:3":
      return { width: 768, height: 1152 };
    case "16:9":
      return { width: 1280, height: 720 };
    case "9:16":
      return { width: 720, height: 1280 };
    case "4:3":
      return { width: 1152, height: 864 };
    case "3:4":
      return { width: 864, height: 1152 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

function getAirforceSizeByAspect(aspectRatio) {
  switch (aspectRatio) {
    case "3:2":
      return "1536x1024";
    case "2:3":
      return "1024x1536";
    case "1:1":
    default:
      return "1024x1024";
  }
}

function parseJsonSafe(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractAirforceError(raw, fallback = "Airforce error") {
  const text = (raw || "").toString().trim();
  if (!text) return fallback;
  const parsed = parseJsonSafe(text);
  if (!parsed) return text.slice(0, 220);
  if (typeof parsed.error === "string") return parsed.error;
  if (parsed.error?.message) return String(parsed.error.message);
  if (parsed.message) return String(parsed.message);
  return text.slice(0, 220);
}

function isLikelyModelError(status, message) {
  const msg = (message || "").toLowerCase();
  return (
    status === 404 ||
    msg.includes("model") ||
    msg.includes("not found") ||
    msg.includes("not supported") ||
    msg.includes("decommission")
  );
}

function isLikelySizeError(status, message) {
  const msg = (message || "").toLowerCase();
  return status === 422 || msg.includes("size") || msg.includes("resolution") || msg.includes("aspect");
}

function getAirforceModelCandidates(requestedModel) {
  const candidates = [
    requestedModel,
    AIRFORCE_IMAGE_MODEL,
    "grok-imagine",
    "grok-imagine-image",
    "grok-2-image"
  ]
    .map((value) => (value || "").toString().trim())
    .filter(Boolean);
  return Array.from(new Set(candidates));
}

function getImageFromAirforceResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const data = Array.isArray(payload.data) ? payload.data[0] : null;
  const output = Array.isArray(payload.output) ? payload.output[0] : null;
  const images = Array.isArray(payload.images) ? payload.images[0] : null;

  const url =
    data?.url ||
    output?.url ||
    images?.url ||
    payload.url ||
    payload.image_url ||
    payload.image;
  const b64 =
    data?.b64_json ||
    output?.b64_json ||
    images?.b64_json ||
    payload.b64_json ||
    payload.base64;
  const mime =
    data?.mime_type ||
    output?.mime_type ||
    images?.mime_type ||
    payload.mime_type ||
    "image/png";

  return { url, b64, mime };
}

async function fetchAirforceImageBinary(imageUrl) {
  const response = await fetch(imageUrl, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "Fley/1.0" }
  });
  if (!response.ok) {
    const text = await response.text();
    return {
      ok: false,
      status: response.status || 502,
      error: extractAirforceError(text, "Failed to fetch generated image")
    };
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  return { ok: true, contentType, imageBuffer };
}

async function requestAirforceImage(prompt, aspectRatio, requestedModel) {
  const models = getAirforceModelCandidates(requestedModel);
  let lastError = "Airforce image generation failed";
  let lastStatus = 502;

  for (const model of models) {
    let withSize = true;
    for (let pass = 0; pass < 2; pass += 1) {
      const payload = {
        model,
        prompt,
        n: 1,
        response_format: "url"
      };
      if (withSize) {
        payload.size = getAirforceSizeByAspect(aspectRatio);
      }

      try {
        const response = await fetch(`${AIRFORCE_API_BASE}/images/generations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AIRFORCE_API_KEY}`
          },
          body: JSON.stringify(payload)
        });

        const contentType = (response.headers.get("content-type") || "").toLowerCase();
        if (response.ok && contentType.startsWith("image/")) {
          const imageBuffer = Buffer.from(await response.arrayBuffer());
          return { ok: true, contentType, imageBuffer };
        }

        const raw = await response.text();
        const errorMessage = extractAirforceError(raw, "Airforce error");
        lastError = errorMessage;
        lastStatus = response.status || 502;

        if (isLikelySizeError(lastStatus, errorMessage) && withSize) {
          withSize = false;
          continue;
        }
        if (isLikelyModelError(lastStatus, errorMessage)) {
          break;
        }
        if (!response.ok) {
          return { ok: false, status: lastStatus, error: lastError };
        }

        const parsed = parseJsonSafe(raw);
        const image = getImageFromAirforceResponse(parsed);
        if (!image) {
          return { ok: false, status: 502, error: "No image returned by Airforce" };
        }

        if (image.b64) {
          const base64 = image.b64.toString().replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
          const imageBuffer = Buffer.from(base64, "base64");
          return { ok: true, contentType: image.mime || "image/png", imageBuffer };
        }
        if (image.url) {
          const download = await fetchAirforceImageBinary(image.url);
          if (download.ok) return download;
          lastError = download.error;
          lastStatus = download.status;
          return { ok: false, status: lastStatus, error: lastError };
        }
        return { ok: false, status: 502, error: "Unsupported image response format" };
      } catch (error) {
        lastError = "Airforce upstream error";
        lastStatus = 502;
      }
    }
  }

  return { ok: false, status: lastStatus, error: lastError };
}

function extractPollinationsError(raw) {
  const text = (raw || "").toString().trim();
  if (!text) return "Pollinations error";
  try {
    const parsed = JSON.parse(text);
    if (parsed?.message) return String(parsed.message);
    if (parsed?.error) return String(parsed.error);
  } catch {
    // Ignore JSON parsing errors; fall back to plain text.
  }
  return text.slice(0, 220);
}

async function fetchPollinationsImage(prompt, width, height, preferredModel) {
  const safePrompt = encodeURIComponent(prompt);
  const model = (preferredModel || POLLINATIONS_MODEL).toString();
  const seeds = [
    Math.floor(Math.random() * 1_000_000_000),
    Math.floor(Math.random() * 1_000_000_000),
    Math.floor(Math.random() * 1_000_000_000)
  ];

  const urls = [
    `${POLLINATIONS_BASE_URL}${safePrompt}?model=${encodeURIComponent(model)}&width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seeds[0]}`,
    `${POLLINATIONS_BASE_URL}${safePrompt}?width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seeds[1]}`,
    `${POLLINATIONS_BASE_URL}${safePrompt}?model=sana&width=768&height=768&safe=true&nologo=true&enhance=false&seed=${seeds[2]}`,
    `${POLLINATIONS_BASE_URL}${safePrompt}?model=sana&width=512&height=512&safe=true&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 1_000_000_000)}`
  ];

  let lastError = "Pollinations error";
  let lastStatus = 502;
  let retryAfterSec = 0;

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000);
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "Fley/1.0"
        }
      });
      clearTimeout(timer);

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (response.ok && contentType.startsWith("image/")) {
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        return { ok: true, contentType, imageBuffer };
      }

      const rawText = await response.text();
      lastStatus = response.status || 502;
      lastError = extractPollinationsError(rawText);
      const retryAfterHeader = Number.parseInt(response.headers.get("retry-after") || "0", 10);
      if (Number.isFinite(retryAfterHeader) && retryAfterHeader > 0) {
        retryAfterSec = retryAfterHeader;
      }

      // Retry temporary errors and provider throttling.
      if (response.status === 429 || response.status >= 500) {
        const waitSec = retryAfterSec > 0 ? retryAfterSec : 4;
        await sleep(waitSec * 1000);
        continue;
      }
    } catch (error) {
      lastStatus = 502;
      lastError = error?.name === "AbortError" ? "Pollinations timeout" : "Pollinations network error";
      await sleep(2000);
    }
  }

  if (lastStatus === 429 || lastStatus === 402) {
    return {
      ok: false,
      status: 503,
      error: "Image provider is rate limited. Try again in 20-60 seconds.",
      retryAfterSec: retryAfterSec > 0 ? retryAfterSec : 20
    };
  }

  return { ok: false, status: lastStatus, error: lastError, retryAfterSec };
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/airforce-image" || requestUrl.pathname === "/api/airforce-image/") {
    writeApiCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }

    if (!AIRFORCE_API_KEY) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Missing AIRFORCE_API_KEY");
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) req.destroy();
    });
    req.on("end", async () => {
      try {
        const payload = parseJsonSafe(body || "{}");
        if (!payload) {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Invalid JSON");
          return;
        }

        const prompt = (payload.prompt || "").toString().trim();
        if (!prompt) {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Missing prompt");
          return;
        }

        const aspectRatio = (payload.aspectRatio || "1:1").toString();
        const requestedModel = (payload.model || "").toString().trim();
        const result = await requestAirforceImage(prompt, aspectRatio, requestedModel);
        if (!result.ok) {
          const status = result.status || 502;
          const headers = { "Content-Type": "text/plain; charset=utf-8" };
          if (status === 429 || status === 503) {
            headers["Retry-After"] = "20";
          }
          res.writeHead(status, headers);
          res.end(result.error || "Airforce image generation failed");
          return;
        }

        res.writeHead(200, {
          "Content-Type": result.contentType || "image/png",
          "Cache-Control": "no-store"
        });
        res.end(result.imageBuffer);
      } catch {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Airforce upstream error");
      }
    });
    return;
  }

  if (requestUrl.pathname === "/api/pollinations-image" || requestUrl.pathname === "/api/pollinations-image/") {
    writeApiCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) req.destroy();
    });
    req.on("end", async () => {
      try {
        const now = Date.now();
        const waitMs = POLLINATIONS_MIN_INTERVAL_MS - (now - lastPollinationsRequestAt);
        if (waitMs > 0) {
          await sleep(waitMs);
        }
        lastPollinationsRequestAt = Date.now();

        const payload = JSON.parse(body || "{}");
        const prompt = (payload.prompt || "").toString().trim();
        if (!prompt) {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Missing prompt");
          return;
        }

        const aspectRatio = (payload.aspectRatio || "1:1").toString();
        const model = (payload.model || POLLINATIONS_MODEL).toString();
        const { width, height } = getImageSizeByAspect(aspectRatio);
        const result = await fetchPollinationsImage(prompt, width, height, model);
        if (!result.ok) {
          const headers = { "Content-Type": "text/plain; charset=utf-8" };
          if ((result.status === 429 || result.status === 402 || result.status === 503) && result.retryAfterSec > 0) {
            headers["Retry-After"] = String(result.retryAfterSec);
          }
          res.writeHead(result.status || 502, headers);
          res.end(result.error || "Pollinations error");
          return;
        }

        res.writeHead(200, {
          "Content-Type": result.contentType || "image/jpeg",
          "Cache-Control": "no-store"
        });
        res.end(result.imageBuffer);
      } catch (error) {
        res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Pollinations upstream error");
      }
    });
    return;
  }

  if (requestUrl.pathname === "/api/gemini-image" || requestUrl.pathname === "/api/gemini-image/") {
    writeApiCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method not allowed");
      return;
    }

    if (!GEMINI_API_KEY) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Missing GEMINI_API_KEY");
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) req.destroy();
    });
    req.on("end", async () => {
      let payload = null;
      try {
        payload = JSON.parse(body || "{}");
      } catch {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Invalid JSON");
        return;
      }

      const prompt = (payload.prompt || "").toString().trim();
      if (!prompt) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Missing prompt");
        return;
      }

      const aspectRatio = payload.aspectRatio || "1:1";
      const imageSize = "1K";
      const requestedModel = (payload.model || "").toString().trim();
      const allowedModels = new Set([GEMINI_IMAGE_MODEL, GEMINI_IMAGE_FALLBACK]);
      const primaryModel = allowedModels.has(requestedModel) ? requestedModel : GEMINI_IMAGE_MODEL;

      const makeRequest = (modelName) => {
        const bodyJson = JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio,
              imageSize
            }
          }
        });

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
          }
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        return new Promise((resolve, reject) => {
          const request = https.request(url, options, (upstreamRes) => {
            let data = "";
            upstreamRes.on("data", (chunk) => {
              data += chunk;
            });
            upstreamRes.on("end", () => {
              resolve({ status: upstreamRes.statusCode || 500, body: data });
            });
          });
          request.on("error", reject);
          request.write(bodyJson);
          request.end();
        });
      };

      const sendError = (status, message) => {
        res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(message);
      };

      try {
        let response = await makeRequest(primaryModel);
        if (response.status >= 400) {
          const lower = (response.body || "").toLowerCase();
          const isModelUnavailable =
            response.status === 404 ||
            lower.includes("not found") ||
            lower.includes("not supported") ||
            lower.includes("decommissioned");
          if (isModelUnavailable && primaryModel !== GEMINI_IMAGE_FALLBACK) {
            response = await makeRequest(GEMINI_IMAGE_FALLBACK);
          }
        }

        if (response.status >= 400) {
          sendError(response.status, response.body || "Gemini error");
          return;
        }

        const data = JSON.parse(response.body || "{}");
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((part) => part.inlineData || part.inline_data);
        const inline = imagePart?.inlineData || imagePart?.inline_data;
        if (!inline?.data) {
          sendError(502, "No image data returned");
          return;
        }

        const buffer = Buffer.from(inline.data, "base64");
        res.writeHead(200, {
          "Content-Type": inline.mimeType || "image/png",
          "Cache-Control": "no-store"
        });
        res.end(buffer);
      } catch (err) {
        sendError(502, "Gemini upstream error");
      }
    });
    return;
  }

  let urlPath = decodeURIComponent(requestUrl.pathname || "/");
  if (urlPath === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (urlPath === "/" || urlPath === "") {
    urlPath = "/index.html";
  }

  const filePath = path.join(root, urlPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    };
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}`);
  console.log(`Airforce key: ${AIRFORCE_API_KEY ? "loaded" : "missing"}`);
  console.log(`Gemini key: ${GEMINI_API_KEY ? "loaded" : "missing"}`);
});
