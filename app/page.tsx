import Link from "next/link"
import { ArtGenerator } from "@/components/art-generator"
import { ArtGallery } from "@/components/art-gallery"
import { FeatureCard } from "@/components/feature-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Paintbrush, Music, FileText, Sparkles, Brain, Layers } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:flex lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">AI-Powered</span>
              <span className="block bg-gradient-to-r from-yellow-200 via-green-200 to-blue-200 bg-clip-text text-transparent">
                Art Generation
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-xl text-white/90">
              Explore the intersection of creativity and artificial intelligence. Create stunning artwork, music, and
              writing with the power of AI.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Start Creating
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="#learn-more" className="text-base font-semibold text-white hover:text-white/80">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section id="learn-more" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore AI Art Generation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover the various ways AI can enhance your creative process
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Paintbrush className="h-10 w-10 text-purple-500" />}
            title="Visual Art"
            description="Generate stunning images, paintings, and illustrations using state-of-the-art AI models."
            color="purple"
          />
          <FeatureCard
            icon={<Music className="h-10 w-10 text-blue-500" />}
            title="Music Composition"
            description="Create original melodies, harmonies, and complete musical pieces with AI assistance."
            color="blue"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-pink-500" />}
            title="Creative Writing"
            description="Craft stories, poems, and other written content with AI-powered language models."
            color="pink"
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-amber-500" />}
            title="Style Transfer"
            description="Apply the style of famous artists to your own creations with neural style transfer."
            color="amber"
          />
          <FeatureCard
            icon={<Brain className="h-10 w-10 text-green-500" />}
            title="Conceptual Art"
            description="Explore abstract concepts and ideas through AI-generated visual representations."
            color="green"
          />
          <FeatureCard
            icon={<Layers className="h-10 w-10 text-red-500" />}
            title="Mixed Media"
            description="Combine different art forms and techniques to create unique multimedia experiences."
            color="red"
          />
        </div>
      </section>

      {/* Generator Section */}
      <section className="bg-slate-50 py-24 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Try It Yourself</h2>
            <p className="mt-4 text-lg text-muted-foreground">Generate your own AI artwork with our interactive demo</p>
          </div>

          <div className="mt-16">
            <ArtGenerator />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">Explore a collection of AI-generated artwork</p>
        </div>

        <div className="mt-16">
          <ArtGallery />
        </div>
      </section>

      {/* Principles Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-24 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Understanding AI Art</h2>
            <p className="mt-4 text-lg text-white/80">The principles behind AI-generated creative content</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Neural Networks</h3>
              <p className="mt-2 text-white/80">
                AI art is created using complex neural networks that learn patterns from existing artwork and generate
                new content.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Training Data</h3>
              <p className="mt-2 text-white/80">
                The quality and diversity of training data significantly impacts the AI's ability to create original and
                meaningful art.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Human Collaboration</h3>
              <p className="mt-2 text-white/80">
                The most compelling AI art often emerges from collaboration between human creativity and machine
                intelligence.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Ethical Considerations</h3>
              <p className="mt-2 text-white/80">
                AI art raises important questions about authorship, originality, and the value of human creativity.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Technical Limitations</h3>
              <p className="mt-2 text-white/80">
                Understanding the capabilities and constraints of AI models helps artists leverage them effectively.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold">Future Directions</h3>
              <p className="mt-2 text-white/80">
                AI art continues to evolve rapidly, opening new possibilities for creative expression and artistic
                innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 shadow-xl sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start creating?</h2>
            <p className="mt-4 text-lg text-white/90">
              Join our community of AI artists and explore the endless possibilities of AI-powered creativity.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} AI Art Generation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
