"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  searchMusic,
  getTracksByGenre,
  getTracksByLanguage,
  getMusicStats,
  getPopularTracks,
  type MusicTrack,
} from "@/lib/music-library"
import { Search, Music, Globe, TrendingUp, Play, Clock, User, Calendar, Hash, Library } from "lucide-react"

export function MusicLibraryBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MusicTrack[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [stats, setStats] = useState<any>(null)
  const [popularTracks, setPopularTracks] = useState<MusicTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize with stats and popular tracks
    const musicStats = getMusicStats()
    setStats(musicStats)
    setPopularTracks(getPopularTracks(20))
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const results = searchMusic(searchQuery, {
        genre: selectedGenre || undefined,
        language: selectedLanguage || undefined,
      })
      setSearchResults(results.slice(0, 50)) // Limit to 50 results
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre)
    if (genre) {
      const results = getTracksByGenre(genre)
      setSearchResults(results.slice(0, 50))
    } else {
      setSearchResults([])
    }
  }

  const handleLanguageFilter = (language: string) => {
    setSelectedLanguage(language)
    if (language) {
      const results = getTracksByLanguage(language)
      setSearchResults(results.slice(0, 50))
    } else {
      setSearchResults([])
    }
  }

  const TrackCard = ({ track }: { track: MusicTrack }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{track.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
              <Play className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {track.genre}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {track.language}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {track.mood}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
            </div>
            <div className="flex items-center">
              <Hash className="h-3 w-3 mr-1" />
              {track.tempo} BPM
            </div>
            {track.year && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {track.year}
              </div>
            )}
            <div className="flex items-center">
              <Music className="h-3 w-3 mr-1" />
              {track.key}
            </div>
          </div>

          {track.tags && track.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {track.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">Music Library Browser</h2>
        <p className="text-muted-foreground">
          Explore our collection of {stats?.totalTracks?.toLocaleString() || "5000+"} tracks across{" "}
          {stats?.genres || 15} genres and {stats?.languages || 20} languages
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Search className="mr-2 h-5 w-5" />
            Search Music
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search by title, artist, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Library className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant={selectedGenre ? "default" : "outline"} size="sm" onClick={() => handleGenreFilter("")}>
              All Genres
            </Button>
            {stats?.byGenre &&
              Object.keys(stats.byGenre)
                .slice(0, 8)
                .map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleGenreFilter(genre)}
                  >
                    {genre} ({stats.byGenre[genre]})
                  </Button>
                ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLanguage ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageFilter("")}
            >
              All Languages
            </Button>
            {stats?.byLanguage &&
              Object.keys(stats.byLanguage)
                .slice(0, 8)
                .map((language) => (
                  <Button
                    key={language}
                    variant={selectedLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLanguageFilter(language)}
                  >
                    {language} ({stats.byLanguage[language]})
                  </Button>
                ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search Results ({searchResults.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Popular Tracks
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <Library className="mr-2 h-4 w-4" />
            Library Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {searchResults.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {searchResults.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No search results. Try searching for a song, artist, or genre.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {popularTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Library className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{stats.totalTracks.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Tracks</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Music className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{stats.genres}</div>
                  <div className="text-sm text-muted-foreground">Genres</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">{stats.languages}</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{stats.artists}</div>
                  <div className="text-sm text-muted-foreground">Artists</div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats?.byGenre && (
            <Card>
              <CardHeader>
                <CardTitle>Tracks by Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(stats.byGenre).map(([genre, count]) => (
                    <div key={genre} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-medium">{genre}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {stats?.byLanguage && (
            <Card>
              <CardHeader>
                <CardTitle>Tracks by Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(stats.byLanguage).map(([language, count]) => (
                    <div key={language} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-medium">{language}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
