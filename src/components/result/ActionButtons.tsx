'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, FileText, Save } from 'lucide-react'
import SaveDialog from '@/components/result/SaveDialog'
import type { FireInput, FireResult } from '@/types/fire'

interface ActionButtonsProps {
  onDownloadPdf: () => void
  input: FireInput
  result: FireResult
}

export default function ActionButtons({ onDownloadPdf, input, result }: ActionButtonsProps) {
  const router = useRouter()
  const [saveOpen, setSaveOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/calculator')}
          className="h-14 text-base rounded-xl"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          重新計算
        </Button>
        <Button
          size="lg"
          onClick={onDownloadPdf}
          className="h-14 text-base rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
        >
          <FileText className="w-5 h-5 mr-2" />
          下載 PDF
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setSaveOpen(true)}
          className="h-14 text-base rounded-xl"
        >
          <Save className="w-5 h-5 mr-2" />
          保存結果
        </Button>
      </div>
      <SaveDialog
        input={input}
        result={result}
        open={saveOpen}
        onOpenChange={setSaveOpen}
      />
    </>
  )
}
