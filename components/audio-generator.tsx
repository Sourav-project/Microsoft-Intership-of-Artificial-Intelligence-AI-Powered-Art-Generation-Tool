"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { MusicLibraryBrowser } from "./music-library-browser"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Loader2,
  CheckCircle,
  Music,
  Zap,
  Speaker,
  Library,
  Headphones,
  AudioWaveformIcon as Waveform,
} from "lucide-react"

interface AudioGeneratorProps {
  prompt: string
  language: string
  genre: string
  duration: number
  type: string
  onAudioGenerated?: (audioUrl: string) => void
}

export function AudioGenerator({ prompt, language, genre, duration, type, onAudioGenerated }: AudioGeneratorProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [metadata, setMetadata] = useState<any>(null)
  const [trackInfo, setTrackInfo] = useState<any>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [audioReady, setAudioReady] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  const generateAudio = async () => {
    if (!prompt.trim()) return

    console.log("🎵 REAL AUDIO: Generating working music with Web Audio API...")
    setIsGenerating(true)
    setAudioReady(false)
    setAudioUrl(null)
    setMetadata(null)
    setTrackInfo(null)
    setGenerationProgress(0)
    setIsLoading(true)

    // Realistic progress simulation
    progressInterval.current = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 85) return prev
        return prev + Math.random() * 8 + 3
      })
    }, 150)

    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          language,
          genre,
          duration,
          type,
        }),
      })

      const result = await response.json()
      console.log("🎯 REAL AUDIO: Generation result:", result)

      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      setGenerationProgress(100)

      if (result.success && result.audioUrl) {
        console.log("✅ REAL AUDIO GENERATED: Working audio file created!")
        setAudioUrl(result.audioUrl)
        setMetadata(result.metadata)
        setTrackInfo(result.trackInfo)

        // Set audio ready after a short delay to ensure URL is processed
        setTimeout(() => {
          setAudioReady(true)
          setIsLoading(false)
        }, 300)

        if (onAudioGenerated) {
          onAudioGenerated(result.audioUrl)
        }
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("❌ Audio generation error:", error)

      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      setGenerationProgress(100)
      setIsLoading(false)

      // Show error but don't fail completely
      setMetadata({
        service: "Audio Generation Failed",
        note: "Please try again with a different prompt",
        error: true,
      })
    } finally {
      setIsGenerating(false)
      setTimeout(() => {
        if (generationProgress === 100) {
          setGenerationProgress(0)
        }
      }, 3000)
    }
  }

  const handlePlayPause = async () => {
    if (!audioRef.current || !audioUrl || !audioReady) {
      console.log("❌ Audio not ready for playback")
      return
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        console.log("⏸️ Audio paused")
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        console.log("▶️ Real music playing successfully!")
      }
    } catch (error) {
      console.error("❌ Playback failed:", error)
      setIsPlaying(false)
      setAudioReady(false)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || duration)
      audioRef.current.volume = volume[0] / 100
      setAudioReady(true)
      setIsLoading(false)
      console.log("✅ Real audio loaded and ready to play!")
    }
  }

  const handleSeek = (time: number[]) => {
    if (audioRef.current && audioReady) {
      audioRef.current.currentTime = time[0]
      setCurrentTime(time[0])
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    console.log("🎵 Track finished playing")
  }

  const handleError = (e: any) => {
    console.error("❌ Audio loading error:", e)
    setIsPlaying(false)
    setAudioReady(false)
    setIsLoading(false)
  }

  const handleCanPlay = () => {
    console.log("✅ Audio can start playing")
    setAudioReady(true)
    setIsLoading(false)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownload = () => {
    if (audioUrl && audioReady) {
      try {
        const link = document.createElement("a")
        link.href = audioUrl
        link.download = `${trackInfo?.title || "music"}-${trackInfo?.artist || "ai-generated"}.wav`
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Download failed:", error)
        window.open(audioUrl, "_blank")
      }
    }
  }

  // Auto-generate when component mounts or props change
  useEffect(() => {
    if (prompt.trim()) {
      generateAudio()
    }
  }, [prompt, language, genre, duration, type])

  // Cleanup
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      // Cleanup audio URL to prevent memory leaks
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="space-y-4">
      <Card className="glow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gradient-text">
              <Waveform className="mr-2 h-4 w-4" />
              Real Audio Generator
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLibrary(!showLibrary)}
                className="text-xs glow-border ripple bg-transparent"
              >
                <Library className="mr-1 h-3 w-3" />
                Browse Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateAudio}
                disabled={isGenerating || !prompt.trim()}
                className="text-xs glow-border ripple bg-transparent"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Generate Music
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audio Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleCanPlay}
              onEnded={handleEnded}
              onError={handleError}
              preload="metadata"
            />
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gradient-text">
                  <Music className="mr-1 h-3 w-3 animate-pulse" />
                  Generating real {genre} music...
                </span>
                <span className="text-muted-foreground">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2 glow-border" />
              <div className="text-xs text-muted-foreground text-center">
                Creating working audio with Web Audio API • No fake URLs!
              </div>
            </div>
          )}

          {/* Success Message */}
          {trackInfo && !isGenerating && !metadata?.error && (
            <Alert className="glow-card border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="gradient-text font-medium">
                      🎵 Real Audio Generated! ({metadata?.responseTime}ms)
                    </span>
                    <div className="flex space-x-1">
                      <Badge variant="default" className="pulse-glow">
                        <Headphones className="mr-1 h-3 w-3" />
                        {metadata?.matchType || "Generated"}
                      </Badge>
                      {audioReady && (
                        <Badge variant="secondary" className="pulse-glow">
                          <Zap className="mr-1 h-3 w-3" />
                          READY
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Track Details */}
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="font-medium text-lg">{trackInfo.title}</div>
                    <div className="text-sm text-muted-foreground">by {trackInfo.artist}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Genre: {trackInfo.genre}</div>
                      <div>Language: {trackInfo.language}</div>
                      <div>Duration: {formatTime(trackInfo.duration)}</div>
                      <div>Mood: {trackInfo.mood}</div>
                      {trackInfo.tempo && <div>Tempo: {trackInfo.tempo} BPM</div>}
                      {trackInfo.key && <div>Key: {trackInfo.key}</div>}
                      {trackInfo.year && <div>Year: {trackInfo.year}</div>}
                      {trackInfo.album && <div>Album: {trackInfo.album}</div>}
                    </div>
                    {trackInfo.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trackInfo.tags.slice(0, 6).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-green-600 font-medium">
                    ✅ {metadata?.audioGeneration || "Real working audio generated with Web Audio API!"}
                  </div>

                  {metadata?.fallbackLevel && metadata.fallbackLevel !== "Direct Match" && (
                    <div className="text-xs text-blue-600">
                      🔍 Search method: {metadata.fallbackLevel} ({metadata.searchResults} results)
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {metadata?.error && (
            <Alert className="border-red-200 dark:border-red-800">
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium text-red-700 dark:text-red-300">Generation Failed</div>
                  <div className="text-sm">{metadata.note}</div>
                  <Button variant="outline" size="sm" onClick={generateAudio} className="text-xs bg-transparent">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Audio Controls */}
          {audioUrl && !isGenerating && !metadata?.error && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                    disabled={!audioUrl || isLoading}
                    className={`glow-border ripple ${audioReady ? "bg-green-50 hover:bg-green-100 dark:bg-green-900/20" : "bg-transparent"}`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : isPlaying ? (
                      <Pause className="h-4 w-4 text-green-600" />
                    ) : (
                      <Play className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(audioDuration || duration)}
                  </span>
                  {isLoading && (
                    <Badge variant="outline" className="text-xs animate-pulse">
                      Loading...
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="w-20" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!audioReady}
                    className="glow-border ripple bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={audioDuration || duration}
                step={0.1}
                className="w-full"
                disabled={!audioUrl || !audioReady}
              />

              {/* Audio Info */}
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="pulse-glow">
                  {genre}
                </Badge>
                <Badge variant="outline" className="pulse-glow">
                  {language}
                </Badge>
                <Badge variant="outline" className="pulse-glow">
                  {type}
                </Badge>
                {metadata?.quality && (
                  <Badge variant="secondary" className="pulse-glow">
                    {metadata.quality}
                  </Badge>
                )}
                {metadata?.librarySize && (
                  <Badge variant="default" className="pulse-glow">
                    <Library className="mr-1 h-3 w-3" />
                    {metadata.librarySize.toLocaleString()} tracks
                  </Badge>
                )}
                <Badge variant="outline" className="pulse-glow text-green-600">
                  <Speaker className="mr-1 h-3 w-3" />
                  Real Audio
                </Badge>
              </div>
            </div>
          )}

          {/* Placeholder when no audio */}
          {!audioUrl && !isGenerating && !metadata?.error && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900 float-animation pulse-glow">
                <Waveform className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1 text-base font-medium gradient-text">Real Audio Generator</h3>
              <p className="text-sm">Enter a prompt to generate working music</p>
              <div className="mt-2 flex items-center justify-center space-x-1 text-xs text-green-600">
                <Zap className="h-3 w-3" />
                <span>Web Audio API • Real working files • No fake URLs</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Hindi • English • Tamil • Telugu • Punjabi • Spanish • French • Arabic • Korean • Japanese + more
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Music Library Browser */}
      {showLibrary && (
        <div className="glow-card rounded-xl p-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
            <MusicLibraryBrowser />
          </div>
        </div>
      )}
    </div>
  )
}
