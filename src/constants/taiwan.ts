/** 台灣 2026 年度財務常數 */
export const TAIWAN_CONSTANTS = {
  /** 勞工保險 */
  laborInsurance: {
    /** 最高月投保薪資 */
    maxInsuredSalary: 45800,
    /** 普通事故保險費率 */
    rate: 0.12,
    /** 勞工自付比例 */
    workerShare: 0.2,
    /** 年金給付每年所得替代率 */
    replacementRate: 0.01558,
    /** 最低請領年齡 */
    minClaimAge: 65,
    /** 提前請領每年減額比例 */
    earlyClaimReduction: 0.04,
    /** 延後請領每年增額比例 */
    delayedClaimIncrease: 0.04,
    /** 最多提前年數 */
    maxEarlyYears: 5,
    /** 最多延後年數 */
    maxDelayYears: 5,
  },

  /** 勞工退休金（新制） */
  laborPension: {
    /** 雇主提撥比例 */
    employerRate: 0.06,
    /** 自願提撥上限 */
    maxVoluntaryRate: 0.06,
    /** 保證最低收益率（2年期定存利率） */
    guaranteedMinReturn: 0.0185,
    /** 月退休金計算基礎：平均餘命 24 年 */
    averageLifeExpectancy: 24,
  },

  /** 全民健康保險 */
  healthInsurance: {
    /** 退休後以地區人口投保（區公所），第六類 */
    retiredMonthlyPremium: 826,
    /** 二代健保補充保費率 */
    supplementaryRate: 0.0211,
  },

  /** 綜合所得稅（2026年度） */
  incomeTax: {
    /** 稅率級距 */
    brackets: [
      { min: 0, max: 590000, rate: 0.05 },
      { min: 590001, max: 1330000, rate: 0.12 },
      { min: 1330001, max: 2660000, rate: 0.20 },
      { min: 2660001, max: 4980000, rate: 0.30 },
      { min: 4980001, max: Infinity, rate: 0.40 },
    ],
    /** 免稅額 */
    exemption: 97000,
    /** 標準扣除額（單身） */
    standardDeduction: 131000,
    /** 標準扣除額（夫妻合報） */
    standardDeductionMarried: 262000,
    /** 薪資所得特別扣除額 */
    salaryDeduction: 220000,
  },

  /** 通膨假設 */
  inflation: {
    /** 台灣近 20 年平均 CPI */
    average: 0.02,
    /** 保守估計 */
    conservative: 0.025,
    /** 悲觀估計 */
    pessimistic: 0.03,
  },

  /** 基本工資（2026年） */
  minimumWage: {
    monthly: 27470,
    hourly: 190,
  },
} as const

export type TaiwanConstants = typeof TAIWAN_CONSTANTS
