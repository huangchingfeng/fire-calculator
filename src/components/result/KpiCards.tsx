'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { FireResult } from '@/types/fire'
import { formatCurrency, formatAge, formatPercent } from '@/lib/format'

interface KpiCardsProps {
  result: FireResult
}

export default function KpiCards({ result }: KpiCardsProps) {
  const hasGap = result.monthlyGap > 0
  const savingRatePercent = Math.round(result.savingRate * 100)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* FIRE 數字 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm text-gray-500 mb-1">FIRE 數字</div>
          <div className="text-2xl font-bold text-[#1e3a5f] font-mono">
            {formatCurrency(result.fireNumber)}
          </div>
          <div className="text-xs text-gray-400 mt-1">你需要累積的退休資產</div>
        </CardContent>
      </Card>

      {/* 達標年齡 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-sm text-gray-500 mb-1">達標年齡</div>
          <div className="text-2xl font-bold text-[#1e3a5f] font-mono">
            {formatAge(result.fireAge)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            還要 {result.yearsToFire === Infinity ? '---' : `${Math.round(result.yearsToFire)}`} 年
          </div>
        </CardContent>
      </Card>

      {/* 每月缺口 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="text-3xl mb-2">{hasGap ? '📉' : '✅'}</div>
          <div className="text-sm text-gray-500 mb-1">退休月缺口</div>
          <div
            className={`text-2xl font-bold font-mono ${hasGap ? 'text-red-500' : 'text-[#10b981]'}`}
          >
            {hasGap
              ? `${formatCurrency(result.monthlyGap)}/月`
              : '無缺口'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {hasGap ? '需補足的金額' : '退休收入充足'}
          </div>
        </CardContent>
      </Card>

      {/* 儲蓄率 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-sm text-gray-500 mb-1">儲蓄率</div>
          <div className="text-2xl font-bold text-[#1e3a5f] font-mono">
            {formatPercent(result.savingRate)}
          </div>
          <Progress
            value={savingRatePercent}
            className="mt-2 h-2"
          />
          <div className="text-xs text-gray-400 mt-1">
            {savingRatePercent >= 50
              ? '很棒！'
              : savingRatePercent >= 30
                ? '還不錯'
                : '有進步空間'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
