import { notFound } from "next/navigation"
import { getExperienceById } from "@/lib/experiences"
import { ExperienceDetail } from "@/components/experience-detail"

interface ExperiencePageProps {
  params: Promise<{ id: string }>
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { id } = await params
  const experience = getExperienceById(id)

  if (!experience) {
    notFound()
  }

  return <ExperienceDetail experience={experience} />
}
