import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, BarChart3, Briefcase } from 'lucide-react'
import type { ReactNode } from 'react'
import UserMenu from '@/components/UserMenu'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f8fafc] relative">
      {/* 用戶選單 */}
      <div className="absolute top-4 right-4">
        <UserMenu />
      </div>
      <main className="max-w-2xl w-full text-center space-y-8">
        {/* 主標題 */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] leading-tight">
            你離財務自由<br />還有幾步？
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            3 分鐘算出專屬於你的退休路徑圖
          </p>
          <p className="text-base text-gray-500">
            台灣在地化計算，整合勞保勞退，結果更貼近現實
          </p>
        </div>

        {/* CTA 按鈕 */}
        <div className="pt-4">
          <Link href="/calculator">
            <Button
              size="lg"
              className="h-14 px-12 text-lg font-semibold bg-[#10b981] hover:bg-[#059669] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              免費開始計算
            </Button>
          </Link>
        </div>

        {/* 三個特色 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <FeatureCard
            icon={<MapPin className="w-6 h-6 text-[#1e3a5f]" />}
            title="台灣在地化"
            desc="整合勞保勞退、健保、所得稅率，計算結果貼近現實"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-[#1e3a5f]" />}
            title="視覺化報告"
            desc="資產成長曲線、退休收入圓餅圖，一看就懂"
          />
          <FeatureCard
            icon={<Briefcase className="w-6 h-6 text-[#1e3a5f]" />}
            title="業務話術引導"
            desc="專業 PDF 報告，直接拿給客戶看，提升信任感"
          />
        </div>
      </main>

      {/* 底部 */}
      <footer className="mt-16 text-sm text-gray-400">
        FIRE Financial Independence, Retire Early
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-[#1e3a5f] mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  )
}
