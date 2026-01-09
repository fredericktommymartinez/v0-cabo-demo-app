import type { Voucher, RedemptionResult } from "./types"

// Mock signature generation (in production, use proper cryptographic signing)
export function generateMockSignature(data: string): string {
  const hash = Array.from(data)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
    .toString(16)
  return `sig_${hash.padStart(16, "0")}_mock`
}

// Generate a unique voucher ID
export function generateVoucherId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `voucher_${timestamp}_${random}`
}

// Create a new voucher
export function createVoucher(experienceId: string, purchaser: string): Voucher {
  const voucherId = generateVoucherId()
  const issuedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

  const dataToSign = `${voucherId}:${experienceId}:${purchaser}:${issuedAt}:${expiresAt}`
  const signature = generateMockSignature(dataToSign)

  return {
    voucherId,
    experienceId,
    purchaser,
    issuedAt,
    expiresAt,
    signature,
  }
}

// Verify voucher signature (mocked)
export function verifyVoucherSignature(voucher: Voucher): boolean {
  const dataToSign = `${voucher.voucherId}:${voucher.experienceId}:${voucher.purchaser}:${voucher.issuedAt}:${voucher.expiresAt}`
  const expectedSignature = generateMockSignature(dataToSign)
  return voucher.signature === expectedSignature
}

// Check if voucher is expired
export function isVoucherExpired(voucher: Voucher): boolean {
  return new Date(voucher.expiresAt) < new Date()
}

// Validate and redeem a voucher
export function validateVoucher(voucher: Voucher): RedemptionResult {
  // Check signature
  if (!verifyVoucherSignature(voucher)) {
    return {
      status: "invalid",
      message: "Invalid voucher signature. This voucher may have been tampered with.",
    }
  }

  // Check expiration
  if (isVoucherExpired(voucher)) {
    return {
      status: "expired",
      message: `This voucher expired on ${new Date(voucher.expiresAt).toLocaleDateString()}.`,
      voucherId: voucher.voucherId,
      experienceId: voucher.experienceId,
    }
  }

  // Voucher is valid
  return {
    status: "valid",
    message: "Voucher successfully validated! Entry granted.",
    voucherId: voucher.voucherId,
    experienceId: voucher.experienceId,
  }
}
