import { TAIWAN_CONSTANTS } from '@/constants/taiwan'

/**
 * 計算勞退新制帳戶餘額與月退休金
 *
 * 每月提撥 = 月薪 × (雇主 6% + 自提%)
 * 帳戶以複利成長
 * 月退金 = 帳戶餘額 / (平均餘命 24 年 × 12 個月)
 *
 * @param monthlySalary 月薪
 * @param employerRate 雇主提撥比例（預設 6%）
 * @param voluntaryRate 自願提撥比例（0~6%）
 * @param currentBalance 目前勞退帳戶餘額
 * @param yearsToRetire 距離退休的年數
 * @param annualReturn 勞退基金年化報酬率
 * @returns 退休時帳戶餘額和月退金
 */
export function calculateLaborPension(
  monthlySalary: number,
  employerRate: number = TAIWAN_CONSTANTS.laborPension.employerRate,
  voluntaryRate: number = 0,
  currentBalance: number = 0,
  yearsToRetire: number = 0,
  annualReturn: number = TAIWAN_CONSTANTS.laborPension.guaranteedMinReturn
): { balance: number; monthlyPension: number } {
  // 自提不超過上限
  const cappedVoluntary = Math.min(voluntaryRate, TAIWAN_CONSTANTS.laborPension.maxVoluntaryRate)

  // 每月提撥金額
  const monthlyContribution = monthlySalary * (employerRate + cappedVoluntary)

  // 複利計算帳戶餘額
  const monthlyRate = annualReturn / 12
  const months = yearsToRetire * 12

  let balance: number
  if (monthlyRate === 0) {
    balance = currentBalance + monthlyContribution * months
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, months)
    balance = currentBalance * compoundFactor + monthlyContribution * ((compoundFactor - 1) / monthlyRate)
  }

  // 月退金 = 帳戶餘額 / (平均餘命年數 × 12)
  const totalMonths = TAIWAN_CONSTANTS.laborPension.averageLifeExpectancy * 12
  const monthlyPension = Math.round(balance / totalMonths)

  return {
    balance: Math.round(balance),
    monthlyPension,
  }
}
