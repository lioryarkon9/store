"use client"

import { CheckoutField } from "@/components/CheckoutField"
import { CHECKOUT_FIELDS } from "@/constants/checkout.constants"
import { useCheckoutForm } from "@/hooks/checkout.hooks"
import { useTranslation } from "@/hooks/common.hooks"
import type { TCheckoutValues } from "@/types/checkout.types"

type TProps = { onSubmit: (values: TCheckoutValues) => void }

export function CheckoutForm({ onSubmit }: TProps) {
  const { t } = useTranslation()
  const { values, errors, handleChange, handleBlur, handleSubmit } = useCheckoutForm(onSubmit)

  return (
    // noValidate: our own validation shows the errors, so the browser's bubbles would compete with it.
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h2 className="text-lg font-semibold">{t("checkout.shippingDetails")}</h2>
      {CHECKOUT_FIELDS.map((config) => (
        <CheckoutField
          key={config.name}
          config={config}
          value={values[config.name]}
          error={errors[config.name]}
          onChange={(value) => handleChange(config.name, value)}
          onBlur={() => handleBlur(config.name)}
        />
      ))}
      <button
        type="submit"
        className="w-full rounded-md bg-black py-3 text-white transition-colors hover:bg-gray-800"
      >
        {t("checkout.placeOrder")}
      </button>
    </form>
  )
}
