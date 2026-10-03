import type { TTranslationKey } from "@/types/i18n.types"

export type TCheckoutFieldName =
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "postalCode"
  | "country"

export type TCheckoutValues = Record<TCheckoutFieldName, string>

export type TCheckoutErrors = Partial<Record<TCheckoutFieldName, TTranslationKey>>

export type TCheckoutFieldConfig = {
  name: TCheckoutFieldName
  labelKey: TTranslationKey
  type: "text" | "email" | "tel"
  autoComplete: string
}
