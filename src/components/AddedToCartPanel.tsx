"use client"

import { CheckCircle2 } from "lucide-react"
import { CartLineItem } from "@/components/CartLineItem"
import { useTranslation } from "@/hooks/common.hooks"
import type { TCartItem } from "@/types/cart.types"

type TProps = {
  item: TCartItem
  onViewCart: () => void
  onContinueShopping: () => void
}

export function AddedToCartPanel({ item, onViewCart, onContinueShopping }: TProps) {
  const { t } = useTranslation()

  return (
    <section className="rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="flex items-center gap-2 font-medium text-green-800">
        <CheckCircle2 className="h-5 w-5" aria-hidden />
        {t("quickView.added.title")}
      </h3>
      <ul>
        <CartLineItem item={item} />
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row">
        {/* The focused Add to Cart button has just been replaced, so focus has to land somewhere. */}
        <button
          type="button"
          autoFocus
          onClick={onViewCart}
          className="flex-1 rounded-md bg-black py-3 text-white transition-colors hover:bg-gray-800"
        >
          {t("quickView.added.viewCart")}
        </button>
        <button
          type="button"
          onClick={onContinueShopping}
          className="flex-1 rounded-md border border-gray-300 bg-white py-3 transition-colors hover:border-black"
        >
          {t("cart.continueShopping")}
        </button>
      </div>
    </section>
  )
}
