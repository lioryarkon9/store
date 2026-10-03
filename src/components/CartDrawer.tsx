"use client"

import { useId } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { BaseDialog } from "@/components/BaseDialog"
import { CartLineItem } from "@/components/CartLineItem"
import { useCart, useTranslation } from "@/hooks/common.hooks"
import { formatTotals, getCartTotals } from "@/utils/cart.utils"

export function CartDrawer() {
  const titleId = useId()
  const { t } = useTranslation()
  const { items, removeItem, closeCart } = useCart()

  return (
    <BaseDialog
      labelledBy={titleId}
      onClose={closeCart}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md rounded-none bg-white p-0 backdrop:bg-black/50"
    >
      {(close) => (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 id={titleId} className="text-lg font-semibold">
              {t("cart.title")}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={t("common.close")}
              className="rounded-full p-1.5 hover:bg-gray-100"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-10 text-center text-gray-600">{t("cart.empty")}</p>
          ) : (
            <>
              <ul className="flex-1 divide-y overflow-y-auto px-4">
                {items.map((item) => (
                  <CartLineItem key={item.variantId} item={item} onRemove={removeItem} />
                ))}
              </ul>
              <div className="space-y-3 border-t p-4">
                <p className="flex justify-between text-lg font-semibold">
                  <span>{t("cart.total")}</span>
                  <span>{formatTotals(getCartTotals(items))}</span>
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-gray-800"
                >
                  {t("cart.checkout")}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </BaseDialog>
  )
}
