/**
 * 格式化貨幣顯示
 * 小於 1 億：顯示千分位（NT$ 1,500,000）
 * 大於等於 1 億：顯示「億」單位
 */
export function formatCurrency(n: number): string {
  if (n === 0) return 'NT$ 0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''

  if (abs >= 100000000) {
    const yi = abs / 100000000
    return `${sign}NT$ ${yi.toFixed(1)} 億`
  }

  if (abs >= 10000) {
    const wan = Math.round(abs / 10000)
    return `${sign}NT$ ${wan.toLocaleString('zh-TW')} 萬`
  }

  return `${sign}NT$ ${Math.round(abs).toLocaleString('zh-TW')}`
}

/**
 * 格式化貨幣（完整數字，含千分位）
 */
export function formatCurrencyFull(n: number): string {
  const sign = n < 0 ? '-' : ''
  return `${sign}NT$ ${Math.round(Math.abs(n)).toLocaleString('zh-TW')}`
}

/**
 * 格式化百分比
 */
export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

/**
 * 格式化年齡
 */
export function formatAge(n: number): string {
  if (n === Infinity) return '無法達標'
  return `${Math.round(n)} 歲`
}

/**
 * 數字輸入格式化：加入千分位
 */
export function formatNumberInput(value: number): string {
  if (value === 0) return ''
  return Math.round(value).toLocaleString('zh-TW')
}

/**
 * 解析千分位字串為數字
 */
export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[,\s]/g, '')
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? 0 : num
}
