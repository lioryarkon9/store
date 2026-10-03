import type { Price, Product, ProductVariant } from "@/types/product"

// Price and stock are a snapshot from when the item was added; they are not re-checked against the API.
export type TCartItem = {
  variantId: string
  productId: string
  productTitle: string
  variantTitle: string
  thumbnail: string
  unitPrice: Price
  quantity: number
  maxQuantity: number
}

export type TCartState = {
  items: TCartItem[]
  // false until localStorage has been read, so the first render matches the server's
  isHydrated: boolean
}

export type TCartAction =
  | { type: "hydrate"; items: TCartItem[] }
  | { type: "add"; item: TCartItem }
  | { type: "remove"; variantId: string }
  | { type: "clear" }

export type TCartContextValue = {
  items: TCartItem[]
  isHydrated: boolean
  isOpen: boolean
  count: number
  addItem: (product: Product, variant: ProductVariant, price: Price) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}
