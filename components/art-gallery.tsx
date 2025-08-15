"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share2, Sparkles } from "lucide-react"

// Initial mock gallery data with working image URLs
const initialGalleryItems = [
  {
    id: 1,
    title: "Cosmic Dreamscape",
    artist: "AI + Human",
    image: "https://picsum.photos/600/400?random=1",
    likes: 245,
    comments: 32,
    category: "visual",
  },
  {
    id: 2,
    title: "Abstract Emotions",
    artist: "AI + Human",
    image: "https://picsum.photos/400/600?random=2",
    likes: 189,
    comments: 24,
    category: "visual",
  },
  {
    id: 3,
    title: "Digital Wilderness",
    artist: "AI + Human",
    image: "https://picsum.photos/500/500?random=3",
    likes: 312,
    comments: 45,
    category: "visual",
  },
  {
    id: 4,
    title: "Neon Cityscape",
    artist: "AI + Human",
    image: "https://picsum.photos/600/400?random=4",
    likes: 276,
    comments: 38,
    category: "visual",
  },
  {
    id: 5,
    title: "Quantum Melody",
    artist: "AI + Human",
    image: "https://picsum.photos/500/500?random=5",
    likes: 198,
    comments: 27,
    category: "music",
  },
  {
    id: 6,
    title: "Synthetic Symphony",
    artist: "AI + Human",
    image: "https://picsum.photos/400/600?random=6",
    likes: 231,
    comments: 19,
    category: "music",
  },
  {
    id: 7,
    title: "Digital Sonnets",
    artist: "AI + Human",
    image: "https://picsum.photos/600/400?random=7",
    likes: 167,
    comments: 22,
    category: "text",
  },
  {
    id: 8,
    title: "Neural Narratives",
    artist: "AI + Human",
    image: "https://picsum.photos/500/500?random=8",
    likes: 203,
    comments: 31,
    category: "text",
  },
]

export function ArtGallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems)
  const [page, setPage] = useState(1)

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  const handleLoadMore = () => {
    const newItems = [
      {
        id: galleryItems.length + 1,
        title: `New Art ${galleryItems.length + 1}`,
        artist: "AI + Human",
        image: `https://picsum.photos/600/400?random=${galleryItems.length + 1 + 100}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "visual",
      },
      {
        id: galleryItems.length + 2,
        title: `New Melody ${galleryItems.length + 2}`,
        artist: "AI + Human",
        image: `https://picsum.photos/500/500?random=${galleryItems.length + 2 + 100}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "music",
      },
      {
        id: galleryItems.length + 3,
        title: `New Story ${galleryItems.length + 3}`,
        artist: "AI + Human",
        image: `https://picsum.photos/400/600?random=${galleryItems.length + 3 + 100}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "text",
      },
    ]
    setGalleryItems((prevItems) => [...prevItems, ...newItems])
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <div className="pb-safe">
      <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-4 glow-border">
            <TabsTrigger
              value="all"
              className="text-xs sm:text-sm transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="visual"
              className="text-xs sm:text-sm transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              Visual
            </TabsTrigger>
            <TabsTrigger
              value="music"
              className="text-xs sm:text-sm transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900"
            >
              Music
            </TabsTrigger>
            <TabsTrigger
              value="text"
              className="text-xs sm:text-sm transition-all duration-300 hover:bg-pink-100 dark:hover:bg-pink-900"
            >
              Writing
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-6 sm:mt-8">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden glow-card interactive-card">
                <div className="relative aspect-square overflow-hidden sm:aspect-[4/3]">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="pulse-glow">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold sm:text-base gradient-text">{item.title}</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{item.artist}</p>
                  <div className="mt-3 flex items-center justify-between sm:mt-4">
                    <div className="flex space-x-3 sm:space-x-4">
                      <Button variant="ghost" size="sm" className="h-6 px-1 sm:h-8 sm:px-2 glow-border ripple">
                        <Heart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{item.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-1 sm:h-8 sm:px-2 glow-border ripple">
                        <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{item.comments}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 sm:h-8 sm:w-8 glow-border ripple">
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center sm:mt-12">
        <Button
          variant="outline"
          size="lg"
          onClick={handleLoadMore}
          className="w-full sm:w-auto load-more-button text-white border-0 ripple button-text-glow transition-all duration-500 hover:scale-105 bg-transparent"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Load More Creations
        </Button>
      </div>
    </div>
  )
}
