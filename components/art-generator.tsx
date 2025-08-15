"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  RefreshCw,
  Download,
  Share2,
  Paintbrush,
  Music,
  FileText,
  Copy,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react"

interface GenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  fallback?: boolean
  revisedPrompt?: string
  metadata?: {
    model: string
    responseTime: number
    size: string
    quality: string
  }
}

export function ArtGenerator() {
  const [imagePrompt, setImagePrompt] = useState("")
  const [musicPrompt, setMusicPrompt] = useState("")
  const [textPrompt, setTextPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [complexity, setComplexity] = useState([50])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null)
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("image")
  const [lastResult, setLastResult] = useState<GenerationResult | null>(null)

  const generateRandomPlaceholder = (seed: string, type: "music" | "text") => {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000
    if (type === "music") {
      return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(hash % 16) + 1}.mp3`
    } else if (type === "text") {
      const mockTexts = [
        "In a realm where dreams intertwine with reality, a lone star whispered secrets to the ancient trees, painting the night sky with hues of forgotten magic. The wind carried tales of old, and the rivers flowed with echoes of laughter from a time long past.",
        "The city hummed a symphony of ambition and despair, its neon glow reflecting off rain-slicked streets. A detective, weary from endless nights, traced the faint scent of jasmine and betrayal, knowing that every shadow held a story untold.",
        "A tiny robot, no bigger than a thumb, discovered a forgotten garden on the edge of the universe. Its metallic heart whirred with wonder as it observed the bioluminescent flora, a testament to life's persistent beauty even in the void.",
        "The old lighthouse keeper, with eyes as deep as the ocean, watched the storm brew. Each crashing wave brought memories of a love lost to the sea, yet he stood firm, a beacon of hope against the relentless tide.",
      ]
      return mockTexts[hash % mockTexts.length]
    }
    return ""
  }

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return

    console.log("🎨 Starting image generation...")
    setIsGenerating(true)
    setGeneratedImage(null)
    setLastResult(null)

    try {
      // Determine settings based on complexity
      let size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024"
      if (complexity[0] > 70) {
        size = "1792x1024" // Landscape for high complexity
      } else if (complexity[0] < 30) {
        size = "1024x1792" // Portrait for low complexity
      }

      const quality = complexity[0] > 50 ? "hd" : "standard"

      console.log("Generation settings:", { prompt: imagePrompt, style, size, quality })

      // Call our API route
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          style,
          size,
          quality,
        }),
      })

      const result: GenerationResult = await response.json()
      console.log("API Result:", result)

      setLastResult(result)

      if (result.success && result.imageUrl) {
        console.log("✅ Real AI image generated successfully!")
        setGeneratedImage(result.imageUrl)
      } else if (result.fallback) {
        console.log("⚠️ Falling back to placeholder")
        // Generate placeholder as fallback
        const hash = Array.from(imagePrompt + style).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000
        const placeholderUrl = `/placeholder.svg?height=1024&width=1024&text=AI+Art+${hash}`
        setGeneratedImage(placeholderUrl)
        setLastResult({
          ...result,
          imageUrl: placeholderUrl,
          metadata: {
            model: "placeholder",
            responseTime: 2000,
            size: "1024x1024",
            quality: "standard",
          },
        })
      } else {
        console.log("❌ Generation failed:", result.error)
      }
    } catch (error) {
      console.error("❌ Client error:", error)
      setLastResult({
        success: false,
        error: "Network error occurred",
        fallback: true,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    if (activeTab === "image") {
      handleImageGeneration()
    } else if (activeTab === "music") {
      if (!musicPrompt) return
      setIsGenerating(true)
      setGeneratedMusic(null)
      setTimeout(() => {
        const newMusic = generateRandomPlaceholder(musicPrompt + Date.now(), "music")
        setGeneratedMusic(newMusic)
        setIsGenerating(false)
      }, 2000)
    } else if (activeTab === "text") {
      if (!textPrompt) return
      setIsGenerating(true)
      setGeneratedText(null)
      setTimeout(() => {
        const newText = generateRandomPlaceholder(textPrompt + Date.now(), "text")
        setGeneratedText(newText)
        setIsGenerating(false)
      }, 2000)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleDownload = async (type: "image" | "music" | "text") => {
    if (type === "image" && generatedImage) {
      try {
        const response = await fetch(generatedImage)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `ai-artwork-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Download failed:", error)
        alert("Download failed. Please try right-clicking the image and selecting 'Save image as...'")
      }
    } else if (type === "music" && generatedMusic) {
      const link = document.createElement("a")
      link.href = generatedMusic
      link.download = "ai-music.mp3"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (type === "text" && generatedText) {
      const blob = new Blob([generatedText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "ai-writing.txt"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleShare = async (type: "image" | "music" | "text") => {
    let shareData: ShareData = {}

    if (type === "image" && generatedImage) {
      shareData = {
        title: "AI Generated Artwork",
        text: `Check out this AI-generated artwork: "${imagePrompt}"`,
        url: generatedImage,
      }
    } else if (type === "music" && generatedMusic) {
      shareData = {
        title: "AI Generated Music",
        text: `Listen to this AI-generated music: "${musicPrompt}"`,
        url: generatedMusic,
      }
    } else if (type === "text" && generatedText) {
      shareData = {
        title: "AI Generated Writing",
        text: generatedText.substring(0, 100) + "...",
      }
    }

    if (navigator.share && Object.keys(shareData).length > 0) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Share cancelled or failed:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url || ""}`
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToShare)
        alert("Share content copied to clipboard!")
      } else {
        alert(`Share this content:\n${textToShare}`)
      }
    }
  }

  const handleCopyText = async () => {
    if (generatedText && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(generatedText)
        alert("Text copied to clipboard!")
      } catch (error) {
        console.error("Copy failed:", error)
        alert("Copy failed. Please select and copy the text manually.")
      }
    }
  }

  const getQualityInfo = () => {
    const quality = complexity[0] > 50 ? "HD" : "Standard"
    const size = complexity[0] > 70 ? "Landscape" : complexity[0] < 30 ? "Portrait" : "Square"
    return `${quality} Quality • ${size} Format`
  }

  const isRealAI = lastResult?.success && !lastResult?.fallback
  const isPlaceholder = lastResult?.fallback || lastResult?.metadata?.model === "placeholder"

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800 sm:p-6">
      <Tabs defaultValue="image" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image" className="text-xs sm:text-sm">
            Image
          </TabsTrigger>
          <TabsTrigger value="music" className="text-xs sm:text-sm">
            Music
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs sm:text-sm">
            Text
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-4 sm:mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-prompt" className="text-sm font-medium">
                  Describe your image
                </Label>
                <Input
                  id="image-prompt"
                  placeholder="A surreal landscape with floating islands and waterfalls..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="text-sm"
                  maxLength={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Be specific and descriptive for best results</span>
                  <span>{imagePrompt.length}/1000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Art Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["realistic", "abstract", "digital", "painterly"].map((styleOption) => (
                    <Button
                      key={styleOption}
                      variant={style === styleOption ? "default" : "outline"}
                      onClick={() => setStyle(styleOption)}
                      className="h-9 text-xs capitalize sm:h-10 sm:text-sm"
                    >
                      {styleOption}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="complexity" className="text-sm font-medium">
                    Quality & Detail
                  </Label>
                  <span className="text-xs text-muted-foreground sm:text-sm">{complexity[0]}%</span>
                </div>
                <Slider id="complexity" min={0} max={100} step={1} value={complexity} onValueChange={setComplexity} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{getQualityInfo()}</span>
                  <Badge variant="secondary" className="text-xs">
                    {complexity[0] > 50 ? "Slower" : "Faster"}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!imagePrompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </Button>

              {lastResult && !lastResult.success && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>Error:</strong> {lastResult.error}
                      </p>
                      {lastResult.fallback && (
                        <p className="text-sm">
                          <strong>Solution:</strong> Add your OpenAI API key to environment variables:
                          <br />
                          <code className="bg-muted px-1 rounded text-xs">OPENAI_API_KEY=sk-your-key-here</code>
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {lastResult && lastResult.success && (
                <Alert variant={isRealAI ? "default" : "destructive"}>
                  {isRealAI ? <CheckCircle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>
                          {isRealAI ? "✅ Real AI Generated!" : "⚠️ Placeholder Image"}
                          {lastResult.metadata && ` (${lastResult.metadata.responseTime}ms)`}
                        </span>
                        <Badge variant={isRealAI ? "default" : "secondary"}>
                          {lastResult.metadata?.model || "unknown"}
                        </Badge>
                      </div>
                      {lastResult.revisedPrompt && (
                        <details className="text-xs">
                          <summary className="cursor-pointer hover:text-foreground">AI Enhanced Prompt</summary>
                          <p className="mt-1 text-muted-foreground">{lastResult.revisedPrompt}</p>
                        </details>
                      )}
                      {isPlaceholder && (
                        <p className="text-xs text-muted-foreground">
                          Configure OpenAI API key to generate real AI images
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 min-h-[300px] sm:min-h-[400px]">
              {generatedImage ? (
                <div className="w-full space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="AI Generated artwork"
                      className="h-full w-full object-cover"
                      width={1024}
                      height={1024}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pb-safe">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      className="flex-1 min-w-0 sm:flex-none bg-transparent"
                      disabled={isGenerating}
                    >
                      <RefreshCw className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Regenerate</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("image")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare("image")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Share2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <Paintbrush className="h-5 w-5 text-purple-600 dark:text-purple-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-base font-medium sm:text-lg">Ready to Create AI Art</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Enter a detailed prompt and click generate to create your unique artwork with AI
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="music" className="mt-4 sm:mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="music-prompt" className="text-sm font-medium">
                  Describe your music
                </Label>
                <Input
                  id="music-prompt"
                  placeholder="A calm, ambient track with piano and strings..."
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!musicPrompt || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Music"
                )}
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 min-h-[300px] sm:min-h-[400px]">
              {generatedMusic ? (
                <div className="w-full space-y-4 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Music className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-base font-medium sm:text-lg">Generated Music</h3>
                  <audio controls src={generatedMusic} className="w-full max-w-xs" />
                  <div className="flex flex-wrap justify-center gap-2 pb-safe">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      className="flex-1 min-w-0 sm:flex-none bg-transparent"
                    >
                      <RefreshCw className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Regenerate</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("music")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare("music")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Share2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Music className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-base font-medium sm:text-lg">No Music Generated Yet</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Enter a prompt and click generate to create your music
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text" className="mt-4 sm:mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-prompt" className="text-sm font-medium">
                  Describe your creative writing
                </Label>
                <Textarea
                  id="text-prompt"
                  placeholder="A short story about a robot discovering a hidden garden..."
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!textPrompt || isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Text"
                )}
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 min-h-[300px] sm:min-h-[400px]">
              {generatedText ? (
                <div className="w-full space-y-4">
                  <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                    <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-center text-base font-medium sm:text-lg">Generated Text</h3>
                  <div className="max-h-48 overflow-y-auto rounded-md border p-3 text-xs text-muted-foreground sm:max-h-64 sm:p-4 sm:text-sm">
                    <p>{generatedText}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pb-safe">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                      className="flex-1 min-w-0 sm:flex-none bg-transparent"
                    >
                      <RefreshCw className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Regenerate</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyText}
                      className="flex-1 min-w-0 sm:flex-none bg-transparent"
                    >
                      <Copy className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Copy</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("text")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare("text")}
                      className="flex-1 min-w-0 sm:flex-none"
                    >
                      <Share2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                    <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-base font-medium sm:text-lg">No Text Generated Yet</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Enter a prompt and click generate to create your writing
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
