'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { formatIDR } from '@/lib/utils'
import { Price } from '@/types'

export function PriceChart({ prices }: { prices: Price[] }) {
  const grouped: Record<string, Record<string, number>> = {}

  prices.forEach((p) => {
    const date = new Date(p.scrapedAt).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    })

    if (!grouped[date]) {
      grouped[date] = {}
    }

    if (
      grouped[date][p.platform] === undefined ||
      p.price < grouped[date][p.platform]
    ) {
      grouped[date][p.platform] = p.price
    }
  })

  const data = Object.entries(grouped).map(([date, values]) => ({
    date,
    ...values,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(216 34% 16%)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{
            fill: 'hsl(215 20% 50%)',
            fontSize: 11,
            fontFamily: 'Inter',
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tickFormatter={(value) =>
            `${(Number(value) / 1000).toFixed(0)}k`
          }
          tick={{
            fill: 'hsl(215 20% 50%)',
            fontSize: 11,
            fontFamily: 'JetBrains Mono',
          }}
          axisLine={false}
          tickLine={false}
          width={48}
        />

        <Tooltip
          formatter={(value, name) => [
            formatIDR(Number(value)),
            String(name).charAt(0).toUpperCase() + String(name).slice(1),
          ]}
          contentStyle={{
            background: 'hsl(222 47% 10%)',
            border: '1px solid hsl(216 34% 16%)',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'Inter',
          }}
          labelStyle={{
            color: 'hsl(213 31% 91%)',
            marginBottom: '4px',
          }}
        />

        <Legend
          wrapperStyle={{
            fontSize: '12px',
            color: 'hsl(215 20% 50%)',
            paddingTop: '16px',
          }}
        />

        <Line
          type="monotone"
          dataKey="tokopedia"
          name="Tokopedia"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#34d399' }}
        />

        <Line
          type="monotone"
          dataKey="shopee"
          name="Shopee"
          stroke="#fb923c"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#fb923c' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}