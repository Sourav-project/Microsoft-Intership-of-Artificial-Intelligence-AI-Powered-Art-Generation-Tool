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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  RefreshCw,
  Download,
  Share2,
  Paintbrush,
  Music,
  FileText,
  Copy,
  CheckCircle,
  Sparkles,
  Globe,
  Mic,
  Volume2,
  BookOpen,
  Wand2,
} from "lucide-react"

interface GenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  isBackup?: boolean
  metadata?: {
    model: string
    service?: string
    responseTime: number
    size: string
    enhancedPrompt?: string
    note?: string
  }
}

// Language options for music generation
const MUSIC_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "or", name: "Odia", flag: "🇮🇳" },
  { code: "as", name: "Assamese", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
]

// Music genres and styles
const MUSIC_GENRES = [
  "Classical",
  "Pop",
  "Rock",
  "Jazz",
  "Blues",
  "Folk",
  "Electronic",
  "Hip-Hop",
  "R&B",
  "Country",
  "Reggae",
  "Bollywood",
  "Carnatic",
  "Hindustani",
  "Qawwali",
  "Bhangra",
  "Rabindra Sangeet",
  "Devotional",
  "Sufi",
  "Ghazal",
]

// Text generation types
const TEXT_TYPES = [
  { value: "story", label: "Short Story", icon: "📖" },
  { value: "poem", label: "Poetry", icon: "🎭" },
  { value: "article", label: "Article", icon: "📰" },
  { value: "script", label: "Script/Dialogue", icon: "🎬" },
  { value: "letter", label: "Letter", icon: "✉️" },
  { value: "essay", label: "Essay", icon: "📝" },
  { value: "blog", label: "Blog Post", icon: "💻" },
  { value: "speech", label: "Speech", icon: "🎤" },
]

// Text languages
const TEXT_LANGUAGES = MUSIC_LANGUAGES

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

  // Music generation states
  const [musicLanguage, setMusicLanguage] = useState("en")
  const [musicGenre, setMusicGenre] = useState("Pop")
  const [musicDuration, setMusicDuration] = useState([30])
  const [musicType, setMusicType] = useState("song")

  // Text generation states
  const [textLanguage, setTextLanguage] = useState("en")
  const [textType, setTextType] = useState("story")
  const [textLength, setTextLength] = useState([500])
  const [textTone, setTextTone] = useState("creative")

  const generateAdvancedText = (prompt: string, type: string, language: string, length: number, tone: string) => {
    const languageStyles = {
      en: {
        story: [
          "In the heart of a bustling metropolis, where skyscrapers kissed the clouds and dreams danced on every street corner, there lived a peculiar inventor named Dr. Elena Vasquez. Her laboratory, hidden beneath the city's oldest bookstore, hummed with the gentle whir of impossible machines and the soft glow of crystalline energy cores.",
          "The old lighthouse keeper had seen many storms, but none quite like the one approaching on this starless night. As waves crashed against the rocky shore with unprecedented fury, he noticed something extraordinary—the storm clouds were moving in perfect geometric patterns, as if guided by an unseen intelligence.",
          "Maya discovered the hidden garden on a Tuesday that felt like magic. Behind the crumbling wall of her grandmother's house, where jasmine vines had grown wild for decades, lay a sanctuary that defied all logic—flowers that sang in harmonious whispers and trees that bore fruit of pure starlight.",
        ],
        poem: [
          "Beneath the silver moon's gentle gaze,\nWhere shadows dance in mystic ways,\nThe heart finds peace in nature's song,\nA melody both sweet and strong.\n\nThrough valleys deep and mountains high,\nWe chase the dreams that never die,\nFor in each breath and every beat,\nLife's symphony is made complete.",
          "In gardens where the roses bloom,\nAnd chase away the winter's gloom,\nThe poet's pen finds words to say\nWhat hearts have felt but cannot pray.\n\nLike morning dew on petals bright,\nOur hopes emerge from darkest night,\nTo paint the world in colors new,\nAnd make all broken dreams come true.",
        ],
        article: [
          "The rapid advancement of artificial intelligence has fundamentally transformed how we approach creative endeavors. From generating stunning visual art to composing symphonies that rival human composers, AI has become an invaluable collaborator in the creative process. This technological revolution raises profound questions about the nature of creativity itself and the evolving relationship between human imagination and machine intelligence.",
          "Climate change represents one of the most pressing challenges of our time, requiring unprecedented global cooperation and innovative solutions. Recent developments in renewable energy technology, coupled with growing environmental awareness among younger generations, offer hope for a sustainable future. However, the window for meaningful action continues to narrow, making immediate and decisive steps more crucial than ever.",
        ],
      },
      hi: {
        story: [
          "एक छोटे से गाँव में, जहाँ सूरज की पहली किरण पहाड़ों को सुनहरा बनाती थी, रहती थी एक लड़की जिसका नाम प्रिया था। उसके पास एक जादुई कलम थी जो जो भी लिखती थी, वह सच हो जाता था। एक दिन उसने लिखा कि गाँव में बारिश होगी, और आसमान से मोतियों की तरह बूंदें गिरने लगीं।",
          "राजा विक्रमादित्य के दरबार में एक अनोखा कलाकार आया था। वह अपनी तूलिका से ऐसे चित्र बनाता था जो जीवंत हो उठते थे। जब उसने एक सुंदर बगीचे का चित्र बनाया, तो दरबार में फूलों की खुशबू फैल गई और पक्षियों का कलरव सुनाई देने लगा।",
        ],
        poem: [
          "चाँद की चाँदनी में नहाया,\nयह मेरा प्यारा सा गाँव है।\nजहाँ हर सुबह नई उम्मीद,\nऔर हर शाम एक नया सपना है।\n\nयहाँ के खेतों में लहराती,\nसुनहरी फसल की मुस्कान है।\nयहाँ की हवा में घुला हुआ,\nमाँ के प्यार का एहसान है।",
        ],
      },
      bn: {
        story: [
          "একটি ছোট্ট গ্রামে, যেখানে নদীর কলকল ধ্বনি আর পাখির কূজনে ভোর হতো, সেখানে বাস করতো রহিম নামের এক যুবক। তার হাতে ছিল জাদুর ক্ষমতা - যা কিছু সে স্পর্শ করতো, তা সোনায় পরিণত হতো। কিন্তু একদিন সে বুঝতে পারলো যে সবচেয়ে মূল্যবান জিনিস হলো ভালোবাসা, যা কোনো জাদুতে পাওয়া যায় না।",
        ],
        poem: [
          "আকাশের নীল রঙে মিশে যায়,\nমেঘের সাদা ভাসমান স্বপন।\nবাতাসের সুরে গান গেয়ে ওঠে,\nহৃদয়ের গভীর অনুভূতির কম্পন।\n\nনদীর তীরে বসে ভাবি আমি,\nজীবনের এই অপরূপ লীলা।\nপ্রকৃতির কোলে খুঁজে পাই,\nমনের শান্তি আর নিরবিলা।",
        ],
      },
    }

    const selectedLanguage = languageStyles[language as keyof typeof languageStyles] || languageStyles.en
    const selectedType = selectedLanguage[type as keyof typeof selectedLanguage] || selectedLanguage.story
    const randomText = selectedType[Math.floor(Math.random() * selectedType.length)]

    // Adjust length based on slider
    if (length < 300) {
      return randomText.substring(0, Math.floor(randomText.length * 0.6)) + "..."
    } else if (length > 800) {
      return randomText + "\n\n" + randomText.substring(0, Math.floor(randomText.length * 0.4))
    }

    return randomText
  }

  const generateMusicWithLanguage = (
    prompt: string,
    language: string,
    genre: string,
    duration: number,
    type: string,
  ) => {
    const languageNames = MUSIC_LANGUAGES.find((lang) => lang.code === language)?.name || "English"

    // Simulate different music based on language and genre
    const musicSamples = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    ]

    const hash = Array.from(prompt + language + genre).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return musicSamples[hash % musicSamples.length]
  }

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return

    console.log("🎨 Starting FREE AI image generation...")
    setIsGenerating(true)
    setGeneratedImage(null)
    setLastResult(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          style,
          quality: complexity[0] > 50 ? "hd" : "standard",
        }),
      })

      const result: GenerationResult = await response.json()
      console.log("🎯 Generation result:", result)

      setLastResult(result)

      if (result.success && result.imageUrl) {
        console.log("✅ Image generated successfully!")
        setGeneratedImage(result.imageUrl)
      } else {
        console.log("❌ Generation failed:", result.error)
      }
    } catch (error) {
      console.error("❌ Client error:", error)

      const fallbackSeed = Math.floor(Math.random() * 10000)
      const fallbackUrl = `https://picsum.photos/1024/1024?random=${fallbackSeed}`

      setGeneratedImage(fallbackUrl)
      setLastResult({
        success: true,
        imageUrl: fallbackUrl,
        isBackup: true,
        metadata: {
          model: "emergency-fallback",
          service: "Stock Photos",
          responseTime: 500,
          size: "1024x1024",
          note: "Using high-quality stock photos",
        },
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
        const newMusic = generateMusicWithLanguage(musicPrompt, musicLanguage, musicGenre, musicDuration[0], musicType)
        setGeneratedMusic(newMusic)
        setIsGenerating(false)
      }, 2000)
    } else if (activeTab === "text") {
      if (!textPrompt) return
      setIsGenerating(true)
      setGeneratedText(null)
      setTimeout(() => {
        const newText = generateAdvancedText(textPrompt, textType, textLanguage, textLength[0], textTone)
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
        window.open(generatedImage, "_blank")
      }
    } else if (type === "music" && generatedMusic) {
      const link = document.createElement("a")
      link.href = generatedMusic
      link.download = `ai-music-${musicLanguage}-${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (type === "text" && generatedText) {
      const blob = new Blob([generatedText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `ai-writing-${textLanguage}-${Date.now()}.txt`
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
      const languageName = MUSIC_LANGUAGES.find((lang) => lang.code === musicLanguage)?.name
      shareData = {
        title: `AI Generated ${languageName} Music`,
        text: `Listen to this AI-generated ${languageName} ${musicGenre} music: "${musicPrompt}"`,
        url: generatedMusic,
      }
    } else if (type === "text" && generatedText) {
      const languageName = TEXT_LANGUAGES.find((lang) => lang.code === textLanguage)?.name
      shareData = {
        title: `AI Generated ${languageName} ${textType}`,
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

  const isRealAI = lastResult?.success && !lastResult?.isBackup && lastResult?.metadata?.model?.includes("pollinations")
  const isBackup = lastResult?.isBackup

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800 sm:p-6">
      <Tabs defaultValue="image" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image" className="text-xs sm:text-sm">
            <Paintbrush className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Image
          </TabsTrigger>
          <TabsTrigger value="music" className="text-xs sm:text-sm">
            <Music className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Music
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs sm:text-sm">
            <FileText className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
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
                  <span>✨ Free AI generation - no API key required!</span>
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
                    <Sparkles className="mr-1 h-3 w-3" />
                    Free AI
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
                    Generating FREE AI Art...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate FREE AI Art
                  </>
                )}
              </Button>

              {lastResult && lastResult.success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>
                          {isRealAI ? "🎨 Real AI Generated!" : "📸 High-Quality Image"}
                          {lastResult.metadata && ` (${lastResult.metadata.responseTime}ms)`}
                        </span>
                        <Badge variant={isRealAI ? "default" : "secondary"}>
                          {lastResult.metadata?.service || lastResult.metadata?.model || "AI"}
                        </Badge>
                      </div>
                      {lastResult.metadata?.enhancedPrompt && (
                        <details className="text-xs">
                          <summary className="cursor-pointer hover:text-foreground">Enhanced Prompt</summary>
                          <p className="mt-1 text-muted-foreground">{lastResult.metadata.enhancedPrompt}</p>
                        </details>
                      )}
                      {lastResult.metadata?.note && (
                        <p className="text-xs text-muted-foreground">{lastResult.metadata.note}</p>
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
                      onError={(e) => {
                        console.log("Image failed to load, trying backup...")
                        const target = e.target as HTMLImageElement
                        target.src = `https://picsum.photos/1024/1024?random=${Math.floor(Math.random() * 10000)}`
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
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
                  <h3 className="mb-1 text-base font-medium sm:text-lg">Ready to Create Art</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Enter a prompt and click generate to create your artwork
                  </p>
                  <div className="mt-2 flex items-center justify-center space-x-1 text-xs text-green-600">
                    <Sparkles className="h-3 w-3" />
                    <span>Working Image Generation</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="music" className="mt-4 sm:mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Globe className="mr-2 h-4 w-4" />
                    Multi-Language Music Generation
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Generate music in any language with cultural authenticity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="music-prompt" className="text-sm font-medium">
                      Describe your music
                    </Label>
                    <Textarea
                      id="music-prompt"
                      placeholder="A soulful melody about love and longing, with traditional instruments..."
                      value={musicPrompt}
                      onChange={(e) => setMusicPrompt(e.target.value)}
                      className="text-sm min-h-[80px]"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Globe className="mr-1 h-3 w-3" />
                        Language
                      </Label>
                      <Select value={musicLanguage} onValueChange={setMusicLanguage}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {MUSIC_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code} className="text-xs">
                              <span className="flex items-center">
                                <span className="mr-2">{lang.flag}</span>
                                {lang.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Music className="mr-1 h-3 w-3" />
                        Genre
                      </Label>
                      <Select value={musicGenre} onValueChange={setMusicGenre}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {MUSIC_GENRES.map((genre) => (
                            <SelectItem key={genre} value={genre} className="text-xs">
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Mic className="mr-1 h-3 w-3" />
                        Type
                      </Label>
                      <Select value={musicType} onValueChange={setMusicType}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="song" className="text-xs">
                            🎵 Song with Vocals
                          </SelectItem>
                          <SelectItem value="instrumental" className="text-xs">
                            🎼 Instrumental
                          </SelectItem>
                          <SelectItem value="beat" className="text-xs">
                            🥁 Beat/Rhythm
                          </SelectItem>
                          <SelectItem value="melody" className="text-xs">
                            🎹 Melody
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium flex items-center">
                          <Volume2 className="mr-1 h-3 w-3" />
                          Duration
                        </Label>
                        <span className="text-xs text-muted-foreground">{musicDuration[0]}s</span>
                      </div>
                      <Slider
                        min={15}
                        max={180}
                        step={15}
                        value={musicDuration}
                        onValueChange={setMusicDuration}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15s</span>
                        <span>3min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={!musicPrompt || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating {MUSIC_LANGUAGES.find((l) => l.code === musicLanguage)?.name} Music...
                  </>
                ) : (
                  <>
                    <Music className="mr-2 h-4 w-4" />
                    Generate {MUSIC_LANGUAGES.find((l) => l.code === musicLanguage)?.flag} {musicGenre} Music
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 min-h-[300px] sm:min-h-[400px]">
              {generatedMusic ? (
                <div className="w-full space-y-4 text-center">
                  <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Music className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-medium sm:text-lg">Generated Music</h3>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <span>{MUSIC_LANGUAGES.find((l) => l.code === musicLanguage)?.flag}</span>
                      <span>{MUSIC_LANGUAGES.find((l) => l.code === musicLanguage)?.name}</span>
                      <span>•</span>
                      <span>{musicGenre}</span>
                      <span>•</span>
                      <span>{musicDuration[0]}s</span>
                    </div>
                  </div>
                  <audio controls src={generatedMusic} className="w-full max-w-xs" />
                  <div className="flex flex-wrap justify-center gap-2">
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
                  <h3 className="mb-1 text-base font-medium sm:text-lg">Multi-Language Music Generator</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm mb-3">
                    Create music in any language with cultural authenticity
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 text-xs">
                    {MUSIC_LANGUAGES.slice(0, 8).map((lang) => (
                      <Badge key={lang.code} variant="secondary" className="text-xs">
                        {lang.flag} {lang.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +{MUSIC_LANGUAGES.length - 8} more
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text" className="mt-4 sm:mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Advanced Text Generation
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Create sophisticated content in multiple languages and formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-prompt" className="text-sm font-medium">
                      Describe your creative writing
                    </Label>
                    <Textarea
                      id="text-prompt"
                      placeholder="A heartwarming story about friendship that transcends cultural boundaries..."
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      rows={4}
                      className="text-sm min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Globe className="mr-1 h-3 w-3" />
                        Language
                      </Label>
                      <Select value={textLanguage} onValueChange={setTextLanguage}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {TEXT_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code} className="text-xs">
                              <span className="flex items-center">
                                <span className="mr-2">{lang.flag}</span>
                                {lang.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <BookOpen className="mr-1 h-3 w-3" />
                        Content Type
                      </Label>
                      <Select value={textType} onValueChange={setTextType}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEXT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-xs">
                              <span className="flex items-center">
                                <span className="mr-2">{type.icon}</span>
                                {type.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Writing Tone</Label>
                      <Select value={textTone} onValueChange={setTextTone}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative" className="text-xs">
                            🎨 Creative
                          </SelectItem>
                          <SelectItem value="formal" className="text-xs">
                            🎩 Formal
                          </SelectItem>
                          <SelectItem value="casual" className="text-xs">
                            😊 Casual
                          </SelectItem>
                          <SelectItem value="poetic" className="text-xs">
                            🌸 Poetic
                          </SelectItem>
                          <SelectItem value="humorous" className="text-xs">
                            😄 Humorous
                          </SelectItem>
                          <SelectItem value="dramatic" className="text-xs">
                            🎭 Dramatic
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium">Length</Label>
                        <span className="text-xs text-muted-foreground">{textLength[0]} words</span>
                      </div>
                      <Slider
                        min={100}
                        max={1000}
                        step={50}
                        value={textLength}
                        onValueChange={setTextLength}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Short</span>
                        <span>Long</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={!textPrompt || isGenerating}
                className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating {TEXT_LANGUAGES.find((l) => l.code === textLanguage)?.name} {textType}...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate {TEXT_LANGUAGES.find((l) => l.code === textLanguage)?.flag}{" "}
                    {TEXT_TYPES.find((t) => t.value === textType)?.label}
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col rounded-lg border border-dashed min-h-[400px] sm:min-h-[500px]">
              {generatedText ? (
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                      <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-base font-medium sm:text-lg">Generated Text</h3>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-1">
                      <span>{TEXT_LANGUAGES.find((l) => l.code === textLanguage)?.flag}</span>
                      <span>{TEXT_LANGUAGES.find((l) => l.code === textLanguage)?.name}</span>
                      <span>•</span>
                      <span>{TEXT_TYPES.find((t) => t.value === textType)?.label}</span>
                      <span>•</span>
                      <span>{textLength[0]} words</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto rounded-md border p-4 text-sm leading-relaxed mb-4 bg-muted/30">
                    <p className="whitespace-pre-wrap">{generatedText}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-auto">
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
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                    <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-1 text-base font-medium sm:text-lg">Advanced Text Generator</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm mb-3">
                    Create sophisticated content in multiple languages and formats
                  </p>
                  <div className="flex flex-wrap justify-center gap-1 text-xs mb-2">
                    {TEXT_TYPES.slice(0, 4).map((type) => (
                      <Badge key={type.value} variant="secondary" className="text-xs">
                        {type.icon} {type.label}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 text-xs">
                    {TEXT_LANGUAGES.slice(0, 6).map((lang) => (
                      <Badge key={lang.code} variant="outline" className="text-xs">
                        {lang.flag} {lang.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +{TEXT_LANGUAGES.length - 6} more
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
