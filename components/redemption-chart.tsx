"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

Chart.register(...registerables)

// Mock data for demonstration
const mockRedemptionData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  vouchers: [12, 19, 8, 15, 22, 30, 25],
  revenue: [540, 855, 360, 675, 990, 1350, 1125],
}

export function RedemptionChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: mockRedemptionData.labels,
        datasets: [
          {
            label: "Vouchers Redeemed",
            data: mockRedemptionData.vouchers,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Revenue (USDC)",
            data: mockRedemptionData.revenue,
            type: "line",
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Vouchers",
              color: "rgba(59, 130, 246, 0.8)",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "USDC",
              color: "rgba(16, 185, 129, 0.8)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Redemption Analytics</CardTitle>
        <CardDescription>Weekly voucher redemptions and revenue (demo data)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  )
}
