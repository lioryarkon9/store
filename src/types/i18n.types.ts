import type { en } from "@/constants/en.dictionary"

export type TLocale = "en"

// `en` is `as const`; widening lets other locales translate the text without allowing different keys.
type TWiden<T> = T extends string ? string : { [K in keyof T]: TWiden<T[K]> }
export type TDictionary = TWiden<typeof en>

type TPaths<T> = T extends string
  ? never
  : { [K in keyof T & string]: T[K] extends string ? K : `${K}.${TPaths<T[K]>}` }[keyof T & string]
export type TTranslationKey = TPaths<TDictionary>

export type TTranslationParams = Record<string, string | number>

export type TTranslateFn = (key: TTranslationKey, params?: TTranslationParams) => string

export type TI18nContextValue = {
  locale: TLocale
  setLocale: (locale: TLocale) => void
  t: TTranslateFn
}
