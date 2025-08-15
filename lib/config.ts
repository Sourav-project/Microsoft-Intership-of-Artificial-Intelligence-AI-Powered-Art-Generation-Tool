export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: "https://api.openai.com/v1",
    model: "dall-e-3",
    maxRetries: 3,
    timeout: 60000, // 60 seconds
  },
  app: {
    name: "AI Art Generation",
    version: "1.0.0",
  },
} as const

export function validateConfig() {
  const errors: string[] = []

  if (!config.openai.apiKey) {
    errors.push("OPENAI_API_KEY environment variable is required")
  }

  if (config.openai.apiKey && !config.openai.apiKey.startsWith("sk-")) {
    errors.push("OPENAI_API_KEY must start with 'sk-'")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
