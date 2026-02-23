'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface ActionButtonsProps {
  onDownloadPdf: () => void
}

export default function ActionButtons({ onDownloadPdf }: ActionButtonsProps) {
  const router = useRouter()

  const handleShare = () => {
    alert('分享功能開發中，敬請期待！')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Button
        variant="outline"
        size="lg"
        onClick={() => router.push('/calculator')}
        className="h-14 text-base rounded-xl"
      >
        🔄 重新計算
      </Button>
      <Button
        size="lg"
        onClick={onDownloadPdf}
        className="h-14 text-base rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
      >
        📄 下載 PDF
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={handleShare}
        className="h-14 text-base rounded-xl"
      >
        📤 分享結果
      </Button>
    </div>
  )
}
