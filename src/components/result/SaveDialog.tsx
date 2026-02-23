'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { saveCalculation } from '@/lib/firestore'
import { formatCurrencyFull } from '@/lib/format'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, Save, CheckCircle2 } from 'lucide-react'
import type { FireInput, FireResult } from '@/types/fire'

interface SaveDialogProps {
  input: FireInput
  result: FireResult
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SaveDialog({ input, result, open, onOpenChange }: SaveDialogProps) {
  const { user } = useAuth()
  const [clientName, setClientName] = useState('')
  const [clientNote, setClientNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    try {
      await saveCalculation(user.uid, input, result, clientName, clientNote)
      setSaved(true)
      setTimeout(() => {
        onOpenChange(false)
        // 重置狀態以便下次打開
        setSaved(false)
        setClientName('')
        setClientNote('')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  // 未登入狀態
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">保存計算結果</DialogTitle>
            <DialogDescription>
              登入後即可保存計算紀錄，隨時回顧
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              登入後即可保存計算紀錄，方便日後查閱與比較
            </p>
            <Button
              asChild
              className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
            >
              <a href="/auth?redirect=/calculator/result">前往登入</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // 保存成功
  if (saved) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-[#10b981]" />
            <p className="text-lg font-semibold text-[#1e3a5f]">已保存！</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // 已登入 - 保存表單
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#1e3a5f]">保存計算結果</DialogTitle>
          <DialogDescription>
            FIRE 數字：{formatCurrencyFull(result.fireNumber)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">客戶姓名（選填）</Label>
            <Input
              id="clientName"
              placeholder="此次計算的客戶"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientNote">備註（選填）</Label>
            <Input
              id="clientNote"
              placeholder="任何備忘"
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
