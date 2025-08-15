import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style = "realistic", quality = "standard", size = "1024x1024" } = body

    console.log("=== IMAGE GENERATION REQUEST ===")
    console.log("Prompt:", prompt)
    console.log("Style:", style)
    console.log("Quality:", quality)
    console.log("Size:", size)

    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY
    console.log("API Key exists:", !!apiKey)
    console.log("API Key starts with sk-:", apiKey?.startsWith("sk-"))

    if (!apiKey) {
      console.log("❌ No API key found")
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured",
        fallback: true,
      })
    }

    if (!apiKey.startsWith("sk-")) {
      console.log("❌ Invalid API key format")
      return NextResponse.json({
        success: false,
        error: "Invalid OpenAI API key format",
        fallback: true,
      })
    }

    // Enhance prompt based on style
    const styleEnhancements = {
      realistic: "photorealistic, highly detailed, professional photography, 8k resolution",
      abstract: "abstract art, modern artistic interpretation, vibrant colors",
      digital: "digital art, concept art, detailed illustration, trending on artstation",
      painterly: "oil painting style, artistic brushstrokes, fine art masterpiece",
    }

    const enhancement = styleEnhancements[style as keyof typeof styleEnhancements] || ""
    const enhancedPrompt = enhancement ? `${prompt}, ${enhancement}` : prompt

    console.log("Enhanced prompt:", enhancedPrompt)

    // Make the API call
    console.log("🚀 Making OpenAI API call...")
    const startTime = Date.now()

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: quality,
        response_format: "url",
      }),
    })

    const responseTime = Date.now() - startTime
    console.log("API Response status:", response.status)
    console.log("API Response time:", responseTime + "ms")

    if (!response.ok) {
      const errorText = await response.text()
      console.log("❌ API Error Response:", errorText)

      let errorMessage = "Failed to generate image"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error?.message || errorMessage
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        fallback: true,
        debug: {
          status: response.status,
          statusText: response.statusText,
          responseTime,
        },
      })
    }

    const data = await response.json()
    console.log("✅ API Success! Image generated")
    console.log("Image URL:", data.data[0]?.url?.substring(0, 50) + "...")

    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.log("❌ No image URL in response")
      return NextResponse.json({
        success: false,
        error: "No image URL returned from OpenAI",
        fallback: true,
      })
    }

    return NextResponse.json({
      success: true,
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
      metadata: {
        model: "dall-e-3",
        responseTime,
        size,
        quality,
      },
    })
  } catch (error) {
    console.log("❌ Unexpected error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
      fallback: true,
    })
  }
}
