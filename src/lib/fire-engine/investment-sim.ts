import type { FireInput, FireResult } from '@/types/fire'
import { RISK_RETURN_MAP } from '@/types/fire'
import { calculateFireFromRate } from './index'

/**
 * 模擬三種投資風險情境
 * - 保守 (4%)：以債券+定存為主
 * - 穩健 (7%)：股債混合配置
 * - 積極 (10%)：以股票+ETF為主
 *
 * @param input FIRE 計算完整輸入
 * @returns 三種情境的計算結果
 */
export function simulateScenarios(input: FireInput): {
  conservative: FireResult
  moderate: FireResult
  aggressive: FireResult
} {
  return {
    conservative: calculateFireFromRate(input, RISK_RETURN_MAP.conservative),
    moderate: calculateFireFromRate(input, RISK_RETURN_MAP.moderate),
    aggressive: calculateFireFromRate(input, RISK_RETURN_MAP.aggressive),
  }
}
