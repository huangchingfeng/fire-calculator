import type { YearlyProjection } from '@/types/fire'
import { RISK_RETURN_MAP } from '@/types/fire'

/**
 * 計算 FIRE 數字（財務自由所需總資產）
 * 依據 4% 法則：年支出 × 25 = FIRE 數字
 * @param annualExpense 退休後年支出
 * @returns FIRE 數字
 */
export function calculateFireNumber(annualExpense: number): number {
  return annualExpense * 25
}

/**
 * 計算儲蓄率
 * @param annualIncome 年收入
 * @param annualExpense 年支出
 * @returns 儲蓄率 (0~1)
 */
export function calculateSavingRate(annualIncome: number, annualExpense: number): number {
  if (annualIncome <= 0) return 0
  const rate = (annualIncome - annualExpense) / annualIncome
  return Math.max(0, Math.min(1, rate))
}

/**
 * 計算複利終值（含定期定額）
 * FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 * 其中 r 為月報酬率，n 為月數
 * @param principal 初始本金
 * @param monthlyAdd 每月定期投入
 * @param annualRate 年化報酬率
 * @param years 投資年數
 * @returns 終值
 */
export function calculateCompoundGrowth(
  principal: number,
  monthlyAdd: number,
  annualRate: number,
  years: number
): number {
  if (years <= 0) return principal
  const monthlyRate = annualRate / 12
  const months = years * 12

  if (monthlyRate === 0) {
    return principal + monthlyAdd * months
  }

  const compoundFactor = Math.pow(1 + monthlyRate, months)
  const principalGrowth = principal * compoundFactor
  const annuityGrowth = monthlyAdd * ((compoundFactor - 1) / monthlyRate)
  return principalGrowth + annuityGrowth
}

/**
 * 計算達到 FIRE 數字需要的年數
 * 反推複利公式：找出 n 使得 FV(n) >= fireNumber
 * @param currentAssets 目前淨資產
 * @param monthlyInvestment 每月可投資金額
 * @param annualReturn 年化報酬率
 * @param fireNumber 目標 FIRE 數字
 * @returns 達標年數（最多 100 年，避免無限迴圈）
 */
export function calculateYearsToFire(
  currentAssets: number,
  monthlyInvestment: number,
  annualReturn: number,
  fireNumber: number
): number {
  // 已經達標
  if (currentAssets >= fireNumber) return 0

  // 沒有投入且沒有報酬，永遠達不到
  if (monthlyInvestment <= 0 && annualReturn <= 0) return Infinity

  // 用二分搜尋法找出年數（精確到 0.1 年）
  let low = 0
  let high = 100

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2
    const fv = calculateCompoundGrowth(currentAssets, monthlyInvestment, annualReturn, mid)
    if (fv >= fireNumber) {
      high = mid
    } else {
      low = mid
    }
  }

  // 如果 100 年還達不到
  const fv100 = calculateCompoundGrowth(currentAssets, monthlyInvestment, annualReturn, 100)
  if (fv100 < fireNumber) return Infinity

  return Math.ceil(high * 10) / 10
}

/**
 * 產出逐年資產投影（三種風險情境）
 * @param currentAssets 目前淨資產
 * @param monthlyInvestment 每月可投資金額
 * @param annualReturn 選定的年化報酬率（穩健情境）
 * @param currentAge 目前年齡
 * @param maxAge 投影到幾歲（預設 80）
 * @returns 逐年投影陣列
 */
export function projectAssetGrowth(
  currentAssets: number,
  monthlyInvestment: number,
  annualReturn: number,
  currentAge: number,
  maxAge: number = 80
): YearlyProjection[] {
  const projections: YearlyProjection[] = []

  for (let age = currentAge; age <= maxAge; age++) {
    const yearsFromNow = age - currentAge
    projections.push({
      age,
      totalAssets: calculateCompoundGrowth(currentAssets, monthlyInvestment, annualReturn, yearsFromNow),
      conservativeAssets: calculateCompoundGrowth(currentAssets, monthlyInvestment, RISK_RETURN_MAP.conservative, yearsFromNow),
      moderateAssets: calculateCompoundGrowth(currentAssets, monthlyInvestment, RISK_RETURN_MAP.moderate, yearsFromNow),
      aggressiveAssets: calculateCompoundGrowth(currentAssets, monthlyInvestment, RISK_RETURN_MAP.aggressive, yearsFromNow),
    })
  }

  return projections
}
