'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FireResult } from '@/types/fire'
import { formatCurrencyFull } from '@/lib/format'

interface IncomeBreakdownChartProps {
  result: FireResult
}

const COLORS = ['#1e3a5f', '#10b981', '#8b5cf6', '#ef4444']

export default function IncomeBreakdownChart({
  result,
}: IncomeBreakdownChartProps) {
  const monthlyExpense = result.adjustedAnnualExpense / 12

  // 投資被動收入 = 退休月支出 - 勞保年金 - 勞退金 - 月缺口
  // 這與計算引擎的 gap-analysis 一致
  const investmentIncome = Math.max(
    0,
    Math.round(
      monthlyExpense -
        result.pension.laborInsuranceMonthly -
        result.pension.laborPensionMonthly -
        result.monthlyGap
    )
  )

  const segments = [
    { name: '勞保年金', value: Math.round(result.pension.laborInsuranceMonthly) },
    { name: '勞退金', value: Math.round(result.pension.laborPensionMonthly) },
    { name: '投資被動收入', value: investmentIncome },
  ]

  // 只在有缺口時加入
  if (result.monthlyGap > 0) {
    segments.push({ name: '缺口', value: Math.round(result.monthlyGap) })
  }

  const renderLabel = (props: { name?: string; percent?: number }) => {
    const { name = '', percent = 0 } = props
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-[#1e3a5f]">
          退休收入組成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">退休後每月需要</span>
          <div className="text-xl font-bold text-[#1e3a5f] font-mono">
            {formatCurrencyFull(Math.round(monthlyExpense))}
          </div>
        </div>

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="value"
                label={renderLabel}
                labelLine={{ strokeWidth: 1 }}
              >
                {segments.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCurrencyFull(Number(value)) + '/月',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 明細 */}
        <div className="mt-4 space-y-2">
          {segments.map((seg, i) => (
            <div key={seg.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className={seg.name === '缺口' ? 'text-red-500 font-medium' : 'text-gray-600'}>
                  {seg.name}
                </span>
              </div>
              <span className={`font-mono ${seg.name === '缺口' ? 'text-red-500 font-medium' : 'text-gray-800'}`}>
                {formatCurrencyFull(seg.value)}/月
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
