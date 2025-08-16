"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchMusic, getTracksByGenre, getMusicStats, getPopularTracks, type MusicTrack } from "@/lib/music-library"
import { Search, Music, Play, Pause, Clock, User, Globe, Heart, TrendingUp, Library } from "lucide-react"

export function MusicLibraryBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [searchResults, setSearchResults] = useState<MusicTrack[]>([])
  const [popularTracks, setPopularTracks] = useState<MusicTrack[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // Load initial data
    const musicStats = getMusicStats()
    setStats(musicStats)
    setPopularTracks(getPopularTracks(20))
    setSearchResults(getPopularTracks(50))
  }, [])

  const handleSearch = () => {
    const filters: any = {}
    if (selectedGenre !== "all") filters.genre = selectedGenre
    if (selectedLanguage !== "all") filters.language = selectedLanguage

    const results = searchMusic(searchQuery, filters)
    setSearchResults(results)
  }

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre)
    if (genre === "all") {
      setSearchResults(getPopularTracks(50))
    } else {
      const tracks = getTracksByGenre(genre)
      setSearchResults(tracks)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayTrack = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(trackId)
      // In a real app, this would trigger audio playback
      console.log(`Playing track: ${trackId}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Library Stats */}
      {stats && (
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="flex items-center gradient-text">
              <Library className="mr-2 h-5 w-5" />
              Music Library Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalTracks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.genres}</div>
                <div className="text-sm text-muted-foreground">Genres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.languages}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.artists}</div>
                <div className="text-sm text-muted-foreground">Artists</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Tracks by Genre:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byGenre).map(([genre, count]) => (
                  <Badge key={genre} variant="secondary" className="pulse-glow">
                    {genre}: {count as number}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="glow-card">
        <CardHeader>
          <CardTitle className="flex items-center gradient-text">
            <Search className="mr-2 h-5 w-5" />
            Search 3000+ Tracks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by title, artist, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 glow-border"
            />
            <Button onClick={handleSearch} className="glow-button">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Genre</label>
              <Select value={selectedGenre} onValueChange={handleGenreFilter}>
                <SelectTrigger className="glow-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="Bollywood">Bollywood</SelectItem>
                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                  <SelectItem value="Jazz">Jazz</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Country">Country</SelectItem>
                  <SelectItem value="Reggae">Reggae</SelectItem>
                  <SelectItem value="Blues">Blues</SelectItem>
                  <SelectItem value="Folk">Folk</SelectItem>
                  <SelectItem value="Carnatic">Carnatic</SelectItem>
                  <SelectItem value="Hindustani">Hindustani</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="glow-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                  <SelectItem value="Instrumental">Instrumental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Music Browser Tabs */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glow-border">
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-1 h-3 w-3" />
            Search Results
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center">
            <TrendingUp className="mr-1 h-3 w-3" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="genres" className="flex items-center">
            <Music className="mr-1 h-3 w-3" />
            By Genre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results ({searchResults.length} tracks)</span>
                <Badge variant="secondary" className="pulse-glow">
                  {searchResults.length} / {stats?.totalTracks || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-lg glow-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayTrack(track.id)}
                        className="h-8 w-8 p-0 glow-border"
                      >
                        {currentlyPlaying === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{track.artist}</span>
                          <Globe className="h-3 w-3" />
                          <span>{track.language}</span>
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(track.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {track.genre}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {track.mood}
                      </Badge>
                      {track.year && (
                        <Badge variant="outline" className="text-xs">
                          {track.year}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tracks found. Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="mt-4">
          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Popular Tracks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {popularTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-lg glow-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-center font-bold text-purple-600">#{index + 1}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayTrack(track.id)}
                        className="h-8 w-8 p-0 glow-border"
                      >
                        {currentlyPlaying === track.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{track.artist}</span>
                          <Heart className="h-3 w-3 text-red-500" />
                          <span>Popular</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-xs pulse-glow">
                        {track.genre}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {track.language}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats &&
              Object.entries(stats.byGenre).map(([genre, count]) => (
                <Card key={genre} className="glow-card interactive-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="gradient-text">{genre}</span>
                      <Badge variant="secondary" className="pulse-glow">
                        {count as number}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenreFilter(genre)}
                      className="w-full glow-border ripple"
                    >
                      <Music className="mr-2 h-4 w-4" />
                      Browse {genre}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
