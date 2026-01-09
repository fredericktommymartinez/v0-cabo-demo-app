"use client"

import { useRef } from "react"
import type { Voucher, Experience } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VoucherQRCode } from "@/components/voucher-qr-code"
import { CheckCircle2, Copy, Download, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface VoucherDisplayProps {
  voucher: Voucher
  experience: Experience
}

export function VoucherDisplay({ voucher, experience }: VoucherDisplayProps) {
  const voucherRef = useRef<HTMLDivElement>(null)

  const copyVoucherJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(voucher, null, 2))
  }

  const downloadVoucherJSON = () => {
    const blob = new Blob([JSON.stringify(voucher, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `voucher-${voucher.voucherId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">Purchase Complete!</span>
      </div>

      <Card ref={voucherRef} className="overflow-hidden border-2">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Digital Voucher</p>
              <h3 className="text-lg font-bold">{experience.name}</h3>
            </div>
            <Badge variant="outline" className="bg-background">
              Valid
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div className="flex justify-center">
            <VoucherQRCode voucher={voucher} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(experience.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{experience.location}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Voucher ID</span>
              <span className="font-mono">{voucher.voucherId.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issued</span>
              <span>{new Date(voucher.issuedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span>{new Date(voucher.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyVoucherJSON} className="flex-1 bg-transparent">
          <Copy className="w-4 h-4 mr-2" />
          Copy JSON
        </Button>
        <Button variant="outline" size="sm" onClick={downloadVoucherJSON} className="flex-1 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Voucher JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-x-auto p-3 bg-background rounded-md border">
            {JSON.stringify(voucher, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Link href="/redeem" className="block">
        <Button variant="secondary" className="w-full">
          Go to Redemption Page
        </Button>
      </Link>
    </div>
  )
}
