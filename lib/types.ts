// Types for the CABO voucher system

export interface Experience {
  id: string
  name: string
  description: string
  category: "event" | "class" | "workshop"
  priceUSDC: number
  imageQuery: string
  date: string
  location: string
}

export interface Voucher {
  voucherId: string
  experienceId: string
  purchaser: string
  issuedAt: string
  expiresAt: string
  signature: string
}

export interface PaymentRequired {
  status: 402
  message: string
  amount: number
  currency: string
  recipient: string
  paymentInstructions: string
}

export interface RedemptionResult {
  status: "valid" | "invalid" | "expired"
  message: string
  experienceId?: string
  voucherId?: string
}
