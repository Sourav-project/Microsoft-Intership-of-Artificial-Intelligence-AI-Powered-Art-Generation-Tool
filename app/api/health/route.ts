import { NextResponse } from "next/server"
import { testApiConnection } from "@/lib/ai-image-generation"

export async function GET() {
  try {
    const healthCheck = await testApiConnection()

    return NextResponse.json(healthCheck, {
      status: healthCheck.status === "healthy" ? 200 : healthCheck.status === "unconfigured" ? 424 : 503,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
