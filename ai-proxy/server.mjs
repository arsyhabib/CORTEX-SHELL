import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.CORTEX_AI_PROXY_PORT || 8787);
const HOST = process.env.CORTEX_AI_PROXY_HOST || "127.0.0.1";

const PROVIDER_CONFIG = {
  gemini: {
    label: "Google Gemini",
    configured: Boolean(process.env.GEMINI_API_KEY),
    apiKey: process.env.GEMINI_API_KEY || "",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: {
      chat: "gemini-2.5-flash",
      image: "nano-banana-pro-preview",
      imageFallback: "gemini-2.5-flash-image",
      videoChat: "gemini-2.5-flash",
      videoGeneration: "veo-3.1-fast-generate-preview",
      tts: "gemini-2.5-flash-preview-tts",
    },
  },
  deepseek: {
    label: "DeepSeek",
    configured: Boolean(process.env.DEEPSEEK_API_KEY),
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseUrl: "https://api.deepseek.com",
    models: {
      chat: "deepseek-v4-flash",
    },
  },
  featherless: {
    label: "Featherless",
    configured: Boolean(process.env.FEATHERLESS_API_KEY),
    apiKey: process.env.FEATHERLESS_API_KEY || "",
    baseUrl: "https://api.featherless.ai/v1",
    models: {
      fastVision: "unsloth/gemma-3-4b-it",
      balancedVision: "unsloth/gemma-3-12b-it",
      videoReasoning: "Kaushika04/Qwen2-VL-2B-Instruct-LoRA-FT_video_finetuned",
    },
  },
  openai: {
    label: "OpenAI",
    configured: Boolean(process.env.OPENAI_API_KEY),
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: "https://api.openai.com/v1",
    models: {
      chat: "gpt-4.1-nano",
      image: "gpt-image-2",
      imageQuality: "low",
    },
  },
  minimax: {
    label: "MiniMax",
    configured: Boolean(process.env.MINIMAX_API_KEY),
    apiKey: process.env.MINIMAX_API_KEY || "",
    baseUrl: "https://api.minimax.chat/v1",
    models: {
      chat: "minimax-3",
    },
  },
};

const CURATED_CATALOG = {
  text: [
    {
      id: PROVIDER_CONFIG.gemini.models.chat,
      label: "Gemini 2.5 Flash",
      note: "Tutor utama multimodal dengan upload gambar dan video untuk chat.",
      provider: "Google Gemini",
      route: "/providers/gemini/chat",
    },
    {
      id: PROVIDER_CONFIG.deepseek.models.chat,
      label: "DeepSeek V4 Flash",
      note: "Fast reasoning lane untuk verifikasi jawaban, penajaman outline, dan drafting structured output.",
      provider: "DeepSeek",
      route: "/providers/deepseek/chat/completions",
    },
    {
      id: PROVIDER_CONFIG.openai.models.chat,
      label: "GPT-4.1 nano",
      note: "Chat lane tercepat untuk prompt harian dan jawaban singkat yang tetap tajam.",
      provider: "OpenAI",
      route: "/providers/openai/chat/completions",
    },
    {
      id: PROVIDER_CONFIG.featherless.models.fastVision,
      label: "Gemma 3 4B IT",
      note: "Lane tercepat untuk multimodal ringan pada plan Featherless Basic.",
      provider: "Featherless",
      route: "/providers/featherless/chat/completions",
    },
    {
      id: PROVIDER_CONFIG.featherless.models.balancedVision,
      label: "Gemma 3 12B IT",
      note: "Reasoning terbaik yang masih ringan untuk analisis materi, rangkuman, dan deep reading.",
      provider: "Featherless",
      route: "/providers/featherless/chat/completions",
    },
    {
      id: PROVIDER_CONFIG.featherless.models.videoReasoning,
      label: "Qwen2-VL 2B Video FT",
      note: "Vision/video understanding ultra ringan untuk klasifikasi atau summarization cepat.",
      provider: "Featherless",
      route: "/providers/featherless/chat/completions",
    },
    {
      id: PROVIDER_CONFIG.minimax.models.chat,
      label: "MiniMax 3",
      note: "Text generation cepat dengan reasoning yang solid. OpenAI-compatible.",
      provider: "MiniMax",
      route: "/providers/minimax/chat/completions",
    },
  ],
  visual: [
    {
      id: PROVIDER_CONFIG.gemini.models.image,
      label: "Nano Banana Pro Preview",
      note: "Image generation utama untuk shell, poster, ilustrasi, dan adaptive visual assets.",
      provider: "Google Gemini",
      route: "/providers/gemini/image",
    },
    {
      id: PROVIDER_CONFIG.openai.models.image,
      label: "GPT Image 2",
      note: "Image generation low-output untuk visual cepat, murah, dan konsisten.",
      provider: "OpenAI",
      route: "/providers/openai/image",
    },
    {
      id: PROVIDER_CONFIG.gemini.models.videoGeneration,
      label: "Veo 3.1 Fast Generate",
      note: "Video generation tercepat di lane Gemini. Dipakai karena Nano Banana adalah model image, bukan video.",
      provider: "Google Gemini",
      route: "/providers/gemini/video/generate",
    },
    {
      id: PROVIDER_CONFIG.featherless.models.balancedVision,
      label: "Gemma 3 12B Vision",
      note: "Understanding lane untuk screenshot materi, diagram, dan referensi visual.",
      provider: "Featherless",
      route: "/providers/featherless/chat/completions",
    },
  ],
  audio: [
    {
      id: PROVIDER_CONFIG.gemini.models.tts,
      label: "Gemini 2.5 Flash Preview TTS",
      note: "Text-to-speech native untuk recap, narasi, dan drill audio.",
      provider: "Google Gemini",
      route: "/providers/gemini/tts",
    },
  ],
  video: [
    {
      id: PROVIDER_CONFIG.gemini.models.chat,
      label: "Gemini 2.5 Flash video chat",
      note: "Chat multimodal dengan upload video via inline data atau Files API.",
      provider: "Google Gemini",
      route: "/providers/gemini/chat",
    },
    {
      id: PROVIDER_CONFIG.gemini.models.videoGeneration,
      label: "Veo 3.1 Fast Generate",
      note: "Async video generation lane untuk motion explainer dan identity motion assets.",
      provider: "Google Gemini",
      route: "/providers/gemini/video/generate",
    },
  ],
  providers: {
    gemini: {
      label: PROVIDER_CONFIG.gemini.label,
      defaultChatModel: PROVIDER_CONFIG.gemini.models.chat,
      defaultImageModel: PROVIDER_CONFIG.gemini.models.image,
      defaultVideoModel: PROVIDER_CONFIG.gemini.models.videoGeneration,
      defaultTtsModel: PROVIDER_CONFIG.gemini.models.tts,
      note: "Gemini dipakai untuk multimodal utama: chat, image, video, dan TTS.",
    },
    deepseek: {
      label: PROVIDER_CONFIG.deepseek.label,
      defaultTextModel: PROVIDER_CONFIG.deepseek.models.chat,
      note: "DeepSeek dipakai sebagai fast reasoning lane terpisah.",
    },
    featherless: {
      label: PROVIDER_CONFIG.featherless.label,
      defaultVisionModel: PROVIDER_CONFIG.featherless.models.fastVision,
      note: "Featherless Basic diposisikan untuk tiga lane multimodal kecil yang masih cepat dan ekonomis.",
    },
    openai: {
      label: PROVIDER_CONFIG.openai.label,
      defaultChatModel: PROVIDER_CONFIG.openai.models.chat,
      defaultImageModel: PROVIDER_CONFIG.openai.models.image,
      defaultImageQuality: PROVIDER_CONFIG.openai.models.imageQuality,
      note: "OpenAI dipakai untuk chat cepat dan image low-output.",
    },
    minimax: {
      label: PROVIDER_CONFIG.minimax.label,
      defaultChatModel: PROVIDER_CONFIG.minimax.models.chat,
      note: "MiniMax 3 sebagai lane text generation cepat dengan reasoning solid.",
    },
  },
  notes: [
    "Semua live call berjalan lewat local secure proxy.",
    "Shell publik tetap secret-free dan aman untuk GitHub Pages.",
    "Nano Banana digunakan untuk image generation, sedangkan video generation dipetakan ke Veo karena memang lane resminya berbeda.",
    "OpenAI dipetakan ke GPT-4.1 nano untuk chat dan GPT Image 2 untuk image low-output.",
  ],
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${HOST}:${PORT}`}`);
    if (req.method === "OPTIONS") {
      writeJson(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && url.pathname === "/health") {
      writeJson(res, 200, buildHealthPayload());
      return;
    }
    if (req.method === "GET" && url.pathname === "/config/models") {
      writeJson(res, 200, {
        ok: true,
        proxyBaseUrl: `http://${HOST}:${PORT}`,
        catalog: CURATED_CATALOG,
      });
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/deepseek/chat/completions") {
      assertConfigured("deepseek");
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || PROVIDER_CONFIG.deepseek.models.chat,
        messages: body.messages || [{ role: "user", content: body.prompt || "Say hello." }],
        temperature: body.temperature ?? 0.2,
        max_tokens: body.max_tokens ?? 512,
        stream: false,
      };
      const data = await fetchJson(`${PROVIDER_CONFIG.deepseek.baseUrl}/chat/completions`, {
        method: "POST",
        headers: authHeaders(PROVIDER_CONFIG.deepseek.apiKey),
        body: JSON.stringify(payload),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/featherless/chat/completions") {
      assertConfigured("featherless");
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || PROVIDER_CONFIG.featherless.models.fastVision,
        messages: body.messages || [{ role: "user", content: body.prompt || "Say hello." }],
        temperature: body.temperature ?? 0.2,
        max_tokens: body.max_tokens ?? 512,
        stream: false,
      };
      const data = await fetchJson(`${PROVIDER_CONFIG.featherless.baseUrl}/chat/completions`, {
        method: "POST",
        headers: authHeaders(PROVIDER_CONFIG.featherless.apiKey),
        body: JSON.stringify(payload),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/openai/chat/completions") {
      assertConfigured("openai");
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || PROVIDER_CONFIG.openai.models.chat,
        messages: body.messages || [{ role: "user", content: body.prompt || "Say hello." }],
        temperature: body.temperature ?? 0.2,
        max_tokens: body.max_tokens ?? body.max_completion_tokens ?? 512,
        stream: false,
      };
      const data = await fetchJson(`${PROVIDER_CONFIG.openai.baseUrl}/chat/completions`, {
        method: "POST",
        headers: authHeaders(PROVIDER_CONFIG.openai.apiKey),
        body: JSON.stringify(payload),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/minimax/chat/completions") {
      assertConfigured("minimax");
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || PROVIDER_CONFIG.minimax.models.chat,
        messages: body.messages || [{ role: "user", content: body.prompt || "Say hello." }],
        temperature: body.temperature ?? 0.2,
        max_tokens: body.max_tokens ?? 512,
        stream: false,
      };
      const apiKey = PROVIDER_CONFIG.minimax.apiKey;
      const baseUrl = apiKey.startsWith("sk-cp-")
        ? "https://api.minimax.io/v1"
        : "https://api.minimax.chat/v1";
      const data = await fetchJson(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify(payload),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/openai/image") {
      assertConfigured("openai");
      const body = await readJsonBody(req);
      const payload = {
        model: body.model || PROVIDER_CONFIG.openai.models.image,
        prompt: body.prompt || "Create a clean educational illustration.",
        quality: body.quality || PROVIDER_CONFIG.openai.models.imageQuality,
        size: body.size || "1024x1024",
      };
      const data = await fetchJson(`${PROVIDER_CONFIG.openai.baseUrl}/images/generations`, {
        method: "POST",
        headers: authHeaders(PROVIDER_CONFIG.openai.apiKey),
        body: JSON.stringify(payload),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/gemini/chat") {
      assertConfigured("gemini");
      const body = await readJsonBody(req);
      const data = await geminiGenerateContent({
        model: body.model || PROVIDER_CONFIG.gemini.models.chat,
        body: {
          contents: body.contents || openAiMessagesToGeminiContents(body.messages || [{ role: "user", content: body.prompt || "Say hello." }]),
          system_instruction: body.system_instruction ? { parts: [{ text: String(body.system_instruction) }] } : undefined,
          generationConfig: body.generationConfig || body.generation_config,
        },
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/gemini/image") {
      assertConfigured("gemini");
      const body = await readJsonBody(req);
      const prompt = body.prompt || "Create a clean educational illustration.";
      const imageModel = body.model || PROVIDER_CONFIG.gemini.models.image;
      const data = await geminiGenerateContent({
        model: imageModel,
        body: {
          contents: body.contents || [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: Object.assign({
            responseModalities: ["TEXT", "IMAGE"],
          }, body.generationConfig || body.generation_config || {}),
        },
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/gemini/tts") {
      assertConfigured("gemini");
      const body = await readJsonBody(req);
      const data = await geminiGenerateContent({
        model: body.model || PROVIDER_CONFIG.gemini.models.tts,
        body: {
          contents: body.contents || [{ role: "user", parts: [{ text: body.text || "Halo dari CORTEX." }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: body.voiceName || "Kore",
                },
              },
            },
          },
        },
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/gemini/video/generate") {
      assertConfigured("gemini");
      const body = await readJsonBody(req);
      const data = await fetchJson(`${PROVIDER_CONFIG.gemini.baseUrl}/models/${encodeURIComponent(body.model || PROVIDER_CONFIG.gemini.models.videoGeneration)}:predictLongRunning?key=${encodeURIComponent(PROVIDER_CONFIG.gemini.apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: body.instances || [{ prompt: body.prompt || "A clean futuristic medical dashboard animating gently in a soft blue atmosphere." }],
          parameters: Object.assign({
            aspectRatio: "16:9",
          }, body.parameters || {}),
        }),
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/providers/gemini/video/operations/")) {
      assertConfigured("gemini");
      const operationName = decodeURIComponent(url.pathname.replace("/providers/gemini/video/operations/", ""));
      const data = await fetchJson(`${PROVIDER_CONFIG.gemini.baseUrl}/${operationName}?key=${encodeURIComponent(PROVIDER_CONFIG.gemini.apiKey)}`, {
        method: "GET",
      });
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "POST" && url.pathname === "/providers/gemini/files") {
      assertConfigured("gemini");
      const body = await readJsonBody(req);
      const data = await uploadGeminiFile(body);
      writeJson(res, 200, data);
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/providers/gemini/files/")) {
      assertConfigured("gemini");
      const fileName = decodeURIComponent(url.pathname.replace("/providers/gemini/files/", ""));
      const data = await fetchJson(`${PROVIDER_CONFIG.gemini.baseUrl}/${fileName}?key=${encodeURIComponent(PROVIDER_CONFIG.gemini.apiKey)}`, {
        method: "GET",
      });
      writeJson(res, 200, data);
      return;
    }

    writeJson(res, 404, { ok: false, error: `Unknown route: ${url.pathname}` });
  } catch (error) {
    writeJson(res, error.statusCode || 500, {
      ok: false,
      error: error.message || "Unknown proxy error",
      provider: error.provider || undefined,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CORTEX AI proxy listening at http://${HOST}:${PORT}`);
});

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

function buildHealthPayload() {
  return {
    ok: true,
    proxyBaseUrl: `http://${HOST}:${PORT}`,
    repoRoot,
    providers: {
      gemini: {
        configured: PROVIDER_CONFIG.gemini.configured,
        models: PROVIDER_CONFIG.gemini.models,
      },
      deepseek: {
        configured: PROVIDER_CONFIG.deepseek.configured,
        models: PROVIDER_CONFIG.deepseek.models,
      },
      featherless: {
        configured: PROVIDER_CONFIG.featherless.configured,
        models: PROVIDER_CONFIG.featherless.models,
      },
      openai: {
        configured: PROVIDER_CONFIG.openai.configured,
        models: PROVIDER_CONFIG.openai.models,
      },
      minimax: {
        configured: PROVIDER_CONFIG.minimax.configured,
        models: PROVIDER_CONFIG.minimax.models,
      },
    },
  };
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  });
  res.end(statusCode === 204 ? "" : JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function authHeaders(apiKey) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function assertConfigured(providerKey) {
  const config = PROVIDER_CONFIG[providerKey];
  if (!config || !config.configured) {
    const error = new Error(`${config ? config.label : providerKey} belum dikonfigurasi di local proxy.`);
    error.statusCode = 400;
    error.provider = providerKey;
    throw error;
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : {};
  if (!response.ok) {
    const error = new Error(data?.error?.message || data?.error || `HTTP ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }
  return data;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function geminiGenerateContent({ model, body }) {
  const payload = {
    contents: normalizeGeminiContents(body.contents || []),
  };
  if (body.system_instruction) payload.system_instruction = body.system_instruction;
  if (body.generationConfig) payload.generationConfig = body.generationConfig;
  return fetchJson(`${PROVIDER_CONFIG.gemini.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(PROVIDER_CONFIG.gemini.apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function openAiMessagesToGeminiContents(messages) {
  return (messages || []).map(message => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: normalizeOpenAiContentParts(message.content),
  }));
}

function normalizeOpenAiContentParts(content) {
  if (Array.isArray(content)) {
    return content.map(part => normalizeOpenAiPart(part)).filter(Boolean);
  }
  if (typeof content === "string") {
    return [{ text: content }];
  }
  if (content && typeof content === "object") {
    return [normalizeOpenAiPart(content)].filter(Boolean);
  }
  return [{ text: "" }];
}

function normalizeOpenAiPart(part) {
  if (!part) return null;
  if (part.text) return { text: String(part.text) };
  if (part.type === "text") return { text: String(part.text || "") };
  if (part.inlineData) return { inline_data: part.inlineData };
  if (part.fileData) return { file_data: part.fileData };
  if (part.type === "image" || part.type === "video" || part.type === "audio") {
    if (part.fileUri) {
      return {
        file_data: {
          file_uri: part.fileUri,
          mime_type: part.mimeType || undefined,
        },
      };
    }
    return {
      inline_data: {
        mime_type: part.mimeType || mimeFromType(part.type),
        data: part.data || "",
      },
    };
  }
  if (part.type === "input_text") return { text: String(part.text || "") };
  if (part.type === "input_image" && part.image_url?.url) {
    return {
      file_data: {
        file_uri: part.image_url.url,
      },
    };
  }
  return null;
}

function mimeFromType(type) {
  if (type === "image") return "image/png";
  if (type === "video") return "video/mp4";
  if (type === "audio") return "audio/wav";
  return "application/octet-stream";
}

function normalizeGeminiContents(contents) {
  return (contents || []).map(entry => {
    if (typeof entry === "string") {
      return { role: "user", parts: [{ text: entry }] };
    }
    if (entry.parts) {
      return {
        role: entry.role || "user",
        parts: entry.parts.map(part => {
          if (part.text) return { text: String(part.text) };
          if (part.inlineData) return { inline_data: part.inlineData };
          if (part.inline_data) return { inline_data: part.inline_data };
          if (part.fileData) return { file_data: part.fileData };
          if (part.file_data) return { file_data: part.file_data };
          if (part.videoMetadata) {
            return {
              file_data: part.fileData || part.file_data,
              video_metadata: part.videoMetadata,
            };
          }
          return part;
        }),
      };
    }
    return entry;
  });
}

async function uploadGeminiFile(body) {
  const displayName = body.displayName || "CORTEX_FILE";
  const mimeType = body.mimeType || "application/octet-stream";
  const base64Data = body.data;
  if (!base64Data) {
    const error = new Error("Field data (base64) wajib diisi untuk upload file Gemini.");
    error.statusCode = 400;
    throw error;
  }
  const binary = Buffer.from(base64Data, "base64");
  const startResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${encodeURIComponent(PROVIDER_CONFIG.gemini.apiKey)}`, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(binary.length),
      "X-Goog-Upload-Header-Content-Type": mimeType,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: displayName } }),
  });
  if (!startResponse.ok) {
    throw new Error(`Gemini file upload start gagal: HTTP ${startResponse.status}`);
  }
  const uploadUrl = startResponse.headers.get("x-goog-upload-url");
  if (!uploadUrl) {
    throw new Error("Gemini file upload URL tidak ditemukan.");
  }
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Length": String(binary.length),
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
    },
    body: binary,
  });
  const data = safeJsonParse(await uploadResponse.text());
  if (!uploadResponse.ok) {
    throw new Error(data?.error?.message || `Gemini file upload gagal: HTTP ${uploadResponse.status}`);
  }
  return data;
}
