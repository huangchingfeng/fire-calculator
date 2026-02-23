'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getCalculations, deleteCalculation, type SavedCalculation } from '@/lib/firestore'
import { formatCurrencyFull } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Trash2, Calculator, Loader2 } from 'lucide-react'

export default function HistoryPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 未登入導向
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?redirect=/history')
    }
  }, [loading, user, router])

  // 載入資料
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const data = await getCalculations(user.uid)
        setCalculations(data)
      } catch {
        // 靜默失敗
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [user])

  const handleView = (calc: SavedCalculation) => {
    sessionStorage.setItem('fire-input', JSON.stringify(calc.input))
    sessionStorage.setItem('fire-result', JSON.stringify(calc.result))
    router.push('/calculator/result')
  }

  const handleDelete = async (calcId: string) => {
    if (!user) return
    if (!confirm('確定要刪除這筆紀錄嗎？')) return
    setDeletingId(calcId)
    try {
      await deleteCalculation(user.uid, calcId)
      setCalculations((prev) => prev.filter((c) => c.id !== calcId))
    } catch {
      alert('刪除失敗，請稍後再試')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 頂部 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </button>
          <h1 className="text-lg font-bold text-[#1e3a5f]">計算歷史</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* 內容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {fetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : calculations.length === 0 ? (
          /* 空狀態 */
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Calculator className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">還沒有計算紀錄</p>
            <p className="text-sm text-gray-400">開始第一筆計算吧！</p>
            <Button
              onClick={() => router.push('/calculator')}
              className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              開始計算
            </Button>
          </div>
        ) : (
          /* 紀錄列表 */
          <div className="space-y-4">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="bg-white rounded-xl border p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        {formatDate(calc.createdAt)}
                      </span>
                      <span className="font-medium text-[#1e3a5f]">
                        {calc.clientName || '未命名客戶'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#1e3a5f]">
                      FIRE：{formatCurrencyFull(calc.fireNumber)}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>達標年齡：{calc.fireAge === Infinity ? '無法達標' : `${Math.round(calc.fireAge)} 歲`}</span>
                      <span>儲蓄率：{(calc.savingRate * 100).toFixed(0)}%</span>
                    </div>
                    {calc.clientNote && (
                      <p className="text-sm text-gray-400 mt-1">
                        {calc.clientNote}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(calc)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(calc.id)}
                      disabled={deletingId === calc.id}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {deletingId === calc.id ? '刪除中...' : '刪除'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
