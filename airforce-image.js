"use strict";

const AIRFORCE_API_BASE = "https://api.airforce/v1";

function getAirforceSizeByAspect(aspectRatio) {
  switch (String(aspectRatio || "1:1")) {
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
    msg.includes("unsupported") ||
    msg.includes("not found") ||
    msg.includes("decommissioned")
  );
}

function isLikelySizeError(status, message) {
  const msg = (message || "").toLowerCase();
  return status === 422 || msg.includes("size error") || msg.includes("invalid size");
}

function getAirforceModelCandidates(requestedModel) {
  const defaults = [(requestedModel || "").trim(), (process.env.AIRFORCE_IMAGE_MODEL || "grok-imagine").trim(), "grok-imagine"];
  const seen = new Set();
  const output = [];
  defaults.forEach((model) => {
    if (!model || seen.has(model)) return;
    seen.add(model);
    output.push(model);
  });
  return output;
}

function getImageFromAirforceResponse(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
    const first = parsed.data[0];
    if (first?.url) return { url: String(first.url) };
    if (first?.b64_json) return { b64: String(first.b64_json), mime: "image/png" };
  }
  if (parsed.url) return { url: String(parsed.url) };
  if (parsed.image_url) return { url: String(parsed.image_url) };
  if (parsed.b64_json) return { b64: String(parsed.b64_json), mime: "image/png" };
  return null;
}

async function fetchAirforceImageBinary(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: "GET", redirect: "follow" });
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
  } catch {
    return { ok: false, status: 502, error: "Failed to fetch generated image" };
  }
}

async function requestAirforceImage(apiKey, prompt, aspectRatio, requestedModel) {
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
      if (withSize) payload.size = getAirforceSizeByAspect(aspectRatio);

      try {
        const response = await fetch(`${AIRFORCE_API_BASE}/images/generations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
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
        if (isLikelyModelError(lastStatus, errorMessage)) break;
        if (!response.ok) return { ok: false, status: lastStatus, error: lastError };

        const parsed = parseJsonSafe(raw);
        const image = getImageFromAirforceResponse(parsed);
        if (!image) return { ok: false, status: 502, error: "No image returned by Airforce" };

        if (image.b64) {
          const cleanBase64 = image.b64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
          const imageBuffer = Buffer.from(cleanBase64, "base64");
          return { ok: true, contentType: image.mime || "image/png", imageBuffer };
        }
        if (image.url) {
          const downloaded = await fetchAirforceImageBinary(image.url);
          if (downloaded.ok) return downloaded;
          lastError = downloaded.error;
          lastStatus = downloaded.status;
          return { ok: false, status: lastStatus, error: lastError };
        }
        return { ok: false, status: 502, error: "Unsupported image response format" };
      } catch {
        lastError = "Airforce upstream error";
        lastStatus = 502;
      }
    }
  }
  return { ok: false, status: lastStatus, error: lastError };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const apiKey = (process.env.AIRFORCE_API_KEY || "").trim();
  if (!apiKey) {
    res.status(400).send("Missing AIRFORCE_API_KEY");
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") payload = parseJsonSafe(payload);
  if (!payload || typeof payload !== "object") payload = {};

  const prompt = String(payload.prompt || "").trim();
  if (!prompt) {
    res.status(400).send("Missing prompt");
    return;
  }

  const aspectRatio = String(payload.aspectRatio || "1:1");
  const requestedModel = String(payload.model || "").trim();
  const result = await requestAirforceImage(apiKey, prompt, aspectRatio, requestedModel);

  if (!result.ok) {
    if (result.status === 429 || result.status === 503) {
      res.setHeader("Retry-After", "20");
    }
    res.status(result.status || 502).send(result.error || "Airforce image generation failed");
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", result.contentType || "image/png");
  res.status(200).send(result.imageBuffer);
};

