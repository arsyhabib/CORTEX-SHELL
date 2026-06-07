import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
loadEnvFile(path.join(__dirname, ".env"));

const proxyBase = process.env.CORTEX_AI_PROXY_URL || `http://${process.env.CORTEX_AI_PROXY_HOST || "127.0.0.1"}:${process.env.CORTEX_AI_PROXY_PORT || "8787"}`;
const artifactsDir = path.join(__dirname, "artifacts");
const sampleVideoPath = path.join(artifactsDir, "sample-video.mp4");
mkdirSync(artifactsDir, { recursive: true });

const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR42mP8z8BQDwAFgwJ/l7sRKQAAAABJRU5ErkJggg==";

await ensureSampleVideo();

const tests = [
  {
    name: "health",
    run: () => getJson("/health"),
  },
  {
    name: "gemini-chat-text",
    run: () => postJson("/providers/gemini/chat", {
      model: "gemini-2.5-flash",
      messages: [
        { role: "user", content: "Jawab dengan tepat dua kata: SIAP CORTEX" },
      ],
      generationConfig: { temperature: 0 },
    }),
  },
  {
    name: "gemini-chat-image",
    run: async () => {
      const upload = await postJson("/providers/gemini/files", {
        displayName: "tiny-red.png",
        mimeType: "image/png",
        data: tinyPngBase64,
      });
      return postJson("/providers/gemini/chat", {
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  fileUri: upload.file.uri,
                  mimeType: "image/png",
                },
              },
              {
                text: "Sebutkan warna dominan gambar ini dalam satu atau dua kata.",
              },
            ],
          },
        ],
        generationConfig: { temperature: 0 },
      });
    },
  },
  {
    name: "gemini-chat-video",
    run: async () => {
      const upload = await postJson("/providers/gemini/files", {
        displayName: "sample-video.mp4",
        mimeType: "video/mp4",
        data: readFileSync(sampleVideoPath).toString("base64"),
      });
      await waitForGeminiFile(upload.file.name);
      return postJson("/providers/gemini/chat", {
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  fileUri: upload.file.uri,
                  mimeType: "video/mp4",
                },
              },
              {
                text: "Describe this video in one short sentence.",
              },
            ],
          },
        ],
        generationConfig: { temperature: 0 },
      });
    },
  },
  {
    name: "gemini-image-generate",
    run: () => postJson("/providers/gemini/image", {
      model: "nano-banana-pro-preview",
      prompt: "Create a playful premium medical app icon with cyan glass, coral highlights, soft gradients, and no text.",
    }),
  },
  {
    name: "gemini-tts",
    run: () => postJson("/providers/gemini/tts", {
      model: "gemini-2.5-flash-preview-tts",
      text: "Halo, workspace CORTEX siap digunakan.",
      voiceName: "Kore",
    }),
  },
  {
    name: "deepseek-chat",
    run: () => postJson("/providers/deepseek/chat/completions", {
      model: "deepseek-v4-flash",
      messages: [
        { role: "user", content: "Balas persis: DEEPSEEK SIAP" },
      ],
      temperature: 0,
      max_tokens: 24,
    }),
  },
  {
    name: "featherless-gemma-4b",
    run: () => postJson("/providers/featherless/chat/completions", {
      model: "unsloth/gemma-3-4b-it",
      messages: [
        { role: "user", content: "Balas persis: FEATHERLESS 4B SIAP" },
      ],
      temperature: 0,
      max_tokens: 32,
    }),
  },
  {
    name: "featherless-gemma-12b",
    run: () => postJson("/providers/featherless/chat/completions", {
      model: "unsloth/gemma-3-12b-it",
      messages: [
        { role: "user", content: "Balas persis: FEATHERLESS 12B SIAP" },
      ],
      temperature: 0,
      max_tokens: 32,
    }),
  },
  {
    name: "featherless-qwen2-vl-2b",
    run: async () => {
      await sleep(65000);
      return postJson("/providers/featherless/chat/completions", {
        model: "Kaushika04/Qwen2-VL-2B-Instruct-LoRA-FT_video_finetuned",
        messages: [
          { role: "user", content: "Perkenalkan dirimu dalam paling banyak lima kata." },
        ],
        temperature: 0,
        max_tokens: 40,
      });
    },
  },
];

const results = [];
for (const test of tests) {
  const startedAt = Date.now();
  try {
    const payload = await test.run();
    const latencyMs = Date.now() - startedAt;
    const summary = summarizePayload(payload);
    results.push({ name: test.name, ok: true, latencyMs, summary });
    console.log(`${test.name}: OK (${latencyMs}ms) ${summary}`);
    if (test.name === "gemini-image-generate") saveGeneratedImage(payload);
    if (test.name === "gemini-tts") saveGeneratedAudio(payload);
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    results.push({ name: test.name, ok: false, latencyMs, error: error.message });
    console.log(`${test.name}: FAIL (${latencyMs}ms) ${error.message}`);
  }
}

writeFileSync(path.join(artifactsDir, "provider-test-report.json"), JSON.stringify({
  proxyBase,
  generatedAt: new Date().toISOString(),
  results,
}, null, 2));

if (results.some(result => !result.ok)) process.exitCode = 1;

async function getJson(route) {
  const response = await fetch(`${proxyBase}${route}`, { method: "GET" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  return payload;
}

async function postJson(route, body) {
  const response = await fetch(`${proxyBase}${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  return payload;
}

async function waitForGeminiFile(fileName) {
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    const payload = await getJson(`/providers/gemini/files/${encodeURIComponent(fileName)}`);
    if (payload?.state === "ACTIVE") return payload;
    await sleep(3000);
  }
  throw new Error(`Gemini file ${fileName} tidak menjadi ACTIVE dalam batas waktu.`);
}

function summarizePayload(payload) {
  if (!payload) return "no payload";
  if (payload.providers) return "health ok";
  if (payload.candidates?.[0]?.content?.parts) {
    const textPart = payload.candidates[0].content.parts.find(part => typeof part.text === "string");
    const binaryPart = payload.candidates[0].content.parts.find(part => part.inlineData || part.inline_data);
    if (textPart?.text) return truncate(textPart.text);
    const mimeType = binaryPart?.inlineData?.mimeType || binaryPart?.inlineData?.mime_type || binaryPart?.inline_data?.mimeType || binaryPart?.inline_data?.mime_type || "";
    if (mimeType.startsWith("image/")) return "image bytes returned";
    if (mimeType.startsWith("audio/")) return "audio bytes returned";
    if (binaryPart) return "binary payload returned";
  }
  if (payload.choices?.[0]?.message?.content) return truncate(payload.choices[0].message.content);
  if (payload.name) return `operation ${payload.name}`;
  return truncate(JSON.stringify(payload));
}

function truncate(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length > 110 ? `${clean.slice(0, 107)}...` : clean;
}

function saveGeneratedImage(payload) {
  const imagePart = payload?.candidates?.[0]?.content?.parts?.find(part => {
    const mimeType = part?.inlineData?.mimeType || part?.inlineData?.mime_type || part?.inline_data?.mimeType || part?.inline_data?.mime_type || "";
    return mimeType.startsWith("image/");
  });
  const data = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
  if (!data) return;
  writeFileSync(path.join(artifactsDir, "gemini-image-probe.png"), Buffer.from(data, "base64"));
}

function saveGeneratedAudio(payload) {
  const audioPart = payload?.candidates?.[0]?.content?.parts?.find(part => {
    const mimeType = part?.inlineData?.mimeType || part?.inlineData?.mime_type || part?.inline_data?.mimeType || part?.inline_data?.mime_type || "";
    return mimeType.startsWith("audio/");
  });
  const data = audioPart?.inlineData?.data || audioPart?.inline_data?.data;
  if (!data) return;
  writeFileSync(path.join(artifactsDir, "gemini-tts-probe.wav"), Buffer.from(data, "base64"));
}

async function ensureSampleVideo() {
  if (existsSync(sampleVideoPath)) return;
  const response = await fetch("https://samplefile.com/samples/download/video/mp4/mp4_5s_sample_file_279KB.mp4");
  if (!response.ok) throw new Error(`Sample video download failed: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(sampleVideoPath, buffer);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
