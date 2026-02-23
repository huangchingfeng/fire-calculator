# FIRE 財務自由計算器
讓台灣業務人員 3 分鐘算出客戶的財務自由路徑，提升專業形象與成交率。

## 技術棧
- Framework: Next.js 14 + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Charts: Recharts
- DB: Supabase
- Auth: Supabase Auth
- PDF: @react-pdf/renderer
- AI: Gemini API
- Deploy: Vercel

## 開發指令
```bash
npm run dev    # 開發
npm run build  # 建置
npm run test   # 測試
```

## 部署
- Platform: Vercel
- URL: TBD

## 注意事項
- 台灣財務常數（勞保/勞退/稅率）需使用 2026 年度最新數據
- 計算公式必須有單元測試，並與勞保局試算器交叉驗證
- API Key 必須放 `.env.local`，不可硬編碼
- 客戶資料需注意隱私保護（個資法）
