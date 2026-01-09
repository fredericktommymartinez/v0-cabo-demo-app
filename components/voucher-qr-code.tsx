"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { Voucher } from "@/lib/types"

Chart.register(...registerables)

interface VoucherQRCodeProps {
  voucher: Voucher
  size?: number
}

// Generate a visual representation of voucher data using Chart.js
export function VoucherQRCode({ voucher, size = 180 }: VoucherQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Generate deterministic data from voucher for visualization
    const voucherString = JSON.stringify(voucher)
    const hashValues: number[] = []
    for (let i = 0; i < 8; i++) {
      let hash = 0
      for (let j = i * 10; j < Math.min((i + 1) * 10, voucherString.length); j++) {
        hash = ((hash << 5) - hash + voucherString.charCodeAt(j % voucherString.length)) | 0
      }
      hashValues.push(Math.abs(hash % 100))
    }

    // Create a radar chart as visual "encoding" of the voucher
    chartRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["V", "O", "U", "C", "H", "E", "R", "ID"],
        datasets: [
          {
            data: hashValues,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 0.8)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            pointLabels: {
              font: {
                size: 10,
                weight: "bold",
              },
              color: "#666",
            },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [voucher])

  return (
    <div className="p-4 bg-white rounded-lg border-2 border-dashed border-muted">
      <canvas ref={canvasRef} width={size} height={size} />
      <p className="text-xs text-center text-muted-foreground mt-2">Visual Voucher Encoding</p>
    </div>
  )
}
