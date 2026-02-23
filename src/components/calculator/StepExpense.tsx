'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
        <p className="text-gray-500 mt-1">接下來看看錢都花去哪了 💰</p>
      </div>

      <div className="grid gap-5">
        <NumberField
          label="房租 / 房貸月付"
          required
          placeholder="每月房貸或房租"
          value={data.housingCost}
          onChange={(v) => update('housingCost', v)}
        />
        <NumberField
          label="生活費"
          required
          placeholder="飲食 + 交通 + 日用"
          value={data.livingCost}
          onChange={(v) => update('livingCost', v)}
        />
        <NumberField
          label="保險費（月繳）"
          placeholder="壽險、醫療險等"
          value={data.insuranceCost}
          onChange={(v) => update('insuranceCost', v)}
        />
        <NumberField
          label="孝親費"
          placeholder="每月給父母的錢"
          value={data.parentalSupport}
          onChange={(v) => update('parentalSupport', v)}
        />
        <NumberField
          label="教育費"
          placeholder="小孩學費、補習等"
          value={data.educationCost}
          onChange={(v) => update('educationCost', v)}
        />
        <NumberField
          label="其他固定支出"
          placeholder="訂閱、會費等"
          value={data.otherFixedCost}
          onChange={(v) => update('otherFixedCost', v)}
        />
        <NumberField
          label="年度大額支出"
          placeholder="旅遊、稅金、紅包等"
          value={data.annualLargeExpense}
          onChange={(v) => update('annualLargeExpense', v)}
          note="這項填的是「整年度」的金額"
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

function NumberField({
  label,
  placeholder,
  value,
  onChange,
  required,
  note,
}: {
  label: string
  placeholder?: string
  value: number
  onChange: (v: number) => void
  required?: boolean
  note?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          NT$
        </span>
        <Input
          type="number"
          inputMode="numeric"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pl-12 h-12 text-lg"
        />
      </div>
      {note && <p className="text-xs text-gray-400">{note}</p>}
    </div>
  )
}
