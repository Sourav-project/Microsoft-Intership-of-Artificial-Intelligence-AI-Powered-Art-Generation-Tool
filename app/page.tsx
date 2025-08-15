import Link from "next/link"
import { ArtGenerator } from "@/components/art-generator"
import { ArtGallery } from "@/components/art-gallery"
import { FeatureCard } from "@/components/feature-card"
import { DebugPanel } from "@/components/debug-panel"
import { Button } from "@/components/ui/button"
import { ChevronRight, Paintbrush, Music, FileText, Sparkles, Brain, Layers, Zap, Target } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden ai-bg-animated">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:flex lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <div className="float-animation">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block neon-text">AI-Powered</span>
                <span className="block bg-gradient-to-r from-yellow-200 via-green-200 to-blue-200 bg-clip-text text-transparent sparkle relative">
                  Art Generation
                </span>
              </h1>
            </div>
            <p className="mt-4 max-w-xl text-lg text-white/90 sm:mt-6 sm:text-xl">
              Explore the intersection of creativity and artificial intelligence. Create stunning artwork, music, and
              writing with the power of AI.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-x-6">
              <Link href="#generator" passHref>
                <Button
                  size="lg"
                  className="w-full glow-button ai-gradient-purple ripple sm:w-auto text-white border-0"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Start Creating
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="#learn-more"
                className="text-base font-semibold text-white hover:text-white/80 transition-colors duration-300"
              >
                Learn more{" "}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent sm:h-12" />
      </section>

      {/* Features Section */}
      <section id="learn-more" className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight gradient-text sm:text-3xl lg:text-4xl">
            Explore AI Art Generation
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Discover the various ways AI can enhance your creative process
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="interactive-card">
            <FeatureCard
              icon={<Paintbrush className="h-8 w-8 text-purple-500 sm:h-10 sm:w-10" />}
              title="Visual Art"
              description="Generate stunning images, paintings, and illustrations using state-of-the-art AI models."
              color="purple"
            />
          </div>
          <div className="interactive-card">
            <FeatureCard
              icon={<Music className="h-8 w-8 text-blue-500 sm:h-10 sm:w-10" />}
              title="Music Composition"
              description="Create original melodies, harmonies, and complete musical pieces with AI assistance."
              color="blue"
            />
          </div>
          <div className="interactive-card">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-pink-500 sm:h-10 sm:w-10" />}
              title="Creative Writing"
              description="Craft stories, poems, and other written content with AI-powered language models."
              color="pink"
            />
          </div>
          <div className="interactive-card">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-amber-500 sm:h-10 sm:w-10" />}
              title="Style Transfer"
              description="Apply the style of famous artists to your own creations with neural style transfer."
              color="amber"
            />
          </div>
          <div className="interactive-card">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-green-500 sm:h-10 sm:w-10" />}
              title="Conceptual Art"
              description="Explore abstract concepts and ideas through AI-generated visual representations."
              color="green"
            />
          </div>
          <div className="interactive-card">
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-red-500 sm:h-10 sm:w-10" />}
              title="Mixed Media"
              description="Combine different art forms and techniques to create unique multimedia experiences."
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight gradient-text sm:text-3xl lg:text-4xl">Try It Yourself</h2>
            <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
              Generate your own AI artwork with our interactive demo
            </p>
          </div>

          <div className="mt-12 sm:mt-16">
            <div className="glow-card rounded-2xl p-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl">
                <DebugPanel />
                <ArtGenerator />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight gradient-text sm:text-3xl lg:text-4xl">Gallery</h2>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
            Explore a collection of AI-generated artwork
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="glow-card rounded-2xl p-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <ArtGallery />
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="ai-bg-animated py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight neon-text sm:text-3xl lg:text-4xl">
              Understanding AI Art
            </h2>
            <p className="mt-3 text-base text-white/80 sm:mt-4 sm:text-lg">
              The principles behind AI-generated creative content
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Neural Networks</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                AI art is created using complex neural networks that learn patterns from existing artwork and generate
                new content.
              </p>
            </div>
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Training Data</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                The quality and diversity of training data significantly impacts the AI's ability to create original and
                meaningful art.
              </p>
            </div>
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Human Collaboration</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                The most compelling AI art often emerges from collaboration between human creativity and machine
                intelligence.
              </p>
            </div>
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Ethical Considerations</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                AI art raises important questions about authorship, originality, and the value of human creativity.
              </p>
            </div>
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Technical Limitations</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Understanding the capabilities and constraints of AI models helps artists leverage them effectively.
              </p>
            </div>
            <div className="glow-card rounded-lg p-4 backdrop-blur-sm sm:p-6 interactive-card">
              <h3 className="text-lg font-bold sm:text-xl">Future Directions</h3>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                AI art continues to evolve rapidly, opening new possibilities for creative expression and artistic
                innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="glow-card rounded-2xl p-6 shadow-xl sm:p-8 lg:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight gradient-text sm:text-3xl lg:text-4xl">
              Ready to start creating?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
              Join our community of AI artists and explore the endless possibilities of AI-powered creativity.
            </p>
            <div className="mt-8 sm:mt-10">
              <Link href="#generator" passHref>
                <Button size="lg" className="w-full glow-button ai-gradient-pink ripple sm:w-auto text-white border-0">
                  <Target className="mr-2 h-4 w-4" />
                  Get Started Now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-white sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold gradient-text">AI Art Generation</h3>
              <p className="text-sm text-slate-400 mt-1">Powered by Advanced AI Technology</p>
            </div>
            <p className="text-xs text-slate-400 sm:text-sm">
              © {new Date().getFullYear()} AI Art Generation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
