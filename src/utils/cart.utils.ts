import { formatPrice } from "@/utils/price.utils"
import type { TCartAction, TCartItem, TCartState } from "@/types/cart.types"
import type { Price, Product, ProductVariant } from "@/types/product"

export const INITIAL_CART_STATE: TCartState = { items: [], isHydrated: false }

export function createCartItem(product: Product, variant: ProductVariant, price: Price): TCartItem {
  return {
    variantId: variant.id,
    productId: product.id,
    productTitle: product.title,
    variantTitle: variant.title,
    thumbnail: product.thumbnail,
    unitPrice: price,
    quantity: 1,
    maxQuantity: variant.inventory_quantity,
  }
}

// A re-added variant merges into its line (capped at stock) and takes the latest price/stock snapshot, as the old one may be stale.
export function cartReducer(state: TCartState, action: TCartAction): TCartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, isHydrated: true }
    case "add": {
      const existing = state.items.find((item) => item.variantId === action.item.variantId)
      if (!existing) return { ...state, items: [...state.items, action.item] }
      const quantity = Math.min(existing.quantity + action.item.quantity, action.item.maxQuantity)
      return {
        ...state,
        items: state.items.map((item) =>
          item.variantId === action.item.variantId ? { ...action.item, quantity } : item
        ),
      }
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.variantId !== action.variantId) }
    case "clear":
      return { ...state, items: [] }
  }
}

export function getCartCount(items: TCartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getQuantityInCart(items: TCartItem[], variantId: string): number {
  return items.find((item) => item.variantId === variantId)?.quantity ?? 0
}

export function getLineTotal(item: TCartItem): Price {
  return { amount: item.unitPrice.amount * item.quantity, currency_code: item.unitPrice.currency_code }
}

// One total per currency: amounts in different currencies are never added together.
export function getCartTotals(items: TCartItem[]): Price[] {
  const totals = new Map<string, number>()
  for (const item of items) {
    const code = item.unitPrice.currency_code
    totals.set(code, (totals.get(code) ?? 0) + getLineTotal(item).amount)
  }
  return [...totals].map(([currency_code, amount]) => ({ amount, currency_code }))
}

export function formatTotals(totals: Price[]): string {
  return totals.map(formatPrice).join(" + ")
}
