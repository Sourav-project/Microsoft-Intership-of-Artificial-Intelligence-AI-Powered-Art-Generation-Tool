"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, BarChart3, Waves, Activity, Music, Zap, TrendingUp } from "lucide-react"

interface MusicAnalysis {
  tempo: number
  key: string
  energy: number
  danceability: number
  valence: number
  loudness: number
  duration: number
  timeSignature: string
  genre: string
  language: string
}

interface MusicVisualizerProps {
  audioUrl: string
  analysis: MusicAnalysis
  onAnalysisUpdate?: (analysis: MusicAnalysis) => void
}

export function MusicVisualizer({ audioUrl, analysis, onAnalysisUpdate }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visualizerType, setVisualizerType] = useState<"waveform" | "frequency" | "circular">("waveform")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const initializeAudioContext = async () => {
    if (!audioRef.current || audioContextRef.current) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaElementSource(audioRef.current)

      analyser.fftSize = 256
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
      sourceRef.current = source

      startVisualization()
    } catch (error) {
      console.error("Error initializing audio context:", error)
    }
  }

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isPlaying) return

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = "rgb(15, 23, 42)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (visualizerType === "waveform") {
        drawWaveform(ctx, dataArray, canvas.width, canvas.height)
      } else if (visualizerType === "frequency") {
        drawFrequencyBars(ctx, dataArray, canvas.width, canvas.height)
      } else if (visualizerType === "circular") {
        drawCircularVisualizer(ctx, dataArray, canvas.width, canvas.height)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
  }

  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, "#8b5cf6")
    gradient.addColorStop(0.5, "#06b6d4")
    gradient.addColorStop(1, "#10b981")

    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.beginPath()

    const sliceWidth = width / dataArray.length
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.stroke()

    // Add glow effect
    ctx.shadowColor = "#8b5cf6"
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  const drawFrequencyBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const barWidth = width / dataArray.length
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height

      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
      gradient.addColorStop(0, `hsl(${(i / dataArray.length) * 360}, 70%, 60%)`)
      gradient.addColorStop(1, `hsl(${(i / dataArray.length) * 360}, 70%, 40%)`)

      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)

      x += barWidth
    }
  }

  const drawCircularVisualizer = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    width: number,
    height: number,
  ) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 4

    ctx.translate(centerX, centerY)

    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2
      const barHeight = (dataArray[i] / 255) * radius

      const x1 = Math.cos(angle) * radius
      const y1 = Math.sin(angle) * radius
      const x2 = Math.cos(angle) * (radius + barHeight)
      const y2 = Math.sin(angle) * (radius + barHeight)

      const hue = (i / dataArray.length) * 360
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    ctx.translate(-centerX, -centerY)
  }

  const handlePlayPause = async () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      if (!audioContextRef.current) {
        await initializeAudioContext()
      }

      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume()
      }

      audioRef.current.play()
      setIsPlaying(true)
      startVisualization()
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
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (time: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time[0]
      setCurrentTime(time[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const analyzeMusic = async () => {
    setIsAnalyzing(true)

    // Simulate music analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const updatedAnalysis: MusicAnalysis = {
      ...analysis,
      tempo: Math.floor(Math.random() * 60) + 80, // 80-140 BPM
      energy: Math.random() * 100,
      danceability: Math.random() * 100,
      valence: Math.random() * 100,
      loudness: Math.random() * -20 - 10, // -30 to -10 dB
    }

    if (onAnalysisUpdate) {
      onAnalysisUpdate(updatedAnalysis)
    }

    setIsAnalyzing(false)
  }

  const getEnergyColor = (energy: number) => {
    if (energy > 70) return "text-red-500"
    if (energy > 40) return "text-yellow-500"
    return "text-green-500"
  }

  const getValenceEmoji = (valence: number) => {
    if (valence > 70) return "😊"
    if (valence > 40) return "😐"
    return "😔"
  }

  return (
    <div className="space-y-4">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Visualizer Canvas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <Waves className="mr-2 h-4 w-4" />
              Music Visualizer
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant={visualizerType === "waveform" ? "default" : "outline"}
                size="sm"
                onClick={() => setVisualizerType("waveform")}
                className="text-xs"
              >
                <Activity className="h-3 w-3" />
              </Button>
              <Button
                variant={visualizerType === "frequency" ? "default" : "outline"}
                size="sm"
                onClick={() => setVisualizerType("frequency")}
                className="text-xs"
              >
                <BarChart3 className="h-3 w-3" />
              </Button>
              <Button
                variant={visualizerType === "circular" ? "default" : "outline"}
                size="sm"
                onClick={() => setVisualizerType("circular")}
                className="text-xs"
              >
                <Zap className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas ref={canvasRef} width={400} height={200} className="w-full h-48 bg-slate-900 rounded-lg border" />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
                <div className="text-center text-white">
                  <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Click play to see visualization</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handlePlayPause} className="bg-transparent">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="w-20" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Music Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <TrendingUp className="mr-2 h-4 w-4" />
              Music Analysis
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeMusic}
              disabled={isAnalyzing}
              className="text-xs bg-transparent"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-1 h-3 w-3 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-1 h-3 w-3" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Tempo</div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {analysis.tempo} BPM
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Key</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {analysis.key}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Time Signature</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {analysis.timeSignature}
                </Badge>
              </div>
            </div>

            {/* Audio Features */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Energy</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500`}
                    style={{ width: `${analysis.energy}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${getEnergyColor(analysis.energy)}`}>
                  {Math.round(analysis.energy)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Danceability</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${analysis.danceability}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{Math.round(analysis.danceability)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Valence (Mood)</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${analysis.valence}%` }}
                  />
                </div>
                <span className="text-xs">
                  {getValenceEmoji(analysis.valence)} {Math.round(analysis.valence)}%
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Loudness</div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {analysis.loudness.toFixed(1)} dB
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Genre</div>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="text-xs">
                  {analysis.genre}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Language</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {analysis.language}
                </Badge>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Analysis Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This {analysis.genre.toLowerCase()} track in {analysis.language} has a{" "}
              {analysis.tempo > 120 ? "fast" : analysis.tempo > 90 ? "moderate" : "slow"} tempo of {analysis.tempo} BPM.
              The energy level is {analysis.energy > 70 ? "high" : analysis.energy > 40 ? "moderate" : "low"} (
              {Math.round(analysis.energy)}%), making it{" "}
              {analysis.danceability > 70
                ? "very danceable"
                : analysis.danceability > 40
                  ? "moderately danceable"
                  : "not very danceable"}
              . The overall mood is{" "}
              {analysis.valence > 70 ? "positive and uplifting" : analysis.valence > 40 ? "neutral" : "melancholic"}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
