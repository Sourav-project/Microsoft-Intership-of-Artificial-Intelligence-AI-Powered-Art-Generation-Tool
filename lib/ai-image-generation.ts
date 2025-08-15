"use server"

import { config, validateConfig } from "./config"

export interface ImageGenerationOptions {
  prompt: string
  style?: string
  size?: "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
}

export interface ImageGenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  metadata?: {
    model: string
    prompt: string
    revisedPrompt?: string
    size: string
    quality: string
    generationTime: number
  }
}

export interface ApiHealthResult {
  status: "healthy" | "unhealthy" | "unconfigured"
  message: string
  details?: {
    hasApiKey: boolean
    apiKeyValid: boolean
    connectionTest: boolean
    responseTime?: number
  }
}

// Enhanced prompt based on style
function enhancePrompt(prompt: string, style: string): string {
  const styleEnhancements = {
    realistic: "photorealistic, highly detailed, professional photography, 8k resolution, sharp focus",
    abstract: "abstract art, modern artistic interpretation, creative composition, vibrant colors, artistic expression",
    digital:
      "digital art, concept art, detailed illustration, vibrant colors, professional digital artwork, trending on artstation",
    painterly:
      "oil painting style, artistic brushstrokes, fine art, masterpiece, classical painting technique, rich textures",
  }

  const enhancement = styleEnhancements[style as keyof typeof styleEnhancements] || ""
  return enhancement ? `${prompt}, ${enhancement}` : prompt
}

// Validate and sanitize prompt
function validatePrompt(prompt: string): { isValid: boolean; error?: string; sanitized: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: "Prompt cannot be empty", sanitized: "" }
  }

  const sanitized = prompt.trim()

  if (sanitized.length > 1000) {
    return { isValid: false, error: "Prompt is too long (max 1000 characters)", sanitized: "" }
  }

  if (sanitized.length < 3) {
    return { isValid: false, error: "Prompt is too short (min 3 characters)", sanitized: "" }
  }

  return { isValid: true, sanitized }
}

export async function testApiConnection(): Promise<ApiHealthResult> {
  const startTime = Date.now()

  try {
    const configValidation = validateConfig()

    if (!configValidation.isValid) {
      return {
        status: "unconfigured",
        message: configValidation.errors.join(", "),
        details: {
          hasApiKey: !!config.openai.apiKey,
          apiKeyValid: false,
          connectionTest: false,
        },
      }
    }

    // Test API connection with a minimal request
    const response = await fetch(`${config.openai.baseUrl}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.openai.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout for health check
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown API error" } }))
      return {
        status: "unhealthy",
        message: `API Error: ${errorData.error?.message || response.statusText}`,
        details: {
          hasApiKey: true,
          apiKeyValid: response.status !== 401,
          connectionTest: false,
          responseTime,
        },
      }
    }

    return {
      status: "healthy",
      message: "OpenAI API is configured and accessible",
      details: {
        hasApiKey: true,
        apiKeyValid: true,
        connectionTest: true,
        responseTime,
      },
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      status: "unhealthy",
      message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {
        hasApiKey: !!config.openai.apiKey,
        apiKeyValid: false,
        connectionTest: false,
        responseTime,
      },
    }
  }
}

export async function generateAIImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  const startTime = Date.now()

  try {
    // Validate configuration
    const configValidation = validateConfig()
    if (!configValidation.isValid) {
      return {
        success: false,
        error: `Configuration error: ${configValidation.errors.join(", ")}`,
      }
    }

    // Validate and sanitize prompt
    const promptValidation = validatePrompt(options.prompt)
    if (!promptValidation.isValid) {
      return {
        success: false,
        error: promptValidation.error,
      }
    }

    // Enhance prompt based on style
    const enhancedPrompt = enhancePrompt(promptValidation.sanitized, options.style || "realistic")

    // Prepare request payload
    const payload = {
      model: config.openai.model,
      prompt: enhancedPrompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
      response_format: "url" as const,
    }

    console.log("Generating image with payload:", { ...payload, prompt: payload.prompt.substring(0, 100) + "..." })

    // Make API request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.openai.timeout)

    const response = await fetch(`${config.openai.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openai.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: { message: `HTTP ${response.status}: ${response.statusText}` },
      }))

      console.error("OpenAI API Error:", errorData)

      // Handle specific error types
      if (response.status === 401) {
        return {
          success: false,
          error: "Invalid API key. Please check your OPENAI_API_KEY.",
        }
      } else if (response.status === 429) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again in a few moments.",
        }
      } else if (response.status === 400) {
        return {
          success: false,
          error: `Invalid request: ${errorData.error?.message || "Bad request"}`,
        }
      }

      return {
        success: false,
        error: errorData.error?.message || `API request failed with status ${response.status}`,
      }
    }

    const data = await response.json()
    const generationTime = Date.now() - startTime

    if (!data.data || !data.data[0] || !data.data[0].url) {
      return {
        success: false,
        error: "No image URL returned from API",
      }
    }

    console.log("Image generated successfully in", generationTime, "ms")

    return {
      success: true,
      imageUrl: data.data[0].url,
      metadata: {
        model: config.openai.model,
        prompt: options.prompt,
        revisedPrompt: data.data[0].revised_prompt,
        size: options.size || "1024x1024",
        quality: options.quality || "standard",
        generationTime,
      },
    }
  } catch (error) {
    const generationTime = Date.now() - startTime

    console.error("Image generation error:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timed out. Please try again with a simpler prompt.",
        }
      }

      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred during image generation",
    }
  }
}

// Fallback function for when API is not available
export async function generatePlaceholderImage(prompt: string, style: string): Promise<ImageGenerationResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const hash = Array.from(prompt + style).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000

  return {
    success: true,
    imageUrl: `/placeholder.svg?height=1024&width=1024&text=AI+Art+${hash}`,
    metadata: {
      model: "placeholder",
      prompt,
      size: "1024x1024",
      quality: "standard",
      generationTime: 2000,
    },
  }
}
