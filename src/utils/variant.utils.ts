import { extractVariantAttributes, getOptionCategory, normalizeAttributeValue } from "@/utils/attributes.utils"
import type { Product, ProductVariant } from "@/types/product"
import type { TVariantSelection, TVariantStatus } from "@/types/variant.types"

export function isInStock(variant: ProductVariant): boolean {
  return variant.inventory_quantity > 0
}

function hasValidInventory(variant: ProductVariant): boolean {
  return Number.isInteger(variant.inventory_quantity) && variant.inventory_quantity >= 0
}

// An option with a single value has nothing to choose between, so it is pre-selected.
export function getInitialSelection(product: Product): TVariantSelection {
  const selection: TVariantSelection = {}
  for (const option of product.options) {
    if (option.values.length === 1) selection[option.id] = option.values[0]
  }
  return selection
}

export function getVariantStatus(product: Product, selection: TVariantSelection): TVariantStatus {
  if (product.variants.length === 0) return { status: "data_error", reason: "no_variants" }
  if (product.options.some((option) => option.values.length === 0)) {
    return { status: "data_error", reason: "empty_option" }
  }

  const missing = product.options.filter((option) => !selection[option.id])
  if (missing.length > 0) return { status: "incomplete", missing }

  // A variant may carry attributes beyond the options (prod_14's colour), so it only has to match the selection.
  const matches = product.variants.filter((variant) => {
    const attributes = extractVariantAttributes(variant.title, product.options)
    return product.options.every((option) => {
      const category = getOptionCategory(option.title)
      return attributes[category] === normalizeAttributeValue(category, selection[option.id])
    })
  })

  if (matches.length === 0) return { status: "unavailable_combination" }
  if (matches.length > 1) return { status: "data_error", reason: "ambiguous_selection" }

  const [variant] = matches
  if (!hasValidInventory(variant)) return { status: "data_error", reason: "invalid_inventory" }
  return { status: "ready", variant }
}
