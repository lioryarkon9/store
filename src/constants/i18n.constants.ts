import { en } from "@/constants/en.dictionary"
import type { TDictionary, TLocale } from "@/types/i18n.types"

export const DEFAULT_LOCALE: TLocale = "en"

export const DICTIONARIES: Record<TLocale, TDictionary> = {
  en,
}
