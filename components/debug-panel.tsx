"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Bug, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface DebugInfo {
  hasApiKey: boolean
  keyFormat: string
  keyStartsWithSk: boolean
  keyLength: number
  nodeEnv: string
  timestamp: string
}

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const checkEnvironment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-env")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Debug check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const runQuickTest = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "A simple red circle",
          style: "digital",
          quality: "standard",
          size: "1024x1024",
        }),
      })
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-lg">
              <Bug className="mr-2 h-5 w-5" />
              Debug Panel
            </CardTitle>
            <CardDescription>Check API configuration and test generation</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={checkEnvironment} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="ml-1 hidden sm:inline">Check Env</span>
            </Button>
            <Button variant="outline" size="sm" onClick={runQuickTest} disabled={isLoading}>
              <Bug className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Test API</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {debugInfo && (
          <div className="space-y-3">
            <h4 className="font-medium">Environment Check</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>API Key Present:</span>
                {debugInfo.hasApiKey ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" />
                    No
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Key Format:</span>
                <code className="text-xs bg-muted px-1 rounded">{debugInfo.keyFormat}</code>
              </div>
              <div className="flex items-center justify-between">
                <span>Valid Format:</span>
                {debugInfo.keyStartsWithSk ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" />
                    Invalid
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Key Length:</span>
                <Badge variant="secondary">{debugInfo.keyLength} chars</Badge>
              </div>
            </div>

            {!debugInfo.hasApiKey && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Missing API Key!</strong>
                  <br />
                  Add your OpenAI API key to environment variables:
                  <br />
                  <code className="bg-muted px-1 rounded text-xs">OPENAI_API_KEY=sk-your-key-here</code>
                </AlertDescription>
              </Alert>
            )}

            {debugInfo.hasApiKey && !debugInfo.keyStartsWithSk && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Invalid API Key Format!</strong>
                  <br />
                  OpenAI API keys should start with "sk-"
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {testResult && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">API Test Result</h4>
              {testResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      {testResult.fallback ? "Fallback successful" : "Real AI generation successful!"}
                    </span>
                    {testResult.metadata && <Badge variant="secondary">{testResult.metadata.responseTime}ms</Badge>}
                  </div>
                  {testResult.imageUrl && (
                    <img
                      src={testResult.imageUrl || "/placeholder.svg"}
                      alt="Test result"
                      className="w-16 h-16 rounded border object-cover"
                    />
                  )}
                  {testResult.fallback && (
                    <p className="text-xs text-yellow-700">
                      ⚠️ Using placeholder - configure API key for real AI generation
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">Test failed: {testResult.error}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Running diagnostics...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
