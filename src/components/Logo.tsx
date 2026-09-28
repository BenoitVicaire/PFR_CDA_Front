import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-bold tracking-tight",
        size === "md" ? "text-2xl" : "text-base",
        className,
      )}
    >
      <span className="text-primary">Budget</span> <span className="text-info">Perso</span>
    </span>
  )
}
