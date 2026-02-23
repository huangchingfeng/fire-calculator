'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import type { IncomeInput } from '@/types/fire'
import { formatCurrencyFull } from '@/lib/format'

interface StepIncomeProps {
  data: IncomeInput
  onChange: (data: IncomeInput) => void
}

export default function StepIncome({ data, onChange }: StepIncomeProps) {
  const update = (field: keyof IncomeInput, value: number) => {
    onChange({ ...data, [field]: value })
  }

  // 即時計算年收入
  const annualIncome =
    data.monthlySalary * 12 +
    data.monthlySalary * data.bonusMonths +
    data.otherMonthlyIncome * 12 +
    data.spouseMonthlyIncome * 12

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Step 1：你的收入</h2>
        <p className="text-gray-500 mt-1">先來看看你的收入結構 💼</p>
      </div>

      <div className="grid gap-5">
        {/* 月薪 */}
        <div className="space-y-2">
          <Label htmlFor="monthlySalary" className="text-base">
            月薪（稅前）<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              NT$
            </span>
            <Input
              id="monthlySalary"
              type="number"
              inputMode="numeric"
              placeholder="例：50000"
              value={data.monthlySalary || ''}
              onChange={(e) => update('monthlySalary', Number(e.target.value))}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* 年終 */}
        <div className="space-y-2">
          <Label htmlFor="bonusMonths" className="text-base">
            年終獎金（幾個月）
          </Label>
          <Input
            id="bonusMonths"
            type="number"
            inputMode="decimal"
            placeholder="例：2"
            value={data.bonusMonths || ''}
            onChange={(e) => update('bonusMonths', Number(e.target.value))}
            className="h-12 text-lg"
          />
        </div>

        {/* 其他月收入 */}
        <div className="space-y-2">
          <Label htmlFor="otherMonthlyIncome" className="text-base">
            其他月收入（選填）
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              NT$
            </span>
            <Input
              id="otherMonthlyIncome"
              type="number"
              inputMode="numeric"
              placeholder="兼職、租金、股利等"
              value={data.otherMonthlyIncome || ''}
              onChange={(e) =>
                update('otherMonthlyIncome', Number(e.target.value))
              }
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* 配偶月收入 */}
        <div className="space-y-2">
          <Label htmlFor="spouseMonthlyIncome" className="text-base">
            配偶月收入（選填）
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              NT$
            </span>
            <Input
              id="spouseMonthlyIncome"
              type="number"
              inputMode="numeric"
              placeholder="如果有配偶收入"
              value={data.spouseMonthlyIncome || ''}
              onChange={(e) =>
                update('spouseMonthlyIncome', Number(e.target.value))
              }
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* 勞保年資 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base">勞保投保年資</Label>
            <span className="text-lg font-semibold text-[#1e3a5f]">
              {data.laborInsuranceYears} 年
            </span>
          </div>
          <Slider
            value={[data.laborInsuranceYears]}
            onValueChange={(v) => update('laborInsuranceYears', v[0])}
            min={0}
            max={45}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 年</span>
            <span>45 年</span>
          </div>
        </div>

        {/* 勞退自提 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base">勞退自提比例</Label>
            <span className="text-lg font-semibold text-[#1e3a5f]">
              {(data.voluntaryPensionRate * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[data.voluntaryPensionRate * 100]}
            onValueChange={(v) => update('voluntaryPensionRate', v[0] / 100)}
            min={0}
            max={6}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>6%</span>
          </div>
        </div>
      </div>

      {/* 即時小計 */}
      <Card className="bg-[#1e3a5f] text-white border-0">
        <CardContent className="py-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80">年收入合計</span>
            <span className="text-2xl font-bold font-mono">
              {formatCurrencyFull(annualIncome)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
