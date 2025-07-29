"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw, Download, Share2, Paintbrush, Music, FileText, Copy } from "lucide-react"

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

  const generateRandomPlaceholder = (seed: string, type: "image" | "music" | "text") => {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000
    if (type === "image") {
      return `/placeholder.svg?height=512&width=512&text=AI+Art+${hash}`
    } else if (type === "music") {
      // Mock audio URL - in a real app, this would be a generated audio file
      return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(hash % 16) + 1}.mp3`
    } else if (type === "text") {
      // Mock generated text
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

  const handleGenerate = () => {
    setIsGenerating(true)
    setGeneratedImage(null)
    setGeneratedMusic(null)
    setGeneratedText(null)

    setTimeout(() => {
      if (activeTab === "image") {
        if (!imagePrompt) {
          setIsGenerating(false)
          return
        }
        const newImage = generateRandomPlaceholder(imagePrompt + style + complexity[0] + Date.now(), "image")
        setGeneratedImage(newImage)
      } else if (activeTab === "music") {
        if (!musicPrompt) {
          setIsGenerating(false)
          return
        }
        const newMusic = generateRandomPlaceholder(musicPrompt + Date.now(), "music")
        setGeneratedMusic(newMusic)
      } else if (activeTab === "text") {
        if (!textPrompt) {
          setIsGenerating(false)
          return
        }
        const newText = generateRandomPlaceholder(textPrompt + Date.now(), "text")
        setGeneratedText(newText)
      }
      setIsGenerating(false)
    }, 2000)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleDownload = (type: "image" | "music" | "text") => {
    if (type === "image" && generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "ai-artwork.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      alert("Image download initiated!")
    } else if (type === "music" && generatedMusic) {
      const link = document.createElement("a")
      link.href = generatedMusic
      link.download = "ai-music.mp3"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      alert("Music download initiated!")
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
      alert("Text download initiated!")
    }
  }

  const handleShare = (type: "image" | "music" | "text") => {
    let contentToShare = ""
    if (type === "image" && generatedImage) contentToShare = generatedImage
    else if (type === "music" && generatedMusic) contentToShare = generatedMusic
    else if (type === "text" && generatedText) contentToShare = generatedText

    if (contentToShare) {
      alert(
        `Sharing this ${type}: ${contentToShare.substring(0, 50)}...\n(In a real app, this would open a share dialog)`,
      )
    }
  }

  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText)
      alert("Text copied to clipboard!")
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
      <Tabs defaultValue="image" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-prompt">Describe your image</Label>
                <Input
                  id="image-prompt"
                  placeholder="A surreal landscape with floating islands and waterfalls..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Art Style</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["realistic", "abstract", "digital", "painterly"].map((styleOption) => (
                    <Button
                      key={styleOption}
                      variant={style === styleOption ? "default" : "outline"}
                      onClick={() => setStyle(styleOption)}
                      className="capitalize"
                    >
                      {styleOption}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="complexity">Complexity</Label>
                  <span className="text-sm text-muted-foreground">{complexity[0]}%</span>
                </div>
                <Slider id="complexity" min={0} max={100} step={1} value={complexity} onValueChange={setComplexity} />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!imagePrompt || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4">
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated artwork"
                      className="h-full w-full object-cover"
                      width={512}
                      height={512}
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload("image")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare("image")}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <Paintbrush className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">No Image Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a prompt and click generate to create your artwork
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="music" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="music-prompt">Describe your music</Label>
                <Input
                  id="music-prompt"
                  placeholder="A calm, ambient track with piano and strings..."
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4">
              {generatedMusic ? (
                <div className="space-y-4 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Music className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium">Generated Music</h3>
                  <audio controls src={generatedMusic} className="w-full max-w-xs" />
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload("music")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare("music")}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Music className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">No Music Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a prompt and click generate to create your music
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="text" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-prompt">Describe your creative writing</Label>
                <Textarea
                  id="text-prompt"
                  placeholder="A short story about a robot discovering a hidden garden..."
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  rows={5}
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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4">
              {generatedText ? (
                <div className="space-y-4 w-full">
                  <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                    <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-lg font-medium text-center">Generated Text</h3>
                  <div className="max-h-64 overflow-y-auto rounded-md border p-4 text-sm text-muted-foreground">
                    <p>{generatedText}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyText}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload("text")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare("text")}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                    <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">No Text Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
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
