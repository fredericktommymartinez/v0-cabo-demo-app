import Link from "next/link"
import type { Experience } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign } from "lucide-react"

interface ExperienceCardProps {
  experience: Experience
}

const categoryColors = {
  event: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  workshop: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="aspect-video relative bg-muted">
        <img
          src={`/.jpg?height=200&width=400&query=${encodeURIComponent(experience.imageQuery)}`}
          alt={experience.name}
          className="object-cover w-full h-full"
        />
        <Badge variant="outline" className={`absolute top-3 left-3 capitalize ${categoryColors[experience.category]}`}>
          {experience.category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold leading-tight">{experience.name}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{experience.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(experience.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{experience.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1 font-semibold">
          <DollarSign className="w-4 h-4" />
          <span>{experience.priceUSDC} USDC</span>
        </div>
        <Link href={`/experience/${experience.id}`}>
          <Button size="sm">Get Voucher</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
