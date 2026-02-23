'use client'

import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { ExpenseInput } from '@/types/fire'
import { formatCurrencyFull } from '@/lib/format'

interface StepExpenseProps {
  data: ExpenseInput
  onChange: (data: ExpenseInput) => void
}

export default function StepExpense({ data, onChange }: StepExpenseProps) {
  const update = (field: keyof ExpenseInput, value: number) => {
    onChange({ ...data, [field]: value })
  }

  const monthlyTotal =
    data.housingCost +
    data.livingCost +
    data.insuranceCost +
    data.parentalSupport +
    data.educationCost +
    data.otherFixedCost

  const annualTotal = monthlyTotal * 12 + data.annualLargeExpense

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Step 2：你的支出</h2>
        <p className="text-gray-500 mt-1">接下來看看錢都花去哪了</p>
      </div>

      <div className="grid gap-5">
        <CurrencyField
          label="房租 / 房貸月付"
          required
          placeholder="每月房貸或房租"
          value={data.housingCost}
          onChange={(v) => update('housingCost', v)}
          presets={[8000, 15000, 25000, 35000]}
          presetLabels={['8千', '1.5萬', '2.5萬', '3.5萬']}
          showUnitToggle
        />
        <CurrencyField
          label="生活費"
          required
          placeholder="飲食 + 交通 + 日用"
          value={data.livingCost}
          onChange={(v) => update('livingCost', v)}
          presets={[15000, 20000, 30000, 40000]}
          presetLabels={['1.5萬', '2萬', '3萬', '4萬']}
          showUnitToggle
        />
        <CurrencyField
          label="保險費（月繳）"
          placeholder="壽險、醫療險等"
          value={data.insuranceCost}
          onChange={(v) => update('insuranceCost', v)}
          showUnitToggle
        />
        <CurrencyField
          label="孝親費"
          placeholder="每月給父母的錢"
          value={data.parentalSupport}
          onChange={(v) => update('parentalSupport', v)}
          showUnitToggle
        />
        <CurrencyField
          label="教育費"
          placeholder="小孩學費、補習等"
          value={data.educationCost}
          onChange={(v) => update('educationCost', v)}
          showUnitToggle
        />
        <CurrencyField
          label="其他固定支出"
          placeholder="訂閱、會費等"
          value={data.otherFixedCost}
          onChange={(v) => update('otherFixedCost', v)}
          showUnitToggle
        />
        <CurrencyField
          label="年度大額支出"
          placeholder="旅遊、稅金、紅包等"
          value={data.annualLargeExpense}
          onChange={(v) => update('annualLargeExpense', v)}
          note="這項填的是「整年度」的金額"
          showUnitToggle
        />
      </div>

      {/* 即時小計 */}
      <Card className="bg-[#1e3a5f] text-white border-0">
        <CardContent className="py-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/80">月支出合計</span>
            <span className="text-xl font-bold font-mono">
              {formatCurrencyFull(monthlyTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-white/20 pt-2">
            <span className="text-white/80">年支出合計</span>
            <span className="text-2xl font-bold font-mono">
              {formatCurrencyFull(annualTotal)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CurrencyField({
  label,
  placeholder,
  value,
  onChange,
  required,
  note,
  presets,
  presetLabels,
  showUnitToggle,
}: {
  label: string
  placeholder?: string
  value: number
  onChange: (v: number) => void
  required?: boolean
  note?: string
  presets?: number[]
  presetLabels?: string[]
  showUnitToggle?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label className="text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <CurrencyInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        presets={presets}
        presetLabels={presetLabels}
        showUnitToggle={showUnitToggle}
      />
      {note && <p className="text-xs text-gray-400">{note}</p>}
    </div>
  )
}
