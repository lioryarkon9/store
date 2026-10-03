"use client"

import { useTranslation } from "@/hooks/common.hooks"
import { formatPrice, getCheapestPrice, hasPriceRange } from "@/utils/price.utils"
import type { TCurrencyCode } from "@/types/common.types"
import type { Product } from "@/types/product"

type TProps = {
  product: Product
  currency: TCurrencyCode
}

export function ProductPrice({ product, currency }: TProps) {
  const { t } = useTranslation()
  const price = getCheapestPrice(product, currency)

  if (!price) return <>{t("common.price.unavailable")}</>
  return (
    <>
      {hasPriceRange(product, currency)
        ? t("common.price.from", { price: formatPrice(price) })
        : formatPrice(price)}
    </>
  )
}
