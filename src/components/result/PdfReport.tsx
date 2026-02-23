'use client'

import type { FireResult, FireInput } from '@/types/fire'
import { formatCurrencyFull, formatPercent, formatAge } from '@/lib/format'

/**
 * 使用 window.print() 來產生 PDF 報告
 * 建立一個新視窗渲染報告 HTML，然後觸發列印
 */
export function generatePdfReport(result: FireResult, input: FireInput) {
  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const hasGap = result.monthlyGap > 0

  const suggestions: string[] = []
  if (result.savingRate < 0.3) {
    suggestions.push(
      `提高儲蓄率：目前 ${formatPercent(result.savingRate)}，建議至少提高到 30%`
    )
  }
  if (input.income.voluntaryPensionRate < 0.06) {
    suggestions.push('將勞退自提提高到 6%，享受所得稅扣除優惠')
  }
  if (hasGap) {
    suggestions.push(
      `每月缺口 ${formatCurrencyFull(result.monthlyGap)}，建議透過定期定額投資補足`
    )
  }
  if (suggestions.length === 0) {
    suggestions.push('財務狀況良好，持續保持目前的儲蓄與投資計畫')
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>FIRE 財務自由規劃報告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1e3a5f;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 24px; text-align: center; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 32px; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .kpi-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .kpi-label { font-size: 13px; color: #6b7280; margin-bottom: 4px; }
    .kpi-value { font-size: 22px; font-weight: 700; font-family: monospace; }
    .kpi-note { font-size: 11px; color: #9ca3af; margin-top: 4px; }
    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      border-bottom: 2px solid #1e3a5f;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
    }
    .detail-label { color: #6b7280; }
    .detail-value { font-weight: 600; font-family: monospace; }
    .suggestion {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
    }
    .gap { color: #ef4444; }
    .ok { color: #10b981; }
    .footer {
      text-align: center;
      color: #9ca3af;
      font-size: 11px;
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>FIRE 財務自由規劃報告</h1>
  <div class="subtitle">${today}</div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">FIRE 數字（目標資產）</div>
      <div class="kpi-value">${formatCurrencyFull(result.fireNumber)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">預計達標年齡</div>
      <div class="kpi-value">${formatAge(result.fireAge)}</div>
      <div class="kpi-note">還需 ${result.yearsToFire === Infinity ? '---' : Math.round(result.yearsToFire)} 年</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">退休月缺口</div>
      <div class="kpi-value ${hasGap ? 'gap' : 'ok'}">
        ${hasGap ? formatCurrencyFull(result.monthlyGap) + '/月' : '無缺口 ✓'}
      </div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">目前儲蓄率</div>
      <div class="kpi-value">${formatPercent(result.savingRate)}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">收入分析</div>
    <div class="detail-row">
      <span class="detail-label">每月可投資金額</span>
      <span class="detail-value">${formatCurrencyFull(result.monthlyInvestable)}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">目前淨資產</span>
      <span class="detail-value">${formatCurrencyFull(result.currentNetAssets)}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">退休收入組成（月）</div>
    <div class="detail-row">
      <span class="detail-label">勞保年金</span>
      <span class="detail-value">${formatCurrencyFull(Math.round(result.pension.laborInsuranceMonthly))}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">勞退月領</span>
      <span class="detail-value">${formatCurrencyFull(Math.round(result.pension.laborPensionMonthly))}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">退休後年支出（通膨調整後）</span>
      <span class="detail-value">${formatCurrencyFull(result.adjustedAnnualExpense)}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">建議行動</div>
    ${suggestions.map((s) => `<div class="suggestion">${s}</div>`).join('')}
  </div>

  <div class="footer">
    本報告由 FIRE 財務自由規劃系統產出 | 僅供參考，不構成投資建議
  </div>

  <div class="no-print" style="text-align:center;margin-top:24px;">
    <button onclick="window.print()" style="padding:12px 32px;font-size:16px;background:#1e3a5f;color:white;border:none;border-radius:8px;cursor:pointer;">
      列印 / 存為 PDF
    </button>
  </div>
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}
