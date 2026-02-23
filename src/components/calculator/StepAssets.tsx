'use client'

import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { AssetInput } from '@/types/fire'
import { formatCurrencyFull } from '@/lib/format'

interface StepAssetsProps {
  data: AssetInput
  onChange: (data: AssetInput) => void
}

export default function StepAssets({ data, onChange }: StepAssetsProps) {
  const update = (field: keyof AssetInput, value: number) => {
    onChange({ ...data, [field]: value })
  }

  const totalAssets =
    data.savings + data.investments + data.insuranceSavings + data.otherAssets
  const netAssets = totalAssets - data.totalDebt

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Step 3：你的資產</h2>
        <p className="text-gray-500 mt-1">盤點一下你現有的資產</p>
      </div>

      <div className="grid gap-5">
        <AssetField
          label="銀行存款"
          required
          placeholder="活存 + 定存"
          value={data.savings}
          onChange={(v) => update('savings', v)}
          showUnitToggle
          presets={[500000, 1000000, 2000000, 5000000]}
          presetLabels={['50萬', '100萬', '200萬', '500萬']}
        />
        <AssetField
          label="投資部位"
          placeholder="股票 + 基金 + ETF"
          value={data.investments}
          onChange={(v) => update('investments', v)}
          showUnitToggle
        />
        <AssetField
          label="儲蓄險"
          placeholder="保單價值準備金"
          value={data.insuranceSavings}
          onChange={(v) => update('insuranceSavings', v)}
          showUnitToggle
        />
        <AssetField
          label="其他資產"
          placeholder="房產、黃金等"
          value={data.otherAssets}
          onChange={(v) => update('otherAssets', v)}
          showUnitToggle
        />
        <AssetField
          label="負債總額"
          placeholder="房貸 + 車貸 + 學貸 + 信貸"
          value={data.totalDebt}
          onChange={(v) => update('totalDebt', v)}
          showUnitToggle
          isDebt
        />
      </div>

      {/* 即時小計 */}
      <Card
        className={`border-0 ${netAssets >= 0 ? 'bg-[#1e3a5f]' : 'bg-red-600'} text-white`}
      >
        <CardContent className="py-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/80">資產總計</span>
            <span className="text-lg font-mono">
              {formatCurrencyFull(totalAssets)}
            </span>
          </div>
          {data.totalDebt > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-white/80">負債總計</span>
              <span className="text-lg font-mono text-red-300">
                - {formatCurrencyFull(data.totalDebt)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-white/20 pt-2">
            <span className="text-white/80">淨資產</span>
            <span className="text-2xl font-bold font-mono">
              {formatCurrencyFull(netAssets)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AssetField({
  label,
  placeholder,
  value,
  onChange,
  required,
  isDebt,
  showUnitToggle,
  presets,
  presetLabels,
}: {
  label: string
  placeholder?: string
  value: number
  onChange: (v: number) => void
  required?: boolean
  isDebt?: boolean
  showUnitToggle?: boolean
  presets?: number[]
  presetLabels?: string[]
}) {
  return (
    <div className="space-y-2">
      <Label className={`text-base ${isDebt ? 'text-red-600' : ''}`}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <CurrencyInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        showUnitToggle={showUnitToggle}
        presets={presets}
        presetLabels={presetLabels}
        className={isDebt ? 'border-red-200 focus-visible:border-red-400' : undefined}
      />
    </div>
  )
}
