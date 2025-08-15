"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap, Clock, Key, Wifi } from "lucide-react"

interface ApiHealthResult {
  status: "healthy" | "unhealthy" | "unconfigured"
  message: string
  details?: {
    hasApiKey: boolean
    apiKeyValid: boolean
    connectionTest: boolean
    responseTime?: number
  }
}

interface TestResult {
  success: boolean
  imageUrl?: string
  error?: string
  metadata?: {
    generationTime: number
    model: string
  }
}

export function ApiStatus() {
  const [healthStatus, setHealthStatus] = useState<ApiHealthResult | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const checkApiHealth = async () => {
    setIsCheckingHealth(true)
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthStatus(data)
      setShowDetails(data.status !== "healthy")
    } catch (error) {
      setHealthStatus({
        status: "unhealthy",
        message: "Failed to check API health",
      })
      setShowDetails(true)
    } finally {
      setIsCheckingHealth(false)
    }
  }

  const runGenerationTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/generate-test-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "A simple test image of a blue circle" }),
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Test request failed",
      })
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    checkApiHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "unconfigured":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-200"
      case "unconfigured":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!healthStatus && !isCheckingHealth) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">API Configuration Status</CardTitle>
            {healthStatus && (
              <Badge className={getStatusColor(healthStatus.status)}>
                {getStatusIcon(healthStatus.status)}
                <span className="ml-1 capitalize">{healthStatus.status}</span>
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={checkApiHealth} disabled={isCheckingHealth}>
              <RefreshCw className={`h-4 w-4 ${isCheckingHealth ? "animate-spin" : ""}`} />
              <span className="ml-1 hidden sm:inline">Check</span>
            </Button>
            {healthStatus?.status === "healthy" && (
              <Button variant="outline" size="sm" onClick={runGenerationTest} disabled={isTesting}>
                <Zap className={`h-4 w-4 ${isTesting ? "animate-pulse" : ""}`} />
                <span className="ml-1 hidden sm:inline">Test</span>
              </Button>
            )}
          </div>
        </div>
        <CardDescription>{isCheckingHealth ? "Checking API configuration..." : healthStatus?.message}</CardDescription>
      </CardHeader>

      {(showDetails || healthStatus?.status !== "healthy") && (
        <CardContent className="space-y-4">
          {healthStatus?.details && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">API Key</span>
                {healthStatus.details.hasApiKey ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Valid</span>
                {healthStatus.details.apiKeyValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Connection</span>
                {healthStatus.details.connectionTest ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              {healthStatus.details.responseTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{healthStatus.details.responseTime}ms</span>
                </div>
              )}
            </div>
          )}

          {healthStatus?.status === "unconfigured" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Setup Required</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p>To enable AI image generation, you need to configure your OpenAI API key:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Get an API key from{" "}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        OpenAI Platform
                      </a>
                    </li>
                    <li>
                      Add it to your environment variables:{" "}
                      <code className="bg-muted px-1 rounded">OPENAI_API_KEY=sk-...</code>
                    </li>
                    <li>Restart your development server</li>
                    <li>Click the "Check" button above to verify</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {healthStatus?.status === "unhealthy" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Configuration Issue</AlertTitle>
              <AlertDescription>
                There's an issue with your API configuration. Please check your API key and network connection.
              </AlertDescription>
            </Alert>
          )}

          {testResult && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Generation Test Result
                </h4>
                {testResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Test generation successful!</span>
                      {testResult.metadata && <Badge variant="secondary">{testResult.metadata.generationTime}ms</Badge>}
                    </div>
                    {testResult.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={testResult.imageUrl || "/placeholder.svg"}
                          alt="Test generation"
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{testResult.error}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {isTesting && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Running generation test...</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
