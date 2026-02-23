'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Mail, Lock, User, Phone, Loader2 } from 'lucide-react'

// Firebase 錯誤碼中文化
function getErrorMessage(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': '此 Email 已被註冊',
    'auth/invalid-email': 'Email 格式不正確',
    'auth/weak-password': '密碼至少需要 6 個字元',
    'auth/user-not-found': '找不到此帳號',
    'auth/wrong-password': '密碼錯誤',
    'auth/invalid-credential': '帳號或密碼錯誤',
    'auth/too-many-requests': '嘗試次數過多，請稍後再試',
    'auth/popup-closed-by-user': '登入視窗已關閉',
    'auth/popup-blocked': '瀏覽器封鎖了登入視窗，請允許彈出視窗',
    'auth/unauthorized-domain': '此網域尚未授權，請到 Firebase Console → Authentication → Settings → 授權網域 新增此網域',
    'auth/network-request-failed': '網路連線異常，請檢查網路',
    'auth/cancelled-popup-request': '登入已取消',
    'auth/internal-error': '系統內部錯誤，請稍後再試',
  }
  return map[code] ?? `登入失敗（${code || '未知錯誤'}）`
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <Loader2 className="size-8 animate-spin text-[#1e3a5f]" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  )
}

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isFirebaseReady } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 登入表單
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // 註冊表單
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const redirectTo = searchParams.get('redirect') || '/'

  const handleSuccess = () => {
    router.push(redirectTo)
  }

  const handleError = (err: unknown) => {
    const code = (err as { code?: string })?.code ?? ''
    const message = (err as { message?: string })?.message ?? ''
    if (code) {
      setError(getErrorMessage(code))
    } else {
      setError(`登入失敗：${message || '未知錯誤'}`)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      handleSuccess()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmail(loginEmail, loginPassword)
      handleSuccess()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!regName.trim()) {
      setError('請輸入姓名')
      return
    }
    setLoading(true)
    try {
      await signUpWithEmail(regEmail, regPassword, regName, regPhone)
      handleSuccess()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  // Firebase 未設定
  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-[#1e3a5f]">系統提示</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Firebase 尚未設定，請聯絡管理員。
            </p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="size-4" />
                回首頁
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc]">
      <div className="w-full max-w-md space-y-6">
        {/* 回首頁 + 標題 */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1e3a5f] transition-colors"
          >
            <ArrowLeft className="size-4" />
            回首頁
          </Link>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">
            FIRE 財務自由計算器
          </h1>
          <p className="text-gray-500 text-sm">
            登入後可儲存計算紀錄，隨時查閱
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="pt-6 space-y-6">
            {/* Google 登入 */}
            <Button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-lg"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="size-5 mr-2" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              使用 Google 帳號登入
            </Button>

            {/* 分隔線 */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-sm text-gray-400">或</span>
              <Separator className="flex-1" />
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 登入 / 註冊 Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">登入</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">註冊</TabsTrigger>
              </TabsList>

              {/* 登入 */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      <Mail className="size-4" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">
                      <Lock className="size-4" />
                      密碼
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="輸入密碼"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : '登入'}
                  </Button>
                </form>
              </TabsContent>

              {/* 註冊 */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">
                      <User className="size-4" />
                      姓名
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      placeholder="您的姓名"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">
                      <Phone className="size-4" />
                      電話
                    </Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="0912-345-678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">
                      <Mail className="size-4" />
                      Email
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">
                      <Lock className="size-4" />
                      密碼
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="至少 6 個字元"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : '註冊'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          登入即表示您同意我們的服務條款與隱私政策
        </p>
      </div>
    </div>
  )
}
