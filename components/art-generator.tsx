"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw, Download, Share2, Paintbrush } from "lucide-react"
import Image from "next/image"

// Mock image URLs for demonstration
const mockImages = [
  "/placeholder.svg?height=512&width=512",
  "/placeholder.svg?height=512&width=512",
  "/placeholder.svg?height=512&width=512",
  "/placeholder.svg?height=512&width=512",
]

export function ArtGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [complexity, setComplexity] = useState([50])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!prompt) return

    setIsGenerating(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Pick a random mock image for demonstration
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
      setGeneratedImage(randomImage)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="music" disabled>
            Music
          </TabsTrigger>
          <TabsTrigger value="text" disabled>
            Text
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your image</Label>
                <Input
                  id="prompt"
                  placeholder="A surreal landscape with floating islands and waterfalls..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
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
                disabled={!prompt || isGenerating}
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
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated artwork"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
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
      </Tabs>
    </div>
  )
}
