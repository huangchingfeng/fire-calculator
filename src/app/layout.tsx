import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FIRE 財務自由計算器 | 3 分鐘算出你的財務自由路徑',
  description:
    '專為台灣業務人員設計的客戶溝通工具，整合勞保勞退試算、資產成長投影、退休缺口分析，3 分鐘產出專業 PDF 報告。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
