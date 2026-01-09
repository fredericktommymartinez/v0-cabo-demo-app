"use client"

import { useState } from "react"
import Link from "next/link"
import type { RedemptionResult } from "@/lib/types"
import { getExperienceById } from "@/lib/experiences"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RedemptionChart } from "@/components/redemption-chart"
import { Ticket, ArrowLeft, QrCode, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"

type RedeemState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "result"; data: RedemptionResult }
  | { status: "error"; message: string }

export default function RedeemPage() {
  const [voucherJSON, setVoucherJSON] = useState("")
  const [redeemState, setRedeemState] = useState<RedeemState>({ status: "idle" })

  const handleRedeem = async () => {
    if (!voucherJSON.trim()) return

    setRedeemState({ status: "loading" })

    try {
      const voucher = JSON.parse(voucherJSON)

      const response = await fetch("/api/voucher/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucher),
      })

      const result: RedemptionResult = await response.json()
      setRedeemState({ status: "result", data: result })
    } catch (e) {
      if (e instanceof SyntaxError) {
        setRedeemState({ status: "error", message: "Invalid JSON format" })
      } else {
        setRedeemState({ status: "error", message: "Failed to validate voucher" })
      }
    }
  }

  const getStatusIcon = (status: RedemptionResult["status"]) => {
    switch (status) {
      case "valid":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />
      case "invalid":
        return <XCircle className="w-6 h-6 text-red-600" />
      case "expired":
        return <Clock className="w-6 h-6 text-amber-600" />
    }
  }

  const getStatusColor = (status: RedemptionResult["status"]) => {
    switch (status) {
      case "valid":
        return "border-emerald-500/50 bg-emerald-500/10"
      case "invalid":
        return "border-red-500/50 bg-red-500/10"
      case "expired":
        return "border-amber-500/50 bg-amber-500/10"
    }
  }

  const getExperienceName = (experienceId?: string) => {
    if (!experienceId) return null
    const experience = getExperienceById(experienceId)
    return experience?.name
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Redeem Voucher</h1>
          <p className="text-muted-foreground">Paste your voucher JSON below to validate and redeem it.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Voucher Validation</CardTitle>
            <CardDescription>Enter the voucher JSON object to verify its authenticity and validity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`{
  "voucherId": "voucher_...",
  "experienceId": "exp-001",
  "purchaser": "user@example.com",
  "issuedAt": "2026-01-09T...",
  "expiresAt": "2026-02-08T...",
  "signature": "sig_..."
}`}
              value={voucherJSON}
              onChange={(e) => setVoucherJSON(e.target.value)}
              className="font-mono text-sm min-h-[200px]"
            />

            <Button
              className="w-full"
              size="lg"
              onClick={handleRedeem}
              disabled={!voucherJSON.trim() || redeemState.status === "loading"}
            >
              {redeemState.status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Redeem Voucher
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error State */}
        {redeemState.status === "error" && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{redeemState.message}</AlertDescription>
          </Alert>
        )}

        {/* Result State */}
        {redeemState.status === "result" && (
          <Card className={`mb-6 border-2 ${getStatusColor(redeemState.data.status)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {getStatusIcon(redeemState.data.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold capitalize mb-1">
                    {redeemState.data.status === "valid"
                      ? "Valid Voucher"
                      : redeemState.data.status === "expired"
                        ? "Expired Voucher"
                        : "Invalid Voucher"}
                  </h3>
                  <p className="text-muted-foreground">{redeemState.data.message}</p>

                  {redeemState.data.experienceId && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">
                        {getExperienceName(redeemState.data.experienceId) || redeemState.data.experienceId}
                      </p>
                    </div>
                  )}

                  {redeemState.data.voucherId && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Voucher ID</p>
                      <p className="font-mono text-sm">{redeemState.data.voucherId}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart.js Visualization */}
        <RedemptionChart />

        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                1
              </span>
              <p>The voucher JSON contains a cryptographic signature that proves authenticity.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                2
              </span>
              <p>Our system verifies the signature matches the voucher data to prevent tampering.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                3
              </span>
              <p>Expiration dates are checked to ensure the voucher is still valid for use.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
