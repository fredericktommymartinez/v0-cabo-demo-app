import type { Experience } from "./types"

export const experiences: Experience[] = [
  {
    id: "exp-001",
    name: "Web3 Developer Summit",
    description:
      "Join industry leaders for a full-day summit exploring the latest in blockchain development, smart contracts, and decentralized applications. Network with peers and learn from hands-on workshops.",
    category: "event",
    priceUSDC: 75,
    imageQuery: "tech conference stage with digital screens",
    date: "2026-02-15",
    location: "San Francisco, CA",
  },
  {
    id: "exp-002",
    name: "DeFi Masterclass",
    description:
      "A comprehensive 4-hour class covering decentralized finance protocols, yield strategies, and risk management. Perfect for developers and financial professionals entering the DeFi space.",
    category: "class",
    priceUSDC: 45,
    imageQuery: "modern classroom with laptops and financial charts",
    date: "2026-02-20",
    location: "Online (Live)",
  },
  {
    id: "exp-003",
    name: "Build Your First Agent Workshop",
    description:
      "Hands-on workshop where you'll build an autonomous agent capable of HTTP 402 payments. Learn agentic commerce patterns and deploy your own payment-enabled bot.",
    category: "workshop",
    priceUSDC: 120,
    imageQuery: "coding workshop with multiple screens showing code",
    date: "2026-03-01",
    location: "Austin, TX",
  },
]

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((exp) => exp.id === id)
}
