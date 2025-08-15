import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY

  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyFormat: apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : "Not found",
    keyStartsWithSk: apiKey?.startsWith("sk-") || false,
    keyLength: apiKey?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
