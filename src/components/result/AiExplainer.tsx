'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface AiExplainerContext {
  monthlySalary: number
  monthlyExpense: number
  currentAssets: number
  currentAge: number
  targetRetireAge: number
  fireNumber: number
  savingRate: number
  monthlyGap: number
}

interface AiExplainerProps {
  metricName: string
  metricValue: string
  context: AiExplainerContext
}

export default function AiExplainer({
  metricName,
  metricValue,
  context,
}: AiExplainerProps) {
  const [open, setOpen] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchExplanation = async () => {
    // 已有快取，不重複請求
    if (explanation) return

    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metricName, metricValue, context }),
      })

      if (!res.ok) throw new Error('API request failed')

      const data = await res.json()
      setExplanation(data.explanation)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setOpen(true)
    fetchExplanation()
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#1e3a5f] transition-colors mt-2"
      >
        <Sparkles className="w-3 h-3" />
        <span>AI 解說</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">{metricName}</DialogTitle>
            <DialogDescription className="text-lg font-semibold font-mono">
              {metricValue}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 py-6 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">正在產生解說...</span>
              </div>
            )}

            {error && !loading && (
              <div className="text-sm text-gray-500 py-4 text-center">
                目前無法產生解說，請稍後再試。
              </div>
            )}

            {explanation && !loading && (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {explanation}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-gray-400 text-center">
              AI 解說僅供參考，不構成投資建議
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
