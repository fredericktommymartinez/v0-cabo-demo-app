import { type NextRequest, NextResponse } from "next/server"
import { getExperienceById } from "@/lib/experiences"
import { createVoucher } from "@/lib/voucher-utils"
import type { PaymentRequired } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const experienceId = searchParams.get("experienceId")
  const purchaser = request.headers.get("X-Purchaser")
  const paymentProof = request.headers.get("X-Payment-Proof")

  // Validate experience ID
  if (!experienceId) {
    return NextResponse.json({ error: "Missing experienceId parameter" }, { status: 400 })
  }

  const experience = getExperienceById(experienceId)
  if (!experience) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 })
  }

  // Validate purchaser
  if (!purchaser) {
    return NextResponse.json({ error: "Missing X-Purchaser header" }, { status: 400 })
  }

  // If no payment proof, return HTTP 402 Payment Required
  if (!paymentProof) {
    const paymentRequired: PaymentRequired = {
      status: 402,
      message: `Payment required to access voucher for "${experience.name}"`,
      amount: experience.priceUSDC,
      currency: "USDC",
      recipient: "0xCABO...DEMO", // Mock USDC address
      paymentInstructions: `Send ${experience.priceUSDC} USDC to the recipient address and include the transaction hash in the X-Payment-Proof header.`,
    }

    return NextResponse.json(paymentRequired, { status: 402 })
  }

  // Mock payment verification (in production, verify on-chain)
  const isValidPayment = paymentProof.startsWith("tx_") && paymentProof.length > 10
  if (!isValidPayment) {
    return NextResponse.json({ error: "Invalid payment proof format" }, { status: 400 })
  }

  // Create and return the voucher
  const voucher = createVoucher(experienceId, purchaser)

  return NextResponse.json(voucher, {
    status: 200,
    headers: {
      "X-Voucher-Id": voucher.voucherId,
    },
  })
}
