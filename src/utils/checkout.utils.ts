import { z } from "zod"
import { CHECKOUT_ERROR_KEYS as ERRORS } from "@/constants/checkout.constants"
import type { TCheckoutErrors, TCheckoutFieldName, TCheckoutValues } from "@/types/checkout.types"
import type { TTranslationKey } from "@/types/i18n.types"

const PHONE_CHARS = /^\+?[\d\s().-]+$/
// Generic on purpose: postal code formats differ too much between countries.
const POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9\s-]{1,9}$/

const text = (min: number, invalid: TTranslationKey) =>
  z.string().min(1, ERRORS.required).min(min, invalid)

const checkoutSchema = z.object({
  fullName: text(2, ERRORS.fullName),
  email: z.string().min(1, ERRORS.required).pipe(z.email(ERRORS.email)),
  phone: z
    .string()
    .min(1, ERRORS.required)
    .regex(PHONE_CHARS, ERRORS.phone)
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length
      return digits >= 7 && digits <= 15
    }, ERRORS.phone),
  address: text(2, ERRORS.address),
  city: text(2, ERRORS.city),
  postalCode: z.string().min(1, ERRORS.required).regex(POSTAL_CODE, ERRORS.postalCode),
  country: text(2, ERRORS.country),
})

export function trimValues(values: TCheckoutValues): TCheckoutValues {
  return Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, value.trim()])
  ) as TCheckoutValues
}

// One error per field; the schema messages are dictionary keys, hence the cast.
export function getCheckoutErrors(values: TCheckoutValues): TCheckoutErrors {
  const result = checkoutSchema.safeParse(trimValues(values))
  if (result.success) return {}

  const errors: TCheckoutErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as TCheckoutFieldName
    errors[field] ??= issue.message as TTranslationKey
  }
  return errors
}
