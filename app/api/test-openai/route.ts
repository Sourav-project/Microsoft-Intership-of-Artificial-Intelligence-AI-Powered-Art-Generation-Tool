import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test if OpenAI API key is configured
    const hasApiKey = !!process.env.OPENAI_API_KEY

    if (!hasApiKey) {
      return NextResponse.json({
        configured: false,
        message: "OpenAI API key not found. Please add OPENAI_API_KEY to your environment variables.",
      })
    }

    // Test API connection (without making an actual request)
    return NextResponse.json({
      configured: true,
      message: "OpenAI API key is configured. Ready to generate images!",
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        message: "Error checking OpenAI configuration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
