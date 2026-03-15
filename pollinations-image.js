"use strict";

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt/";

function parseJsonSafe(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getSizeByAspect(aspectRatio) {
  switch (String(aspectRatio || "1:1")) {
    case "3:2":
      return { width: 1152, height: 768 };
    case "2:3":
      return { width: 768, height: 1152 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

function buildPollinationsUrls(prompt, aspectRatio) {
  const { width, height } = getSizeByAspect(aspectRatio);
  const safePrompt = encodeURIComponent(prompt);
  const seedA = Math.floor(Math.random() * 1_000_000_000);
  const seedB = Math.floor(Math.random() * 1_000_000_000);
  const seedC = Math.floor(Math.random() * 1_000_000_000);
  return [
    `${POLLINATIONS_BASE_URL}${safePrompt}?model=flux&width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seedA}`,
    `${POLLINATIONS_BASE_URL}${safePrompt}?width=${width}&height=${height}&safe=true&nologo=true&enhance=false&seed=${seedB}`,
    `${POLLINATIONS_BASE_URL}${safePrompt}?model=sana&width=768&height=768&safe=true&nologo=true&enhance=false&seed=${seedC}`
  ];
}

function writeCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function fetchImageBinary(url, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Fley/1.0" }
    });
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (response.ok && contentType.startsWith("image/")) {
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      return { ok: true, contentType, imageBuffer };
    }
    const raw = await response.text();
    return {
      ok: false,
      status: response.status || 502,
      error: raw || `HTTP ${response.status || 502}`
    };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err?.name === "AbortError" ? "Pollinations timeout" : "Pollinations network error"
    };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async (req, res) => {
  writeCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") payload = parseJsonSafe(payload);
  if (!payload || typeof payload !== "object") payload = {};

  const prompt = String(payload.prompt || "").trim();
  const aspectRatio = String(payload.aspectRatio || "1:1");
  if (!prompt) {
    res.status(400).send("Missing prompt");
    return;
  }

  const urls = buildPollinationsUrls(prompt, aspectRatio);
  let lastStatus = 503;
  let lastError = "Pollinations unavailable";
  for (const url of urls) {
    const result = await fetchImageBinary(url, 35000);
    if (result.ok) {
      res.setHeader("Content-Type", result.contentType || "image/png");
      res.setHeader("Cache-Control", "no-store");
      res.status(200).send(result.imageBuffer);
      return;
    }
    lastStatus = result.status || 503;
    lastError = result.error || "Pollinations unavailable";
    if (lastStatus === 429 || lastStatus >= 500) continue;
  }

  if (lastStatus === 429) {
    res.setHeader("Retry-After", "20");
    res.status(503).send("Pollinations rate limited. Try again later.");
    return;
  }
  res.status(503).send(lastError);
};

