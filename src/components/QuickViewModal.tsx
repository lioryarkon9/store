"use client"

import { useId, useState } from "react"
import { X } from "lucide-react"
import { AddedToCartPanel } from "@/components/AddedToCartPanel"
import { BaseDialog } from "@/components/BaseDialog"
import { ProductImageGallery } from "@/components/ProductImageGallery"
import { ProductPrice } from "@/components/ProductPrice"
import { StockBadge } from "@/components/StockBadge"
import { VariantSelector } from "@/components/VariantSelector"
import { useCart, useCurrency, useTranslation } from "@/hooks/common.hooks"
import { useVariantSelection } from "@/hooks/variant.hooks"
import { formatList } from "@/utils/i18n.utils"
import { formatPrice, getVariantPrice } from "@/utils/price.utils"
import { getQuantityInCart } from "@/utils/cart.utils"
import { isInStock } from "@/utils/variant.utils"
import type { Price, Product, ProductVariant } from "@/types/product"

type TProps = {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, variant: ProductVariant, price: Price) => void
  onViewCart: () => void
}

export function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onViewCart,
}: TProps) {
  const titleId = useId()
  const { items } = useCart()
  const { currency } = useCurrency()
  const { t, locale } = useTranslation()
  const { selection, status, selectOption } = useVariantSelection(product)
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null)

  const variant = status.status === "ready" ? status.variant : null
  const variantPrice = variant ? getVariantPrice(variant, currency) : null
  const inStock = variant ? isInStock(variant) : false
  const stockInCart =
    variant !== null && getQuantityInCart(items, variant.id) >= variant.inventory_quantity
  const canAdd = variant !== null && inStock && variantPrice !== null && !stockInCart
  const confirmedItem =
    variant !== null && addedVariantId === variant.id
      ? items.find((item) => item.variantId === variant.id)
      : undefined

  return (
    <BaseDialog
      labelledBy={titleId}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-4xl rounded-lg bg-white p-0 backdrop:bg-black/50"
    >
      {(close) => (
        <div className="relative">
          <button
            type="button"
            onClick={close}
            aria-label={t("common.close")}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-gray-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="grid max-h-[90dvh] gap-6 overflow-y-auto p-4 sm:p-6 md:grid-cols-2">
            <ProductImageGallery images={product.images} title={product.title} />

            <div className="flex flex-col gap-4 md:pr-8">
              <h2 id={titleId} className="text-2xl font-semibold">
                {product.title}
              </h2>

              {status.status === "ready" && (
                <>
                  <p className="text-xl">
                    {variantPrice ? formatPrice(variantPrice) : t("common.price.unavailable")}
                  </p>
                  <StockBadge inStock={inStock} />
                </>
              )}
              {status.status === "incomplete" && (
                <>
                  <p className="text-xl">
                    <ProductPrice product={product} currency={currency} />
                  </p>
                  <p className="text-sm text-gray-600">
                    {t("quickView.selectOptions", {
                      options: formatList(
                        locale,
                        status.missing.map((option) => option.title)
                      ),
                    })}
                  </p>
                </>
              )}
              {status.status === "unavailable_combination" && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {t("quickView.combinationUnavailable")}
                </p>
              )}
              {status.status === "data_error" && (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {t("quickView.temporarilyUnavailable")}
                </p>
              )}

              <p className="text-gray-600">{product.description}</p>
              <VariantSelector
                product={product}
                selection={selection}
                onSelect={(option, value) => {
                  setAddedVariantId(null)
                  selectOption(option, value)
                }}
              />

              {/* Must already be in the DOM for assistive tech to announce text added later. */}
              <div role="status" className="sr-only">
                {confirmedItem && t("quickView.added.announcement", { product: product.title })}
              </div>
              {confirmedItem ? (
                <AddedToCartPanel
                  item={confirmedItem}
                  onViewCart={onViewCart}
                  onContinueShopping={close}
                />
              ) : (
                <>
                  {stockInCart && inStock && (
                    <p className="text-sm text-gray-600">{t("quickView.stockInCart")}</p>
                  )}
                  <button
                    type="button"
                    disabled={!canAdd}
                    onClick={() => {
                      if (!variant || !variantPrice) return
                      onAddToCart(product, variant, variantPrice)
                      setAddedVariantId(variant.id)
                    }}
                    className="mt-2 w-full rounded-md bg-black py-3 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {variant && !inStock ? t("common.stock.outOfStock") : t("quickView.addToCart")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </BaseDialog>
  )
}
