import type { FireInput, FireResult, PensionResult } from '@/types/fire'
import { RISK_RETURN_MAP } from '@/types/fire'
import {
  calculateFireNumber,
  calculateSavingRate,
  calculateYearsToFire,
  calculateCompoundGrowth,
  projectAssetGrowth,
} from './core'
import { calculateLaborInsurancePension } from './labor-insurance'
import { calculateLaborPension } from './labor-pension'
import { adjustForInflation } from './inflation'
import { analyzeRetirementGap } from './gap-analysis'

/**
 * 以指定報酬率計算 FIRE 結果（供情境模擬使用）
 * @param input FIRE 完整輸入
 * @param annualReturn 指定的年化報酬率
 * @returns FIRE 計算結果
 */
export function calculateFireFromRate(input: FireInput, annualReturn: number): FireResult {
  const { income, expense, asset, goal } = input

  // 1. 計算年收入
  const annualSalary = income.monthlySalary * 12
  const bonus = income.monthlySalary * income.bonusMonths
  const otherAnnual = income.otherMonthlyIncome * 12
  const spouseAnnual = income.spouseMonthlyIncome * 12
  const annualIncome = annualSalary + bonus + otherAnnual + spouseAnnual

  // 2. 計算年支出
  const monthlyExpenseTotal =
    expense.housingCost +
    expense.livingCost +
    expense.insuranceCost +
    expense.parentalSupport +
    expense.educationCost +
    expense.otherFixedCost
  const annualExpense = monthlyExpenseTotal * 12 + expense.annualLargeExpense

  // 3. 計算淨資產
  const currentNetAssets =
    asset.savings + asset.investments + asset.insuranceSavings + asset.otherAssets - asset.totalDebt

  // 4. 計算儲蓄率
  const savingRate = calculateSavingRate(annualIncome, annualExpense)

  // 5. 每月可投資金額
  const monthlyInvestable = Math.max(0, (annualIncome - annualExpense) / 12)

  // 6. 退休後年支出（通膨調整）
  const yearsUntilRetire = Math.max(0, goal.targetRetireAge - goal.currentAge)
  const adjustedAnnualExpense = adjustForInflation(
    goal.retirementMonthlyExpense * 12,
    yearsUntilRetire
  )

  // 7. FIRE 數字
  const fireNumber = calculateFireNumber(adjustedAnnualExpense)

  // 8. 勞保年金（以退休年齡請領）
  const laborInsuranceMonthly = calculateLaborInsurancePension(
    income.monthlySalary,
    income.laborInsuranceYears,
    goal.targetRetireAge
  )

  // 9. 勞退月領
  const laborPensionResult = calculateLaborPension(
    income.monthlySalary,
    0.06,
    income.voluntaryPensionRate,
    0,
    yearsUntilRetire,
    annualReturn
  )

  // 10. 退休時資產（用選定報酬率）
  const retirementAssets = calculateCompoundGrowth(
    currentNetAssets,
    monthlyInvestable,
    annualReturn,
    yearsUntilRetire
  )

  // 投資被動收入（4% 法則）
  const monthlyInvestmentIncome = Math.round((retirementAssets * 0.04) / 12)

  // 退休缺口分析
  const gap = analyzeRetirementGap(
    adjustedAnnualExpense / 12,
    laborInsuranceMonthly,
    laborPensionResult.monthlyPension,
    monthlyInvestmentIncome
  )

  // 11. 計算達標年數
  const yearsToFire = calculateYearsToFire(
    currentNetAssets,
    monthlyInvestable,
    annualReturn,
    fireNumber
  )

  const fireAge = yearsToFire === Infinity
    ? Infinity
    : Math.ceil(goal.currentAge + yearsToFire)

  // 12. 逐年投影（到 80 歲）
  const yearlyProjections = projectAssetGrowth(
    currentNetAssets,
    monthlyInvestable,
    annualReturn,
    goal.currentAge,
    80
  )

  // 13. 成功率估算
  const pension: PensionResult = {
    laborInsuranceMonthly,
    laborPensionMonthly: laborPensionResult.monthlyPension,
    laborPensionBalance: laborPensionResult.balance,
    totalPensionMonthly: laborInsuranceMonthly + laborPensionResult.monthlyPension,
  }

  const successRate = estimateSuccessRate(
    currentNetAssets,
    monthlyInvestable,
    fireNumber,
    yearsUntilRetire,
    annualReturn
  )

  return {
    fireNumber: Math.round(fireNumber),
    fireAge,
    yearsToFire: yearsToFire === Infinity ? Infinity : Math.round(yearsToFire * 10) / 10,
    savingRate: Math.round(savingRate * 10000) / 10000,
    monthlyInvestable: Math.round(monthlyInvestable),
    currentNetAssets: Math.round(currentNetAssets),
    monthlyGap: gap.monthlyGap,
    yearlyProjections,
    pension,
    adjustedAnnualExpense: Math.round(adjustedAnnualExpense),
    successRate,
  }
}

/**
 * FIRE 計算器主函數 — 一個函數搞定全部計算
 *
 * 內部流程：
 * 1. 計算年收入（月薪×12 + 年終 + 其他×12 + 配偶×12）
 * 2. 計算年支出（各月支出×12 + 年度大額支出）
 * 3. 計算淨資產（存款 + 投資 + 儲蓄險 + 其他 - 負債）
 * 4. 計算儲蓄率
 * 5. 計算每月可投資
 * 6. 通膨調整退休支出
 * 7. 計算 FIRE 數字（調整後年支出 × 25）
 * 8. 計算勞保年金
 * 9. 計算勞退月領
 * 10. 計算退休缺口
 * 11. 計算達標年數
 * 12. 產出逐年投影
 * 13. 估算成功率
 *
 * @param input FIRE 計算完整輸入
 * @returns FIRE 計算完整結果
 */
export function calculateFire(input: FireInput): FireResult {
  const annualReturn = RISK_RETURN_MAP[input.goal.riskProfile]
  return calculateFireFromRate(input, annualReturn)
}

/**
 * 估算 FIRE 達標成功率
 * 基於儲蓄率、報酬率、達標年數的綜合評估
 *
 * @param currentAssets 目前淨資產
 * @param monthlyInvestable 每月可投資金額
 * @param fireNumber FIRE 數字
 * @param yearsUntilRetire 距離退休年數
 * @param annualReturn 年化報酬率
 * @returns 成功率 (0~1)
 */
function estimateSuccessRate(
  currentAssets: number,
  monthlyInvestable: number,
  fireNumber: number,
  yearsUntilRetire: number,
  annualReturn: number
): number {
  if (fireNumber <= 0) return 1

  // 用選定報酬率計算退休時資產
  const projectedAssets = calculateCompoundGrowth(
    currentAssets,
    monthlyInvestable,
    annualReturn,
    yearsUntilRetire
  )

  // 達成比例
  const ratio = projectedAssets / fireNumber

  if (ratio >= 1.5) return 0.95
  if (ratio >= 1.2) return 0.85
  if (ratio >= 1.0) return 0.75
  if (ratio >= 0.8) return 0.55
  if (ratio >= 0.6) return 0.35
  if (ratio >= 0.4) return 0.2
  return 0.1
}

// 重新匯出所有子模組，方便單獨使用
export { calculateFireNumber, calculateSavingRate, calculateYearsToFire, calculateCompoundGrowth, projectAssetGrowth } from './core'
export { calculateLaborInsurancePension } from './labor-insurance'
export { calculateLaborPension } from './labor-pension'
export { calculateIncomeTax } from './income-tax'
export { adjustForInflation, futureValue } from './inflation'
export { analyzeRetirementGap } from './gap-analysis'
export { simulateScenarios } from './investment-sim'
