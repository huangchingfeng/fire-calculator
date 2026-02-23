import { TAIWAN_CONSTANTS } from '@/constants/taiwan'

/**
 * 計算勞保老年年金月領金額
 *
 * 公式：平均月投保薪資 × 年資 × 1.558%
 * - 65 歲為標準請領年齡
 * - 提前請領：每提前 1 年減給 4%，最多提前 5 年
 * - 延後請領：每延後 1 年增給 4%，最多延後 5 年
 *
 * @param avgInsuredSalary 加保期間最高 60 個月平均投保薪資
 * @param yearsOfService 勞保投保年資
 * @param claimAge 實際請領年齡
 * @returns 每月可領金額
 */
export function calculateLaborInsurancePension(
  avgInsuredSalary: number,
  yearsOfService: number,
  claimAge: number
): number {
  const { minClaimAge, earlyClaimReduction, delayedClaimIncrease, maxEarlyYears, maxDelayYears, replacementRate, maxInsuredSalary } =
    TAIWAN_CONSTANTS.laborInsurance

  // 投保薪資不得超過上限
  const salary = Math.min(avgInsuredSalary, maxInsuredSalary)

  // 基本年金 = 平均投保薪資 × 年資 × 1.558%
  const basePension = salary * yearsOfService * replacementRate

  // 計算提前/延後調整
  const ageDiff = claimAge - minClaimAge

  if (ageDiff < 0) {
    // 提前請領，最多提前 5 年
    const earlyYears = Math.min(Math.abs(ageDiff), maxEarlyYears)
    const reduction = earlyYears * earlyClaimReduction
    return Math.round(basePension * (1 - reduction))
  } else if (ageDiff > 0) {
    // 延後請領，最多加給 5 年
    const delayYears = Math.min(ageDiff, maxDelayYears)
    const increase = delayYears * delayedClaimIncrease
    return Math.round(basePension * (1 + increase))
  }

  return Math.round(basePension)
}
