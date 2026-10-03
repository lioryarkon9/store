import type { TCurrencyCode } from "@/types/common.types"

export const DEFAULT_CURRENCY: TCurrencyCode = "ILS"

export const CURRENCY_SYMBOLS: Record<TCurrencyCode, string> = {
  ILS: "₪",
  USD: "$",
  EUR: "€",
}

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_SYMBOLS) as TCurrencyCode[]
