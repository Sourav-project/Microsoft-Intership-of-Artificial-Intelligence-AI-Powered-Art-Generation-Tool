"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MUSIC_LIBRARY,
  searchMusic,
  getTracksByGenre,
  getTracksByLanguage,
  getMusicStats,
  getPopularTracks,
} from "@/lib/music-library"
import { Search, Play, Music, Globe, TrendingUp, Shuffle } from "lucide-react"

export function MusicLibraryBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [filteredTracks, setFilteredTracks] = useState(MUSIC_LIBRARY.slice(0, 50))
  const [stats, setStats] = useState(getMusicStats())
  const [currentView, setCurrentView] = useState<"search" | "popular" | "genres" | "languages">("search")

  useEffect(() => {
    updateFilteredTracks()
  }, [searchQuery, selectedGenre, selectedLanguage, currentView])

  const updateFilteredTracks = () => {
    let tracks = MUSIC_LIBRARY

    if (currentView === "popular") {
      tracks = getPopularTracks(100)
    } else if (currentView === "genres" && selectedGenre !== "all") {
      tracks = getTracksByGenre(selectedGenre)
    } else if (currentView === "languages" && selectedLanguage !== "all") {
      tracks = getTracksByLanguage(selectedLanguage)
    }

    if (searchQuery.trim()) {
      tracks = searchMusic(searchQuery, {
        genre: selectedGenre !== "all" ? selectedGenre : undefined,
        language: selectedLanguage !== "all" ? selectedLanguage : undefined,
      })
    }

    // Limit results for performance
    setFilteredTracks(tracks.slice(0, 100))
  }

  const handleRandomShuffle = () => {
    const shuffled = [...MUSIC_LIBRARY].sort(() => Math.random() - 0.5).slice(0, 50)
    setFilteredTracks(shuffled)
    setCurrentView("search")
  }

  const genres = Object.keys(stats.byGenre).sort()
  const languages = Object.keys(stats.byLanguage).sort()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text">Music Library Browser</h2>
          <p className="text-sm text-muted-foreground">
            {stats.totalTracks.toLocaleString()} tracks • {stats.genres} genres • {stats.languages} languages
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRandomShuffle} className="glow-border ripple bg-transparent">
          <Shuffle className="mr-1 h-3 w-3" />
          Random
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glow-border"
            />
          </div>
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="glow-border">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre} ({stats.byGenre[genre]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="glow-border">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language} ({stats.byLanguage[language]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Tabs */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-1 h-3 w-3" />
            Search
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center">
            <TrendingUp className="mr-1 h-3 w-3" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="genres" className="flex items-center">
            <Music className="mr-1 h-3 w-3" />
            Genres
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center">
            <Globe className="mr-1 h-3 w-3" />
            Languages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredTracks.length} tracks found
            {searchQuery && ` for "${searchQuery}"`}
          </div>
          <TrackGrid tracks={filteredTracks} />
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="text-sm text-muted-foreground">Most popular tracks from recent years</div>
          <TrackGrid tracks={filteredTracks} />
        </TabsContent>

        <TabsContent value="genres" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className="justify-start glow-border ripple"
              >
                {genre} ({stats.byGenre[genre]})
              </Button>
            ))}
          </div>
          <TrackGrid tracks={filteredTracks} />
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {languages.map((language) => (
              <Button
                key={language}
                variant={selectedLanguage === language ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(language)}
                className="justify-start glow-border ripple"
              >
                {language} ({stats.byLanguage[language]})
              </Button>
            ))}
          </div>
          <TrackGrid tracks={filteredTracks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TrackGrid({ tracks }: { tracks: any[] }) {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)

  const handlePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null)
    } else {
      setPlayingTrack(trackId)
      // In a real app, you would play the actual audio here
      console.log(`Playing track: ${trackId}`)
    }
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No tracks found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {tracks.map((track) => (
        <Card key={track.id} className="glow-card hover:shadow-lg transition-all duration-200">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{track.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlay(track.id)}
                className="ml-2 h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
              >
                <Play className={`h-3 w-3 ${playingTrack === track.id ? "text-green-600" : ""}`} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="outline" className="text-xs">
                {track.genre}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {track.language}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {track.mood}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>
                  Duration: {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                </span>
                <span>Tempo: {track.tempo} BPM</span>
              </div>
              {track.year && (
                <div className="flex justify-between">
                  <span>Year: {track.year}</span>
                  <span>Key: {track.key}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
