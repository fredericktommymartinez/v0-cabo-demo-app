import { type NextRequest, NextResponse } from "next/server"
import { validateVoucher } from "@/lib/voucher-utils"
import type { Voucher } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate voucher structure
    const requiredFields: (keyof Voucher)[] = [
      "voucherId",
      "experienceId",
      "purchaser",
      "issuedAt",
      "expiresAt",
      "signature",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            status: "invalid",
            message: `Missing required field: ${field}`,
          },
          { status: 400 },
        )
      }
    }

    const voucher: Voucher = body
    const result = validateVoucher(voucher)

    return NextResponse.json(result, {
      status: result.status === "valid" ? 200 : 400,
    })
  } catch {
    return NextResponse.json(
      {
        status: "invalid",
        message: "Invalid JSON format. Please provide a valid voucher object.",
      },
      { status: 400 },
    )
  }
}
