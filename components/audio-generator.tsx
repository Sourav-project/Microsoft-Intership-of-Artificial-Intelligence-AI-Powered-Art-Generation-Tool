"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, RefreshCw, Download, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<any>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  const generateAudio = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setAudioUrl(null)
    setMetadata(null)

    try {
      console.log("🎵 Requesting audio generation...")

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
      console.log("🎯 Audio generation result:", result)

      if (result.success && result.audioUrl) {
        setAudioUrl(result.audioUrl)
        setMetadata(result.metadata)

        if (onAudioGenerated) {
          onAudioGenerated(result.audioUrl)
        }

        console.log("✅ Audio generated successfully!")
      } else {
        setError(result.error || "Audio generation failed")
        console.log("❌ Audio generation failed:", result.error)
      }
    } catch (error) {
      console.error("❌ Client error:", error)
      setError("Network error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Audio play failed:", error)
          setError("Failed to play audio. Please try again.")
        })
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
      setAudioDuration(audioRef.current.duration)
      audioRef.current.volume = volume[0] / 100
    }
  }

  const handleSeek = (time: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time[0]
      setCurrentTime(time[0])
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleError = (e: any) => {
    console.error("Audio error:", e)
    setError("Audio playback error. The audio file may be corrupted or unavailable.")
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = `ai-music-${genre.toLowerCase()}-${Date.now()}.${metadata?.format?.toLowerCase() || "ogg"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Auto-generate when component mounts or props change
  useEffect(() => {
    if (prompt.trim()) {
      generateAudio()
    }
  }, [prompt, language, genre, duration, type])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>🎵 Audio Player</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateAudio}
              disabled={isGenerating || !prompt.trim()}
              className="text-xs bg-transparent"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regenerate
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
            onEnded={handleEnded}
            onError={handleError}
            preload="metadata"
            crossOrigin="anonymous"
          />
        )}

        {/* Status Messages */}
        {isGenerating && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Generating {genre} music in {language}... This may take a moment.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {metadata && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Audio ready! {metadata.format} format • {metadata.responseTime}ms
                </span>
                <Badge variant="secondary">{metadata.service}</Badge>
              </div>
              {metadata.note && <p className="text-xs text-muted-foreground mt-1">{metadata.note}</p>}
            </AlertDescription>
          </Alert>
        )}

        {/* Audio Controls */}
        {audioUrl && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  disabled={!audioUrl}
                  className="bg-transparent"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(audioDuration)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="w-20" />
                <Button variant="outline" size="sm" onClick={handleDownload} className="bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={audioDuration || 100}
                step={0.1}
                className="w-full"
                disabled={!audioUrl || audioDuration === 0}
              />
            </div>

            {/* Audio Info */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{genre}</Badge>
              <Badge variant="outline">{language}</Badge>
              <Badge variant="outline">{type}</Badge>
              {metadata?.format && <Badge variant="secondary">{metadata.format}</Badge>}
            </div>
          </div>
        )}

        {/* Placeholder when no audio */}
        {!audioUrl && !isGenerating && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-2">🎵</div>
            <p className="text-sm">Enter a prompt to generate music</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
