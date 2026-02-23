import { TAIWAN_CONSTANTS } from '@/constants/taiwan'

/**
 * 計算台灣綜合所得稅
 *
 * 計算流程：
 * 1. 綜合所得淨額 = 年收入 - 免稅額 - 標準扣除額 - 薪資特別扣除額
 * 2. 依 5 級距累進稅率計算應納稅額
 *
 * @param annualIncome 年收入（稅前）
 * @param isMarried 是否夫妻合併申報（預設 false）
 * @returns 應繳稅額與有效稅率
 */
export function calculateIncomeTax(
  annualIncome: number,
  isMarried: boolean = false
): { taxAmount: number; effectiveRate: number } {
  const { exemption, standardDeduction, standardDeductionMarried, salaryDeduction, brackets } =
    TAIWAN_CONSTANTS.incomeTax

  // 計算免稅額（夫妻 × 2）
  const totalExemption = isMarried ? exemption * 2 : exemption

  // 選用標準扣除額
  const deduction = isMarried ? standardDeductionMarried : standardDeduction

  // 薪資特別扣除額（夫妻各一份）
  const totalSalaryDeduction = isMarried ? salaryDeduction * 2 : salaryDeduction

  // 綜合所得淨額
  const taxableIncome = Math.max(0, annualIncome - totalExemption - deduction - totalSalaryDeduction)

  if (taxableIncome === 0) {
    return { taxAmount: 0, effectiveRate: 0 }
  }

  // 累進稅率計算
  let taxAmount = 0
  let remaining = taxableIncome

  for (const bracket of brackets) {
    const bracketRange = bracket.max === Infinity
      ? remaining
      : bracket.max - bracket.min + 1
    const taxableInBracket = Math.min(remaining, bracketRange)

    if (taxableInBracket <= 0) break

    taxAmount += taxableInBracket * bracket.rate
    remaining -= taxableInBracket
  }

  taxAmount = Math.round(taxAmount)
  const effectiveRate = annualIncome > 0 ? taxAmount / annualIncome : 0

  return { taxAmount, effectiveRate }
}
