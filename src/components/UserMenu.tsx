'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogIn, History, Settings, LogOut } from 'lucide-react'

export default function UserMenu() {
  const { user, userProfile, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // 載入中
  if (loading) {
    return (
      <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
    )
  }

  // 未登入
  if (!user) {
    return (
      <Link href="/auth">
        <Button variant="outline" size="sm" className="gap-1.5">
          <LogIn className="size-4" />
          登入
        </Button>
      </Link>
    )
  }

  // 已登入
  const displayName = userProfile?.displayName || user.displayName || '使用者'
  const initial = displayName.charAt(0).toUpperCase()
  const photoURL = userProfile?.photoURL || user.photoURL

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* 頭像 */}
        {photoURL ? (
          <Image
            src={photoURL}
            alt={displayName}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="size-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {displayName}
        </span>
      </button>

      {/* 下拉選單 */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <Link
            href="/history"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <History className="size-4" />
            計算歷史
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="size-4" />
            個人資料
          </Link>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="size-4" />
            登出
          </button>
        </div>
      )}
    </div>
  )
}
