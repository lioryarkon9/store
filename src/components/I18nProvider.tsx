"use client"

import { createContext, useMemo, useState } from "react"
import { DEFAULT_LOCALE } from "@/constants/i18n.constants"
import { translate } from "@/utils/i18n.utils"
import type { TI18nContextValue, TLocale } from "@/types/i18n.types"

export const I18nContext = createContext<TI18nContextValue | null>(null)

type TProps = { children: React.ReactNode }

export function I18nProvider({ children }: TProps) {
  const [locale, setLocale] = useState<TLocale>(DEFAULT_LOCALE)

  const value = useMemo<TI18nContextValue>(
    () => ({ locale, setLocale, t: (key, params) => translate(locale, key, params) }),
    [locale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
