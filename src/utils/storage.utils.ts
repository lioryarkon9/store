import { z } from "zod"
import { CART_STORAGE_KEY } from "@/constants/common.constants"
import type { TCartItem } from "@/types/cart.types"

const cartItemSchema: z.ZodType<TCartItem> = z
  .object({
    variantId: z.string().min(1),
    productId: z.string().min(1),
    productTitle: z.string(),
    variantTitle: z.string(),
    thumbnail: z.string(),
    unitPrice: z.object({
      amount: z.number().int().nonnegative(),
      currency_code: z.string().min(1),
    }),
    quantity: z.number().int().positive(),
    maxQuantity: z.number().int().positive(),
  })
  .refine((item) => item.quantity <= item.maxQuantity)

// localStorage is user-editable and may hold data from an older version, so invalid items are dropped.
export function parseStoredCart(raw: string | null): TCartItem[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed.flatMap((entry) => {
      const result = cartItemSchema.safeParse(entry)
      if (!result.success || seen.has(result.data.variantId)) return []
      seen.add(result.data.variantId)
      return [result.data]
    })
  } catch {
    return []
  }
}

// Storage can be unavailable (private mode, quota, blocked); the cart then just isn't persisted.
export function loadCart(): TCartItem[] {
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY))
  } catch {
    return []
  }
}

export function saveCart(items: TCartItem[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // see loadCart
  }
}
