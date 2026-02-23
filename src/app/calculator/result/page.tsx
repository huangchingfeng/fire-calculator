'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FireResult, FireInput } from '@/types/fire'
import KpiCards from '@/components/result/KpiCards'
import AssetGrowthChart from '@/components/result/AssetGrowthChart'
import IncomeBreakdownChart from '@/components/result/IncomeBreakdownChart'
import Suggestions from '@/components/result/Suggestions'
import ActionButtons from '@/components/result/ActionButtons'
import { generatePdfReport } from '@/components/result/PdfReport'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<FireResult | null>(null)
  const [input, setInput] = useState<FireInput | null>(null)

  useEffect(() => {
    const savedResult = sessionStorage.getItem('fire-result')
    const savedInput = sessionStorage.getItem('fire-input')

    if (!savedResult || !savedInput) {
      router.push('/calculator')
      return
    }

    try {
      setResult(JSON.parse(savedResult))
      setInput(JSON.parse(savedInput))
    } catch {
      router.push('/calculator')
    }
  }, [router])

  if (!result || !input) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-400 text-lg">載入中...</div>
      </div>
    )
  }

  const handleDownloadPdf = () => {
    generatePdfReport(result, input)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 頂部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            FIRE 計算器
          </button>
          <h1 className="text-lg font-bold text-[#1e3a5f]">計算結果</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* 內容 */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* KPI 卡片 */}
        <KpiCards result={result} input={input} />

        {/* 圖表區 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetGrowthChart result={result} />
          <IncomeBreakdownChart result={result} />
        </div>

        {/* 建議 */}
        <Suggestions result={result} input={input} />

        {/* 行動按鈕 */}
        <ActionButtons onDownloadPdf={handleDownloadPdf} input={input} result={result} />

        {/* 底部說明 */}
        <div className="text-center text-xs text-gray-400 pb-8">
          <p>計算結果僅供參考，不構成任何投資建議</p>
          <p className="mt-1">
            數據基於台灣 2026 年度勞保勞退制度及 2% 通膨假設
          </p>
        </div>
      </div>
    </div>
  )
}
