"use client"

import { useState } from "react"
import Link from "next/link"
import type { Experience, Voucher, PaymentRequired } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VoucherDisplay } from "@/components/voucher-display"
import { Ticket, Calendar, MapPin, DollarSign, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface ExperienceDetailProps {
  experience: Experience
}

type PurchaseState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "payment_required"; data: PaymentRequired }
  | { status: "purchased"; voucher: Voucher }
  | { status: "error"; message: string }

const categoryColors = {
  event: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  workshop: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({ status: "idle" })
  const [purchaserEmail, setPurchaserEmail] = useState("")
  const [paymentProof, setPaymentProof] = useState("")

  // Step 1: Initial request without payment proof (triggers 402)
  const handleGetVoucher = async () => {
    if (!purchaserEmail) return

    setPurchaseState({ status: "loading" })

    try {
      const response = await fetch(`/api/voucher/buy?experienceId=${experience.id}`, {
        headers: {
          "X-Purchaser": purchaserEmail,
        },
      })

      if (response.status === 402) {
        const data: PaymentRequired = await response.json()
        setPurchaseState({ status: "payment_required", data })
        // Auto-generate a mock payment proof for demo
        setPaymentProof(`tx_${Date.now().toString(36)}_mock`)
      } else if (response.ok) {
        const voucher: Voucher = await response.json()
        setPurchaseState({ status: "purchased", voucher })
      } else {
        const error = await response.json()
        setPurchaseState({ status: "error", message: error.message || "Purchase failed" })
      }
    } catch {
      setPurchaseState({ status: "error", message: "Network error occurred" })
    }
  }

  // Step 2: Submit payment proof to complete purchase
  const handleSubmitPayment = async () => {
    if (!paymentProof) return

    setPurchaseState({ status: "loading" })

    try {
      const response = await fetch(`/api/voucher/buy?experienceId=${experience.id}`, {
        headers: {
          "X-Purchaser": purchaserEmail,
          "X-Payment-Proof": paymentProof,
        },
      })

      if (response.ok) {
        const voucher: Voucher = await response.json()
        setPurchaseState({ status: "purchased", voucher })
      } else {
        const error = await response.json()
        setPurchaseState({ status: "error", message: error.message || "Payment verification failed" })
      }
    } catch {
      setPurchaseState({ status: "error", message: "Network error occurred" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Ticket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">CABO</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Experience Info */}
          <div>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6">
              <img
                src={`/.jpg?height=400&width=600&query=${encodeURIComponent(experience.imageQuery)}`}
                alt={experience.name}
                className="object-cover w-full h-full"
              />
            </div>
            <Badge variant="outline" className={`capitalize mb-4 ${categoryColors[experience.category]}`}>
              {experience.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{experience.name}</h1>
            <p className="text-muted-foreground mb-6">{experience.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>
                  {new Date(experience.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{experience.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <span className="text-xl font-semibold">{experience.priceUSDC} USDC</span>
              </div>
            </div>
          </div>

          {/* Purchase Flow */}
          <div>
            {purchaseState.status === "purchased" ? (
              <VoucherDisplay voucher={purchaseState.voucher} experience={experience} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Get Your Voucher
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="agent@example.com"
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      disabled={purchaseState.status === "payment_required"}
                    />
                  </div>

                  {/* Idle State */}
                  {purchaseState.status === "idle" && (
                    <Button className="w-full" size="lg" onClick={handleGetVoucher} disabled={!purchaserEmail}>
                      Get Voucher
                    </Button>
                  )}

                  {/* Loading State */}
                  {purchaseState.status === "loading" && (
                    <Button className="w-full" size="lg" disabled>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </Button>
                  )}

                  {/* 402 Payment Required State */}
                  {purchaseState.status === "payment_required" && (
                    <div className="space-y-4">
                      <Alert className="border-amber-500/50 bg-amber-500/10">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-600">HTTP 402 - Payment Required</AlertTitle>
                        <AlertDescription className="text-amber-600/80">{purchaseState.data.message}</AlertDescription>
                      </Alert>

                      <Card className="bg-muted/50">
                        <CardContent className="pt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-mono font-semibold">
                              {purchaseState.data.amount} {purchaseState.data.currency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Recipient:</span>
                            <span className="font-mono text-xs">{purchaseState.data.recipient}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Label htmlFor="payment-proof">Payment Proof (Transaction ID)</Label>
                        <Input
                          id="payment-proof"
                          placeholder="tx_..."
                          value={paymentProof}
                          onChange={(e) => setPaymentProof(e.target.value)}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                          For this demo, a mock transaction ID has been generated.
                        </p>
                      </div>

                      <Button className="w-full" size="lg" onClick={handleSubmitPayment} disabled={!paymentProof}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Purchase
                      </Button>
                    </div>
                  )}

                  {/* Error State */}
                  {purchaseState.status === "error" && (
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{purchaseState.message}</AlertDescription>
                      </Alert>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setPurchaseState({ status: "idle" })}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
