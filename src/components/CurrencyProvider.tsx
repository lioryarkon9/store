"use client"

import { createContext, useMemo, useState } from "react"
import { DEFAULT_CURRENCY } from "@/constants/currency.constants"
import type { TCurrencyCode, TCurrencyContextValue } from "@/types/common.types"

export const CurrencyContext = createContext<TCurrencyContextValue | null>(null)

type TProps = { children: React.ReactNode }

export function CurrencyProvider({ children }: TProps) {
  const [currency, setCurrency] = useState<TCurrencyCode>(DEFAULT_CURRENCY)
  const value = useMemo(() => ({ currency, setCurrency }), [currency])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
