import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES } from "@/constants/currency.constants"
import type { TCurrencyCode } from "@/types/common.types"

export function isSupportedCurrency(code: string): code is TCurrencyCode {
  return (SUPPORTED_CURRENCIES as string[]).includes(code)
}

// An unsupported code is shown as-is ("GBP 10.00") rather than with a guessed symbol.
export function getCurrencySymbol(code: string): string {
  return isSupportedCurrency(code) ? CURRENCY_SYMBOLS[code] : `${code} `
}
