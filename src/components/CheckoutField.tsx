"use client"

import { useId } from "react"
import { useTranslation } from "@/hooks/common.hooks"
import type { TCheckoutFieldConfig } from "@/types/checkout.types"
import type { TTranslationKey } from "@/types/i18n.types"

type TProps = {
  config: TCheckoutFieldConfig
  value: string
  error?: TTranslationKey
  onChange: (value: string) => void
  onBlur: () => void
}

export function CheckoutField({ config, value, error, onChange, onBlur }: TProps) {
  const { t } = useTranslation()
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {t(config.labelKey)}
      </label>
      <input
        id={id}
        name={config.name}
        type={config.type}
        autoComplete={config.autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none ${
          error ? "border-red-600 focus:border-red-700" : "border-gray-300 focus:border-black"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {t(error)}
        </p>
      )}
    </div>
  )
}
