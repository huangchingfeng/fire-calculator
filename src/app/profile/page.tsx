'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { ArrowLeft, Save, LogOut, User, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, userProfile, loading, updateProfile, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // 未登入導向
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?redirect=/profile')
    }
  }, [loading, user, router])

  // 載入現有資料
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '')
      setPhone(userProfile.phone || '')
    }
  }, [userProfile])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile({ displayName, phone })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert('儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </button>
          <h1 className="text-lg font-bold text-[#1e3a5f]">個人資料</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* 內容 */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm space-y-6">
          {/* 頭像區 */}
          <div className="flex flex-col items-center gap-3">
            {userProfile?.photoURL ? (
              <Image
                src={userProfile.photoURL}
                alt="頭像"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <p className="text-sm text-gray-500">
              {userProfile?.email || user?.email || ''}
            </p>
          </div>

          {/* 表單 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">姓名</Label>
              <Input
                id="displayName"
                placeholder="您的姓名"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                placeholder="您的電話"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={userProfile?.email || user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* 儲存按鈕 */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? '儲存中...' : saved ? '已儲存！' : '儲存修改'}
          </Button>

          {/* 登出按鈕 */}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </div>
    </div>
  )
}
