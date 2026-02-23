'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FireResult } from '@/types/fire'

interface AssetGrowthChartProps {
  result: FireResult
}

function formatWan(value: number): string {
  return `${Math.round(value / 10000)} 萬`
}

export default function AssetGrowthChart({ result }: AssetGrowthChartProps) {
  const data = result.yearlyProjections.map((p) => ({
    age: p.age,
    保守: Math.round(p.conservativeAssets),
    穩健: Math.round(p.moderateAssets),
    積極: Math.round(p.aggressiveAssets),
  }))

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-[#1e3a5f]">
          資產成長曲線
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                label={{ value: '年齡', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatWan}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [
                  `NT$ ${Math.round(Number(value)).toLocaleString('zh-TW')}`,
                ]}
                labelFormatter={(label) => `${label} 歲`}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />

              {/* FIRE 目標線 */}
              <ReferenceLine
                y={result.fireNumber}
                stroke="#ef4444"
                strokeDasharray="8 4"
                strokeWidth={2}
                label={{
                  value: `FIRE 目標 ${formatWan(result.fireNumber)}`,
                  position: 'right',
                  fontSize: 11,
                  fill: '#ef4444',
                }}
              />

              <Area
                type="monotone"
                dataKey="保守"
                stroke="#9ca3af"
                fill="#9ca3af"
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="穩健"
                stroke="#1e3a5f"
                fill="#1e3a5f"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="積極"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
