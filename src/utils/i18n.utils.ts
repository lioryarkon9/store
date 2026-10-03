import { DICTIONARIES } from "@/constants/i18n.constants"
import type { TLocale, TTranslationKey, TTranslationParams } from "@/types/i18n.types"

function resolve(node: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    return typeof current === "object" && current !== null
      ? (current as Record<string, unknown>)[part]
      : undefined
  }, node)
}

// translate("en", "products.pagination.page", { page: 3 }) -> "Page 3"
// A missing key returns the key itself, so a gap is visible instead of blank.
export function translate(locale: TLocale, key: TTranslationKey, params?: TTranslationParams): string {
  const template = resolve(DICTIONARIES[locale], key)
  if (typeof template !== "string") return key

  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    params && Object.hasOwn(params, name) ? String(params[name]) : placeholder
  )
}

// ["Size", "Color", "Finish"] -> "Size, Color, and Finish"
export function formatList(locale: TLocale, items: string[]): string {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items)
}
