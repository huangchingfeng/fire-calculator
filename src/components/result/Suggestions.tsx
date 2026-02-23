'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FireResult, FireInput } from '@/types/fire'
import { formatCurrencyFull } from '@/lib/format'

interface SuggestionsProps {
  result: FireResult
  input: FireInput
}

interface Suggestion {
  icon: string
  title: string
  desc: string
  priority: 'high' | 'medium' | 'low'
}

export default function Suggestions({ result, input }: SuggestionsProps) {
  const suggestions: Suggestion[] = []

  // 儲蓄率太低
  if (result.savingRate < 0.3) {
    suggestions.push({
      icon: '📈',
      title: '提高儲蓄率',
      desc: `目前儲蓄率 ${(result.savingRate * 100).toFixed(1)}%，建議至少提高到 30%。提高儲蓄率是加速財務自由最有效的方式。`,
      priority: 'high',
    })
  }

  // 自提比例偏低
  if (input.income.voluntaryPensionRate < 0.06) {
    const currentRate = (input.income.voluntaryPensionRate * 100).toFixed(0)
    suggestions.push({
      icon: '🏦',
      title: '提高勞退自提到 6%',
      desc: `目前自提 ${currentRate}%，提高到 6% 可以享受所得稅扣除優惠，等於政府幫你加薪。`,
      priority: 'medium',
    })
  }

  // 有缺口
  if (result.monthlyGap > 0) {
    suggestions.push({
      icon: '💰',
      title: '別擔心，只要做一點調整就能補上',
      desc: `每月缺口 ${formatCurrencyFull(result.monthlyGap)}，透過定期定額投資 ETF 或增加被動收入，就能逐步補足。很多人都是從這一步開始邁向財務自由的。`,
      priority: 'high',
    })
  }

  // 達標年齡超過目標
  if (result.fireAge > input.goal.targetRetireAge && result.fireAge !== Infinity) {
    const diff = result.fireAge - input.goal.targetRetireAge
    const extraMonthly = Math.round(result.monthlyGap * 12 / (diff > 0 ? diff : 1) / 12)
    suggestions.push({
      icon: '⏰',
      title: '離目標不遠了，加把勁！',
      desc: `預計 ${result.fireAge} 歲達標，比目標晚 ${Math.round(diff)} 年。每月多投資約 ${formatCurrencyFull(Math.max(extraMonthly, 5000))}，就有機會提早實現。`,
      priority: 'medium',
    })
  }

  // 無缺口時的正面訊息
  if (result.monthlyGap <= 0 && result.fireAge <= input.goal.targetRetireAge) {
    suggestions.push({
      icon: '🎉',
      title: '恭喜！你的退休規劃已經在正確的軌道上',
      desc: '你的財務計畫非常健康，以目前的速度持續下去，就能穩穩地達成財務自由目標。',
      priority: 'low',
    })
  }

  // 儲蓄率很高，給正面鼓勵
  if (result.savingRate >= 0.5) {
    suggestions.push({
      icon: '💪',
      title: '儲蓄率很棒！',
      desc: `${(result.savingRate * 100).toFixed(1)}% 的儲蓄率非常優秀，你走在財務自由的快車道上。`,
      priority: 'low',
    })
  }

  // 如果沒有任何建議，給一個正面的
  if (suggestions.length === 0) {
    suggestions.push({
      icon: '✅',
      title: '財務狀況良好',
      desc: '你的財務計畫看起來很健康，持續保持就能穩步邁向財務自由。',
      priority: 'low',
    })
  }

  // 取前 4 條
  const displayed = suggestions.slice(0, 4)

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-[#1e3a5f]">
          給你的建議
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayed.map((s, i) => (
          <div
            key={i}
            className={`flex gap-4 p-4 rounded-xl ${
              s.priority === 'high'
                ? 'bg-red-50 border border-red-100'
                : s.priority === 'medium'
                  ? 'bg-amber-50 border border-amber-100'
                  : 'bg-green-50 border border-green-100'
            }`}
          >
            <div className="text-2xl flex-shrink-0">{s.icon}</div>
            <div>
              <div className="font-semibold text-gray-800">{s.title}</div>
              <div className="text-sm text-gray-600 mt-1">{s.desc}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
