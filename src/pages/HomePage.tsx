import { BarChart3, Check, Eye } from "lucide-react"
import { Link } from "react-router-dom"

import heroBudget from "@/assets/hero-budget.svg"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { PublicFooter } from "@/components/layout/PublicFooter"

const PILLARS = [
  { icon: Check, title: "Simple", description: "Saisie rapide, pas de jargon." },
  { icon: BarChart3, title: "Prévisionnel", description: "Anticipez vos fins de mois." },
  { icon: Eye, title: "Souverain", description: "Vos données, chez vous." },
]

export function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 pt-5 pb-6">
        <header className="flex items-center justify-between">
          <Logo size="sm" />
          <Button asChild variant="ghost">
            <Link to="/connexion">Se connecter</Link>
          </Button>
        </header>

        <section className="flex flex-col items-center gap-5 text-center">
          <h1 className="text-3xl font-bold text-primary">Reprenez le contrôle de votre budget</h1>
          <p className="text-base text-foreground">En moins de 5 minutes par semaine.</p>
          <img src={heroBudget} alt="" className="h-auto w-full max-w-sm" />
          <Button asChild size="lg" className="w-full">
            <Link to="/inscription">Commencer</Link>
          </Button>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center"
            >
              <span className="flex items-center justify-center rounded-full bg-accent p-2">
                <pillar.icon className="size-5 text-primary" />
              </span>
              <p className="text-sm font-semibold text-primary">{pillar.title}</p>
              <p className="text-xs font-medium text-foreground">{pillar.description}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-center gap-3 rounded-xl bg-accent p-5 text-center">
          <p className="text-lg font-medium text-primary">Prêt à reprendre le contrôle ?</p>
          <p className="text-sm text-foreground">Créez votre compte gratuitement, sans carte bancaire.</p>
          <Button asChild size="lg" className="w-full">
            <Link to="/inscription">Créer mon compte</Link>
          </Button>
        </section>
      </div>
      <PublicFooter />
    </div>
  )
}
