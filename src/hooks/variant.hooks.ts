import { useState } from "react"
import { getInitialSelection, getVariantStatus } from "@/utils/variant.utils"
import type { Product, ProductOption } from "@/types/product"
import type { TVariantSelection } from "@/types/variant.types"

export function useVariantSelection(product: Product) {
  const [selection, setSelection] = useState<TVariantSelection>(() => getInitialSelection(product))
  const status = getVariantStatus(product, selection)

  const selectOption = (option: ProductOption, value: string) =>
    setSelection((current) => ({ ...current, [option.id]: value }))

  return { selection, status, selectOption }
}
