import Link from "next/link"
import { experiences } from "@/lib/experiences"
import { ExperienceCard } from "@/components/experience-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, QrCode, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CABO</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/redeem">
              <Button variant="outline" size="sm">
                <QrCode className="w-4 h-4 mr-2" />
                Redeem Voucher
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            HTTP 402 + USDC Demo
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">Circle Arc Box Office</h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Experience agentic commerce with digital vouchers. Purchase tickets using USDC through the HTTP 402
            pay-to-access pattern, then redeem them programmatically.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Cryptographically Signed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ticket className="w-4 h-4" />
              <span>Agent Compatible</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <QrCode className="w-4 h-4" />
              <span>QR Redemption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-8 px-4 pb-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Available Experiences</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>CABO is an educational demo for HTTP 402 + USDC agentic commerce.</p>
          <p className="mt-1">All payments and signatures are mocked for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  )
}
