/**
 * 分析退休後每月收支缺口
 *
 * 退休收入來源：勞保年金 + 勞退月領 + 投資被動收入
 * 缺口 = 退休月支出 - 上述收入總和
 * 正數表示有缺口（錢不夠），負數表示有餘裕
 *
 * @param monthlyExpense 退休後每月支出（通膨調整後）
 * @param pensionMonthly 勞保年金月領
 * @param laborPensionMonthly 勞退月退金
 * @param investmentIncome 投資被動收入月領（資產 × 4% / 12）
 * @returns 缺口分析結果
 */
export function analyzeRetirementGap(
  monthlyExpense: number,
  pensionMonthly: number,
  laborPensionMonthly: number,
  investmentIncome: number
): { monthlyGap: number; annualGap: number; gapPercentage: number } {
  const totalIncome = pensionMonthly + laborPensionMonthly + investmentIncome
  const monthlyGap = monthlyExpense - totalIncome
  const annualGap = monthlyGap * 12
  const gapPercentage = monthlyExpense > 0
    ? monthlyGap / monthlyExpense
    : 0

  return {
    monthlyGap: Math.round(monthlyGap),
    annualGap: Math.round(annualGap),
    gapPercentage: Math.round(gapPercentage * 10000) / 10000,
  }
}
