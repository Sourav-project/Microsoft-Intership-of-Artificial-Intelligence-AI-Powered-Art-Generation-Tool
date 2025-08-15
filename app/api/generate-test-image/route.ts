import { type NextRequest, NextResponse } from "next/server"
import { generateAIImage } from "@/lib/ai-image-generation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Test with a simple prompt
    const result = await generateAIImage({
      prompt: body.prompt || "A simple red circle on a white background",
      style: "digital",
      size: "1024x1024",
      quality: "standard",
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Test generation failed",
      },
      { status: 500 },
    )
  }
}
