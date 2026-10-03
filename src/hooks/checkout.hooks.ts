import { useMemo, useState } from "react"
import { CHECKOUT_FIELDS, EMPTY_CHECKOUT_VALUES } from "@/constants/checkout.constants"
import { getCheckoutErrors, trimValues } from "@/utils/checkout.utils"
import type { TCheckoutErrors, TCheckoutFieldName, TCheckoutValues } from "@/types/checkout.types"

// Errors are derived from the values, not stored, so they can't go stale.
export function useCheckoutForm(onValid: (values: TCheckoutValues) => void) {
  const [values, setValues] = useState<TCheckoutValues>(EMPTY_CHECKOUT_VALUES)
  const [touched, setTouched] = useState<Partial<Record<TCheckoutFieldName, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(() => getCheckoutErrors(values), [values])
  const visibleErrors: TCheckoutErrors = {}
  for (const { name } of CHECKOUT_FIELDS) {
    if ((touched[name] || submitAttempted) && errors[name]) visibleErrors[name] = errors[name]
  }

  const handleChange = (name: TCheckoutFieldName, value: string) =>
    setValues((current) => ({ ...current, [name]: value }))

  const handleBlur = (name: TCheckoutFieldName) =>
    setTouched((current) => ({ ...current, [name]: true }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)

    const firstInvalid = CHECKOUT_FIELDS.find(({ name }) => errors[name])
    if (firstInvalid) {
      const field = event.currentTarget.elements.namedItem(firstInvalid.name)
      if (field instanceof HTMLElement) field.focus()
      return
    }
    onValid(trimValues(values))
  }

  return { values, errors: visibleErrors, handleChange, handleBlur, handleSubmit }
}
