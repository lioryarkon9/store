"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { CheckoutForm } from "@/components/CheckoutForm"
import { OrderSummary } from "@/components/OrderSummary"
import { useCart, useTranslation } from "@/hooks/common.hooks"
import type { TCartItem } from "@/types/cart.types"
import type { TCheckoutValues } from "@/types/checkout.types"

// Kept after the cart is cleared so the confirmation can still show what was ordered.
type TPlacedOrder = { name: string; items: TCartItem[] }

const linkClass =
  "inline-block rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"

export function CheckoutView() {
  const { t } = useTranslation()
  const { items, isHydrated, clearCart } = useCart()
  const [order, setOrder] = useState<TPlacedOrder | null>(null)

  // There is no backend: placing an order only records it for the confirmation and empties the cart.
  const handleSubmit = (values: TCheckoutValues) => {
    setOrder({ name: values.fullName, items })
    clearCart()
  }

  let content: React.ReactNode
  if (order) {
    content = (
      <div className="mx-auto max-w-xl space-y-6">
        <div role="status" className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-700" aria-hidden />
          <h2 className="text-2xl font-semibold">{t("checkout.success.title", { name: order.name })}</h2>
          <p className="text-gray-600">{t("checkout.success.message")}</p>
        </div>
        <OrderSummary items={order.items} />
        <div className="text-center">
          <Link href="/products" className={linkClass}>
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    )
  } else if (!isHydrated) {
    content = <p className="text-gray-600">{t("common.loading")}</p>
  } else if (items.length === 0) {
    content = (
      <div className="py-10 text-center">
        <p className="mb-4 text-gray-600">{t("cart.empty")}</p>
        <Link href="/products" className={linkClass}>
          {t("cart.continueShopping")}
        </Link>
      </div>
    )
  } else {
    content = (
      <div className="grid gap-8 lg:grid-cols-2">
        <CheckoutForm onSubmit={handleSubmit} />
        <div className="lg:order-last">
          <OrderSummary items={items} />
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{t("checkout.title")}</h1>
      {content}
    </main>
  )
}
