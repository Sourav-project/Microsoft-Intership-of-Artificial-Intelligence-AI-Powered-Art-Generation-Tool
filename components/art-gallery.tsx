"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2 } from "lucide-react"

// Initial mock gallery data
const initialGalleryItems = [
  {
    id: 1,
    title: "Cosmic Dreamscape",
    artist: "AI + Human",
    image: "/placeholder.svg?height=400&width=600&text=Cosmic+Dreamscape",
    likes: 245,
    comments: 32,
    category: "visual",
  },
  {
    id: 2,
    title: "Abstract Emotions",
    artist: "AI + Human",
    image: "/placeholder.svg?height=600&width=400&text=Abstract+Emotions",
    likes: 189,
    comments: 24,
    category: "visual",
  },
  {
    id: 3,
    title: "Digital Wilderness",
    artist: "AI + Human",
    image: "/placeholder.svg?height=500&width=500&text=Digital+Wilderness",
    likes: 312,
    comments: 45,
    category: "visual",
  },
  {
    id: 4,
    title: "Neon Cityscape",
    artist: "AI + Human",
    image: "/placeholder.svg?height=400&width=600&text=Neon+Cityscape",
    likes: 276,
    comments: 38,
    category: "visual",
  },
  {
    id: 5,
    title: "Quantum Melody",
    artist: "AI + Human",
    image: "/placeholder.svg?height=500&width=500&text=Quantum+Melody",
    likes: 198,
    comments: 27,
    category: "music",
  },
  {
    id: 6,
    title: "Synthetic Symphony",
    artist: "AI + Human",
    image: "/placeholder.svg?height=600&width=400&text=Synthetic+Symphony",
    likes: 231,
    comments: 19,
    category: "music",
  },
  {
    id: 7,
    title: "Digital Sonnets",
    artist: "AI + Human",
    image: "/placeholder.svg?height=400&width=600&text=Digital+Sonnets",
    likes: 167,
    comments: 22,
    category: "text",
  },
  {
    id: 8,
    title: "Neural Narratives",
    artist: "AI + Human",
    image: "/placeholder.svg?height=500&width=500&text=Neural+Narratives",
    likes: 203,
    comments: 31,
    category: "text",
  },
]

export function ArtGallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems)
  const [page, setPage] = useState(1) // For simulating pagination

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  const handleLoadMore = () => {
    const newItems = [
      {
        id: galleryItems.length + 1,
        title: `New Art ${galleryItems.length + 1}`,
        artist: "AI + Human",
        image: `/placeholder.svg?height=400&width=600&text=New+Art+${galleryItems.length + 1}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "visual",
      },
      {
        id: galleryItems.length + 2,
        title: `New Melody ${galleryItems.length + 2}`,
        artist: "AI + Human",
        image: `/placeholder.svg?height=500&width=500&text=New+Melody+${galleryItems.length + 2}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "music",
      },
      {
        id: galleryItems.length + 3,
        title: `New Story ${galleryItems.length + 3}`,
        artist: "AI + Human",
        image: `/placeholder.svg?height=600&width=400&text=New+Story+${galleryItems.length + 3}`,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: Math.floor(Math.random() * 40) + 5,
        category: "text",
      },
    ]
    setGalleryItems((prevItems) => [...prevItems, ...newItems])
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveCategory} className="w-full">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="visual">Visual Art</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="text">Writing</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden sm:aspect-[4/3]">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="mr-1 h-4 w-4" />
                        {item.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {item.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" onClick={handleLoadMore}>
          Load More
        </Button>
      </div>
    </div>
  )
}
