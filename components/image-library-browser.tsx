"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Grid3X3,
  List,
  Heart,
  Download,
  Eye,
  Database,
  Sparkles,
  Palette,
  Camera,
  Brush,
  Zap,
} from "lucide-react"
import { ALL_IMAGES, getImagesByCategory, getPopularImages, advancedSearch, type ImageData } from "@/lib/image-library"

export function ImageLibraryBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [selectedMood, setSelectedMood] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")

  // Get unique values for filters
  const categories = ["all", ...new Set(ALL_IMAGES.map((img) => img.category))]
  const styles = ["all", ...new Set(ALL_IMAGES.map((img) => img.style))]
  const moods = ["all", ...new Set(ALL_IMAGES.map((img) => img.mood))]

  useEffect(() => {
    handleSearch()
  }, [searchQuery, selectedCategory, selectedStyle, selectedMood])

  const handleSearch = () => {
    setIsLoading(true)

    setTimeout(() => {
      let results: ImageData[] = []

      if (activeTab === "popular") {
        results = getPopularImages(100)
      } else if (activeTab === "categories") {
        results = selectedCategory !== "all" ? getImagesByCategory(selectedCategory) : ALL_IMAGES.slice(0, 100)
      } else {
        // Advanced search
        results = advancedSearch({
          query: searchQuery || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          style: selectedStyle !== "all" ? selectedStyle : undefined,
          mood: selectedMood !== "all" ? selectedMood : undefined,
        })
      }

      // Limit results for performance
      setFilteredImages(results.slice(0, 50))
      setIsLoading(false)
    }, 300)
  }

  const handleImageClick = (image: ImageData) => {
    // Open image in new tab
    window.open(image.imageUrl, "_blank")
  }

  const handleDownload = async (image: ImageData) => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${image.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback: open in new tab
      window.open(image.imageUrl, "_blank")
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "realistic":
        return <Camera className="h-4 w-4" />
      case "abstract":
        return <Sparkles className="h-4 w-4" />
      case "digital":
        return <Zap className="h-4 w-4" />
      case "painterly":
        return <Brush className="h-4 w-4" />
      default:
        return <Palette className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "realistic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "abstract":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "digital":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "painterly":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Database className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold gradient-text">Massive Image Library</h2>
        </div>
        <p className="text-muted-foreground">
          Browse {ALL_IMAGES.length.toLocaleString()}+ professional images across all categories
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <Badge variant="secondary" className="pulse-glow">
            <Camera className="mr-1 h-3 w-3" />
            {getImagesByCategory("realistic").length.toLocaleString()} Realistic
          </Badge>
          <Badge variant="secondary" className="pulse-glow">
            <Sparkles className="mr-1 h-3 w-3" />
            {getImagesByCategory("abstract").length.toLocaleString()} Abstract
          </Badge>
          <Badge variant="secondary" className="pulse-glow">
            <Zap className="mr-1 h-3 w-3" />
            {getImagesByCategory("digital").length.toLocaleString()} Digital
          </Badge>
          <Badge variant="secondary" className="pulse-glow">
            <Brush className="mr-1 h-3 w-3" />
            {getImagesByCategory("painterly").length.toLocaleString()} Painterly
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Search className="mr-2 h-4 w-4" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="text-sm font-medium">
                    Search Images
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search by title, tags, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center">
                            {getCategoryIcon(category)}
                            <span className="ml-2 capitalize">{category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          <span className="capitalize">{style}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Mood</Label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          <span className="capitalize">{mood}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                Most Popular Images
              </CardTitle>
              <CardDescription>Top-rated images from our massive library</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <Card
                key={category}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === category ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${getCategoryColor(category)}`}>{getCategoryIcon(category)}</div>
                    <h3 className="font-medium capitalize">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getImagesByCategory(category).length.toLocaleString()} images
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Searching..." : `Found ${filteredImages.length.toLocaleString()} images`}
          </p>
          <Badge variant="outline">
            <Database className="mr-1 h-3 w-3" />
            {ALL_IMAGES.length.toLocaleString()} Total
          </Badge>
        </div>

        {/* Image Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => handleImageClick(image)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageClick(image)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(image)
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className={getCategoryColor(image.category)}>
                      {getCategoryIcon(image.category)}
                      <span className="ml-1 capitalize">{image.category}</span>
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{image.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{image.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {image.style}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" />
                      <span>{image.popularity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group cursor-pointer hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{image.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{image.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(image.category)}>
                          {getCategoryIcon(image.category)}
                          <span className="ml-1 capitalize">{image.category}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {image.style}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{image.mood}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span>{image.popularity}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageClick(image)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(image)
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredImages.length === 50 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                // Load more images logic here
                console.log("Loading more images...")
              }}
              className="mt-4"
            >
              Load More Images
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800 mx-auto w-fit">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedStyle("all")
                setSelectedMood("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
