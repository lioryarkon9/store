import type {
  TCheckoutFieldConfig,
  TCheckoutFieldName,
  TCheckoutValues,
} from "@/types/checkout.types"
import type { TTranslationKey } from "@/types/i18n.types"

export const CHECKOUT_FIELDS: TCheckoutFieldConfig[] = [
  { name: "fullName", labelKey: "checkout.fields.fullName", type: "text", autoComplete: "name" },
  { name: "email", labelKey: "checkout.fields.email", type: "email", autoComplete: "email" },
  { name: "phone", labelKey: "checkout.fields.phone", type: "tel", autoComplete: "tel" },
  { name: "address", labelKey: "checkout.fields.address", type: "text", autoComplete: "street-address" },
  { name: "city", labelKey: "checkout.fields.city", type: "text", autoComplete: "address-level2" },
  { name: "postalCode", labelKey: "checkout.fields.postalCode", type: "text", autoComplete: "postal-code" },
  { name: "country", labelKey: "checkout.fields.country", type: "text", autoComplete: "country-name" },
]

export const EMPTY_CHECKOUT_VALUES: TCheckoutValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
}

export const CHECKOUT_ERROR_KEYS = {
  required: "checkout.errors.required",
  fullName: "checkout.errors.fullName",
  email: "checkout.errors.email",
  phone: "checkout.errors.phone",
  address: "checkout.errors.address",
  city: "checkout.errors.city",
  postalCode: "checkout.errors.postalCode",
  country: "checkout.errors.country",
} as const satisfies Record<"required" | TCheckoutFieldName, TTranslationKey>
