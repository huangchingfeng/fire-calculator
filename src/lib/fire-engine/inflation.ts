import { TAIWAN_CONSTANTS } from '@/constants/taiwan'

/**
 * 計算通膨調整後的金額（未來需要多少錢才等於現在的購買力）
 * 公式：futureAmount = currentAmount × (1 + inflationRate)^years
 *
 * @param amount 現在的金額
 * @param years 年數
 * @param rate 通膨率（預設台灣近 20 年平均 2%）
 * @returns 通膨調整後的金額
 */
export function adjustForInflation(
  amount: number,
  years: number,
  rate: number = TAIWAN_CONSTANTS.inflation.average
): number {
  if (years <= 0) return amount
  return Math.round(amount * Math.pow(1 + rate, years))
}

/**
 * 計算未來值（等同 adjustForInflation，語義更直覺）
 * @param currentAmount 現在的金額
 * @param years 年數
 * @param inflationRate 通膨率
 * @returns 未來需要的金額
 */
export function futureValue(
  currentAmount: number,
  years: number,
  inflationRate: number = TAIWAN_CONSTANTS.inflation.average
): number {
  return adjustForInflation(currentAmount, years, inflationRate)
}
