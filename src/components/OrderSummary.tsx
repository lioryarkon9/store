"use client"

import { CartLineItem } from "@/components/CartLineItem"
import { useTranslation } from "@/hooks/common.hooks"
import { formatTotals, getCartTotals } from "@/utils/cart.utils"
import type { TCartItem } from "@/types/cart.types"

type TProps = { items: TCartItem[] }

export function OrderSummary({ items }: TProps) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="order-summary" className="rounded-lg border bg-white p-4">
      <h2 id="order-summary" className="text-lg font-semibold">
        {t("checkout.orderSummary")}
      </h2>
      <ul className="divide-y">
        {items.map((item) => (
          <CartLineItem key={item.variantId} item={item} />
        ))}
      </ul>
      <p className="flex justify-between border-t pt-3 text-lg font-semibold">
        <span>{t("cart.total")}</span>
        <span>{formatTotals(getCartTotals(items))}</span>
      </p>
    </section>
  )
}
