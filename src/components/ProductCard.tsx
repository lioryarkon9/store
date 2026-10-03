"use client"

import Image from "next/image"
import { ProductPrice } from "@/components/ProductPrice"
import { useTranslation } from "@/hooks/common.hooks"
import type { TCurrencyCode } from "@/types/common.types"
import type { Product } from "@/types/product"

type TProps = {
  product: Product
  currency: TCurrencyCode
  onQuickView: (product: Product) => void
  // Next.js warns when the largest above-the-fold image is lazy-loaded.
  priority?: boolean
}

export function ProductCard({ product, currency, onQuickView, priority }: TProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="h-64 w-full bg-gray-200">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={400}
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-64 w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-medium">{product.title}</h3>
        <p className="mt-1 text-gray-600">
          <ProductPrice product={product} currency={currency} />
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="w-full rounded-md bg-black py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            {t("products.card.quickView")}
          </button>
        </div>
      </div>
    </div>
  )
}
