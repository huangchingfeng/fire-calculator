'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Shield, Scale, Rocket } from 'lucide-react'
import type { GoalInput } from '@/types/fire'

interface StepGoalsProps {
  data: GoalInput
  onChange: (data: GoalInput) => void
}

const riskOptions = [
  {
    value: 'conservative' as const,
    icon: Shield,
    label: '保守型',
    rate: '年化 4%',
    desc: '以保本為主，波動小',
  },
  {
    value: 'moderate' as const,
    icon: Scale,
    label: '穩健型',
    rate: '年化 7%',
    desc: '推薦，長期投資',
    recommended: true,
  },
  {
    value: 'aggressive' as const,
    icon: Rocket,
    label: '積極型',
    rate: '年化 10%',
    desc: '承受較大波動',
  },
]

export default function StepGoals({ data, onChange }: StepGoalsProps) {
  const update = <K extends keyof GoalInput>(field: K, value: GoalInput[K]) => {
    onChange({ ...data, [field]: value })
  }

  const yearsLeft =
    data.currentAge > 0
      ? Math.max(0, data.targetRetireAge - data.currentAge)
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">
          Step 4：你的目標
        </h2>
        <p className="text-gray-500 mt-1">最後，描繪你的理想退休生活</p>
      </div>

      <div className="grid gap-5">
        {/* 目前年齡 */}
        <div className="space-y-2">
          <Label htmlFor="currentAge" className="text-base">
            目前年齡 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currentAge"
            type="number"
            inputMode="numeric"
            placeholder="例：35"
            value={data.currentAge || ''}
            onChange={(e) => update('currentAge', Number(e.target.value))}
            className="h-12 text-lg"
          />
        </div>

        {/* 期望退休年齡 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base">期望退休年齡</Label>
            <span className="text-lg font-semibold text-[#1e3a5f]">
              {data.targetRetireAge} 歲
            </span>
          </div>
          <Slider
            value={[data.targetRetireAge]}
            onValueChange={(v) => update('targetRetireAge', v[0])}
            min={40}
            max={70}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>40 歲</span>
            <span>70 歲</span>
          </div>
        </div>

        {/* 退休後月生活費 */}
        <div className="space-y-2">
          <Label htmlFor="retirementExpense" className="text-base">
            退休後每月生活費 <span className="text-red-500">*</span>
          </Label>
          <CurrencyInput
            id="retirementExpense"
            value={data.retirementMonthlyExpense}
            onChange={(v) => update('retirementMonthlyExpense', v)}
            placeholder="例：40,000"
            showUnitToggle
            presets={[30000, 40000, 50000, 60000]}
            presetLabels={['3萬', '4萬', '5萬', '6萬']}
          />
          <p className="text-xs text-gray-400">
            通常是目前生活費的 70-80%
          </p>
        </div>

        {/* 投資風險屬性 */}
        <div className="space-y-3">
          <Label className="text-base">投資風險屬性</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {riskOptions.map((opt) => {
              const IconComponent = opt.icon
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('riskProfile', opt.value)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    data.riskProfile === opt.value
                      ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.recommended && (
                    <span className="absolute -top-2.5 right-3 bg-[#10b981] text-white text-xs px-2 py-0.5 rounded-full">
                      推薦
                    </span>
                  )}
                  <div className="mb-1">
                    <IconComponent
                      className={`size-6 ${
                        data.riskProfile === opt.value
                          ? 'text-[#1e3a5f]'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div className="font-semibold text-[#1e3a5f]">{opt.label}</div>
                  <div className="text-sm text-[#10b981] font-medium">
                    {opt.rate}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 即時小計 */}
      <Card className="bg-[#1e3a5f] text-white border-0">
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">距離退休還有</span>
            <span className="text-2xl font-bold font-mono">
              {yearsLeft} 年
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
