'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatNumberInput, parseNumberInput } from '@/lib/format'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  id?: string
  showUnitToggle?: boolean
  presets?: number[]
  presetLabels?: string[]
}

export function CurrencyInput({
  value,
  onChange,
  placeholder,
  className,
  id,
  showUnitToggle = false,
  presets,
  presetLabels,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [rawInput, setRawInput] = React.useState('')
  const [isWanMode, setIsWanMode] = React.useState(false)

  // 聚焦時顯示純數字，失焦時顯示千分位
  const displayValue = React.useMemo(() => {
    if (isFocused) return rawInput
    if (value === 0) return ''
    if (isWanMode) {
      const wanValue = value / 10000
      return formatNumberInput(wanValue)
    }
    return formatNumberInput(value)
  }, [isFocused, rawInput, value, isWanMode])

  const handleFocus = () => {
    setIsFocused(true)
    if (value === 0) {
      setRawInput('')
    } else if (isWanMode) {
      setRawInput(String(value / 10000))
    } else {
      setRawInput(String(value))
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // 失焦時確保數值正確
    const parsed = parseNumberInput(rawInput)
    const actualValue = isWanMode ? parsed * 10000 : parsed
    if (actualValue !== value) {
      onChange(actualValue)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // 允許數字和逗號
    const cleaned = input.replace(/[^0-9]/g, '')
    setRawInput(cleaned)
    const parsed = parseInt(cleaned, 10)
    const actualValue = isWanMode ? (isNaN(parsed) ? 0 : parsed * 10000) : (isNaN(parsed) ? 0 : parsed)
    onChange(actualValue)
  }

  const handleUnitToggle = () => {
    setIsWanMode(!isWanMode)
  }

  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue)
    if (isWanMode) {
      setRawInput(String(presetValue / 10000))
    } else {
      setRawInput(String(presetValue))
    }
  }

  // 萬元模式換算提示
  const wanHint = isWanMode && value > 0
    ? `= NT$ ${formatNumberInput(value)}`
    : null

  return (
    <div className="space-y-2">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            NT$
          </span>
          <input
            id={id}
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'pl-12 h-12 text-lg',
              className
            )}
          />
        </div>
        {showUnitToggle && (
          <button
            type="button"
            onClick={handleUnitToggle}
            className={cn(
              'h-12 px-3 rounded-md border text-sm font-medium transition-all shrink-0',
              isWanMode
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            {isWanMode ? '萬元' : '元'}
          </button>
        )}
      </div>

      {/* 萬元模式換算提示 */}
      {wanHint && (
        <p className="text-xs text-[#10b981] font-medium">{wanHint}</p>
      )}

      {/* 快選按鈕 */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, i) => {
            const isActive = value === preset
            const label = presetLabels?.[i] ?? formatNumberInput(preset)
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#1e3a5f] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
