/** FIRE 計算器輸入 - 收入區塊 */
export interface IncomeInput {
  /** 月薪（稅前） */
  monthlySalary: number
  /** 年終獎金（幾個月） */
  bonusMonths: number
  /** 其他月收入 */
  otherMonthlyIncome: number
  /** 配偶月收入 */
  spouseMonthlyIncome: number
  /** 勞保投保年資 */
  laborInsuranceYears: number
  /** 勞退自提比例 (0-0.06) */
  voluntaryPensionRate: number
}

/** FIRE 計算器輸入 - 支出區塊 */
export interface ExpenseInput {
  /** 房租或房貸月付 */
  housingCost: number
  /** 生活費（飲食+交通+日用） */
  livingCost: number
  /** 保險費（月繳） */
  insuranceCost: number
  /** 孝親費 */
  parentalSupport: number
  /** 教育費 */
  educationCost: number
  /** 其他固定支出 */
  otherFixedCost: number
  /** 年度大額支出 */
  annualLargeExpense: number
}

/** FIRE 計算器輸入 - 資產區塊 */
export interface AssetInput {
  /** 銀行存款 */
  savings: number
  /** 投資部位（股票+基金+ETF） */
  investments: number
  /** 儲蓄險 */
  insuranceSavings: number
  /** 其他資產 */
  otherAssets: number
  /** 負債總額 */
  totalDebt: number
}

/** FIRE 計算器輸入 - 目標設定 */
export interface GoalInput {
  /** 目前年齡 */
  currentAge: number
  /** 期望退休年齡 */
  targetRetireAge: number
  /** 退休後每月生活費 */
  retirementMonthlyExpense: number
  /** 投資風險屬性：conservative(4%) / moderate(7%) / aggressive(10%) */
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
}

/** FIRE 計算器完整輸入 */
export interface FireInput {
  income: IncomeInput
  expense: ExpenseInput
  asset: AssetInput
  goal: GoalInput
}

/** 年度資產投影 */
export interface YearlyProjection {
  /** 年齡 */
  age: number
  /** 該年度資產總額 */
  totalAssets: number
  /** 保守情境資產 */
  conservativeAssets: number
  /** 穩健情境資產 */
  moderateAssets: number
  /** 積極情境資產 */
  aggressiveAssets: number
}

/** 勞保勞退計算結果 */
export interface PensionResult {
  /** 勞保年金月領 */
  laborInsuranceMonthly: number
  /** 勞退月領估算 */
  laborPensionMonthly: number
  /** 退休時勞退帳戶餘額 */
  laborPensionBalance: number
  /** 年金合計月領 */
  totalPensionMonthly: number
}

/** FIRE 計算結果 */
export interface FireResult {
  /** FIRE 數字（需要累積的總資產） */
  fireNumber: number
  /** 預計達標年齡 */
  fireAge: number
  /** 距離達標還要幾年 */
  yearsToFire: number
  /** 目前儲蓄率 */
  savingRate: number
  /** 每月可投資金額 */
  monthlyInvestable: number
  /** 目前淨資產 */
  currentNetAssets: number
  /** 退休後每月缺口（正數=有缺口，負數=有剩餘） */
  monthlyGap: number
  /** 年度資產投影（用於圖表） */
  yearlyProjections: YearlyProjection[]
  /** 退休收入組成 */
  pension: PensionResult
  /** 退休後年支出（通膨調整後） */
  adjustedAnnualExpense: number
  /** FIRE 達標機率估算 (0-1) */
  successRate: number
}

/** 情境比較 */
export interface ScenarioComparison {
  /** 情境名稱 */
  name: string
  /** 調整描述 */
  description: string
  /** 計算結果 */
  result: FireResult
}

/** 投資風險對應報酬率 */
export const RISK_RETURN_MAP = {
  conservative: 0.04,
  moderate: 0.07,
  aggressive: 0.10,
} as const
