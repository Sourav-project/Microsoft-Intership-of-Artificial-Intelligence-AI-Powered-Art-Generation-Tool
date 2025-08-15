import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: string
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const getGradientClass = (color: string) => {
    const gradients = {
      purple: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
      blue: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
      pink: "from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50",
      amber: "from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50",
      green: "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
      red: "from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50",
    }
    return gradients[color as keyof typeof gradients] || gradients.purple
  }

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${getGradientClass(color)} p-6 shadow-sm transition-all hover:shadow-md sm:p-8`}
    >
      <div className="mb-3 sm:mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-bold sm:text-xl">{title}</h3>
      <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  )
}
