'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { FireResult, FireInput } from '@/types/fire'
import { formatCurrency, formatAge, formatPercent } from '@/lib/format'
import { Target, Flag, TrendingDown, CheckCircle, Gauge } from 'lucide-react'
import AiExplainer from './AiExplainer'

interface KpiCardsProps {
  result: FireResult
  input: FireInput
}

export default function KpiCards({ result, input }: KpiCardsProps) {
  const hasGap = result.monthlyGap > 0
  const savingRatePercent = Math.round(result.savingRate * 100)

  const totalMonthlyExpense =
    input.expense.housingCost +
    input.expense.livingCost +
    input.expense.insuranceCost +
    input.expense.parentalSupport +
    input.expense.educationCost +
    input.expense.otherFixedCost +
    Math.round(input.expense.annualLargeExpense / 12)

  const aiContext = {
    monthlySalary: input.income.monthlySalary,
    monthlyExpense: totalMonthlyExpense,
    currentAssets: result.currentNetAssets,
    currentAge: input.goal.currentAge,
    targetRetireAge: input.goal.targetRetireAge,
    fireNumber: result.fireNumber,
    savingRate: result.savingRate,
    monthlyGap: result.monthlyGap,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* FIRE 數字 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#1e3a5f]/10 rounded-lg p-2">
              <Target className="w-7 h-7 text-[#1e3a5f]" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">FIRE 數字</div>
          <div className="text-2xl font-bold text-[#1e3a5f] font-mono">
            {formatCurrency(result.fireNumber)}
          </div>
          <div className="text-xs text-gray-400 mt-1">你需要累積的退休資產</div>
          <AiExplainer
            metricName="FIRE 目標資產"
            metricValue={formatCurrency(result.fireNumber)}
            context={aiContext}
          />
        </CardContent>
      </Card>

      {/* 達標年齡 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#1e3a5f]/10 rounded-lg p-2">
              <Flag className="w-7 h-7 text-[#1e3a5f]" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">達標年齡</div>
          <div className="text-2xl font-bold text-[#1e3a5f] font-mono">
            {formatAge(result.fireAge)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            還要 {result.yearsToFire === Infinity ? '---' : `${Math.round(result.yearsToFire)}`} 年
          </div>
          <AiExplainer
            metricName="預計達標年齡"
            metricValue={formatAge(result.fireAge)}
            context={aiContext}
          />
        </CardContent>
      </Card>

      {/* 每月缺口 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className={`rounded-lg p-2 ${hasGap ? 'bg-red-500/10' : 'bg-[#10b981]/10'}`}>
              {hasGap
                ? <TrendingDown className="w-7 h-7 text-red-500" />
                : <CheckCircle className="w-7 h-7 text-[#10b981]" />
              }
            </div>
          </div>
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
          <AiExplainer
            metricName="退休每月缺口"
            metricValue={hasGap ? `${formatCurrency(result.monthlyGap)}/月` : '無缺口'}
            context={aiContext}
          />
        </CardContent>
      </Card>

      {/* 儲蓄率 */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-4 pb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#1e3a5f]/10 rounded-lg p-2">
              <Gauge className="w-7 h-7 text-[#1e3a5f]" />
            </div>
          </div>
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
          <AiExplainer
            metricName="目前儲蓄率"
            metricValue={formatPercent(result.savingRate)}
            context={aiContext}
          />
        </CardContent>
      </Card>
    </div>
  )
}
