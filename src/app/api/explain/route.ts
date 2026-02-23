import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ExplainRequest {
  metricName: string
  metricValue: string
  context: {
    monthlySalary: number
    monthlyExpense: number
    currentAssets: number
    currentAge: number
    targetRetireAge: number
    fireNumber: number
    savingRate: number
    monthlyGap: number
  }
}

const FALLBACK_EXPLANATIONS: Record<string, string> = {
  'FIRE 目標資產':
    'FIRE 數字代表你需要累積的總資產，達到這個金額後，靠投資報酬就能支應退休生活支出。計算方式是將退休後每年支出除以安全提領率（通常為 4%），也就是 25 倍年支出。這個數字會隨通膨調整，所以越早開始累積越有利。建議定期重新檢視，因為生活型態改變會直接影響這個目標金額。',
  '預計達標年齡':
    '達標年齡是根據你目前的儲蓄速度、投資報酬率和通膨率，推算出資產累積到 FIRE 數字的時間點。如果達標年齡超過你的目標退休年齡，代表需要調整策略，例如提高儲蓄率或增加收入來源。每提高 5% 的儲蓄率，通常可以提前 2 到 5 年退休。注意這是基於穩定報酬的估算，實際市場波動可能造成偏差。',
  '退休每月缺口':
    '退休缺口是指退休後每月支出扣除勞保年金和勞退月領後，仍需要自行準備的金額。如果有缺口，代表光靠政府退休金不足以維持生活品質，需要靠個人投資來補足。建議透過定期定額投資指數型 ETF 來逐步累積。如果顯示無缺口，表示退休收入已足夠，但仍建議預留醫療和長照準備金。',
  '目前儲蓄率':
    '儲蓄率是每月儲蓄金額佔稅後收入的比例，是預測退休速度的關鍵指標。一般建議至少 20% 以上，30% 以上算優秀，50% 以上代表你走在財務自由的快車道上。提高儲蓄率有兩個方向：增加收入或降低支出。對多數人來說，先從減少非必要支出開始比較容易達成。注意不要為了衝高儲蓄率而犧牲生活品質，找到平衡點最重要。',
}

function getFallback(metricName: string): string {
  // 精確匹配
  if (FALLBACK_EXPLANATIONS[metricName]) {
    return FALLBACK_EXPLANATIONS[metricName]
  }
  // 模糊匹配
  for (const [key, value] of Object.entries(FALLBACK_EXPLANATIONS)) {
    if (metricName.includes(key) || key.includes(metricName)) {
      return value
    }
  }
  // 建議類的通用 fallback
  return '這項指標反映了你目前的財務狀況。建議定期追蹤變化，並搭配具體的儲蓄和投資計畫，逐步朝財務自由邁進。如果有疑問，建議諮詢專業的理財顧問，取得更個人化的建議。'
}

export async function POST(request: NextRequest) {
  try {
    const body: ExplainRequest = await request.json()
    const { metricName, metricValue, context } = body

    const apiKey = process.env.GEMINI_API_KEY

    // 無 API Key 時回傳靜態 fallback
    if (!apiKey) {
      return NextResponse.json({
        explanation: getFallback(metricName),
        source: 'fallback',
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `你是一位資深理財顧問，說話專業但親切，使用繁體中文（台灣用語）。
不要使用 emoji 或 markdown 格式。

用戶剛計算了 FIRE 財務自由規劃：
- 指標名稱：${metricName}
- 指標數值：${metricValue}
- 月薪：NT$ ${context.monthlySalary.toLocaleString()}
- 月支出：NT$ ${context.monthlyExpense.toLocaleString()}
- 目前淨資產：NT$ ${context.currentAssets.toLocaleString()}
- 目前年齡：${context.currentAge} 歲
- 目標退休年齡：${context.targetRetireAge} 歲
- FIRE 數字：NT$ ${context.fireNumber.toLocaleString()}
- 儲蓄率：${(context.savingRate * 100).toFixed(1)}%
- 退休月缺口：NT$ ${context.monthlyGap.toLocaleString()}

請用 200 字以內，分三段回答：
第一段：這個數字代表什麼意思
第二段：這個數字對用戶的財務狀況代表什麼
第三段：需要特別注意的事項或風險`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({
      explanation: text,
      source: 'gemini',
    })
  } catch (error) {
    console.error('Gemini API error:', error)

    // API 呼叫失敗時也回傳 fallback
    try {
      const body = await request.clone().json()
      return NextResponse.json({
        explanation: getFallback(body.metricName || ''),
        source: 'fallback',
      })
    } catch {
      return NextResponse.json({
        explanation: getFallback(''),
        source: 'fallback',
      })
    }
  }
}
