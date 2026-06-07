window.__CORTEX_AI_LOCAL_CONFIG__ = {
  proxyUrl: "http://127.0.0.1:8787",
  provider: "CORTEX Secure Router",
  providerLabel: "Gemini + DeepSeek + Featherless + OpenAI via local secure proxy",
  providers: {
    gemini: {
      chatModel: "gemini-2.5-flash",
      imageModel: "nano-banana-pro-preview",
      videoModel: "veo-3.1-fast-generate-preview",
      ttsModel: "gemini-2.5-flash-preview-tts",
    },
    deepseek: {
      defaultModel: "deepseek-v4-flash",
    },
    featherless: {
      fastVisionModel: "unsloth/gemma-3-4b-it",
      balancedVisionModel: "unsloth/gemma-3-12b-it",
      videoReasoningModel: "Kaushika04/Qwen2-VL-2B-Instruct-LoRA-FT_video_finetuned",
    },
    openai: {
      chatModel: "gpt-4.1-nano",
      imageModel: "gpt-image-2",
      imageQuality: "low",
    },
  },
};
