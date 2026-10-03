"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useTranslation } from "@/hooks/common.hooks"
import { getLineTotal } from "@/utils/cart.utils"
import { formatPrice } from "@/utils/price.utils"
import type { TCartItem } from "@/types/cart.types"

type TProps = {
  item: TCartItem
  onRemove?: (variantId: string) => void
}

export function CartLineItem({ item, onRemove }: TProps) {
  const { t } = useTranslation()

  return (
    <li className="flex gap-3 py-4">
      <Image
        src={item.thumbnail}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{item.productTitle}</p>
        <p className="text-sm text-gray-600">{item.variantTitle}</p>
        <p className="mt-1 text-sm text-gray-600">
          {t("cart.quantity", { quantity: item.quantity })} × {formatPrice(item.unitPrice)}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="font-medium">{formatPrice(getLineTotal(item))}</p>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.variantId)}
            aria-label={t("cart.remove", { title: `${item.productTitle} ${item.variantTitle}` })}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </li>
  )
}
