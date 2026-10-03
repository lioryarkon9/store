"use client"

import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { INITIAL_CART_STATE, cartReducer, createCartItem, getCartCount } from "@/utils/cart.utils"
import { loadCart, saveCart } from "@/utils/storage.utils"
import type { TCartContextValue } from "@/types/cart.types"

export const CartContext = createContext<TCartContextValue | null>(null)

type TProps = { children: React.ReactNode }

export function CartProvider({ children }: TProps) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE)
  const [isOpen, setIsOpen] = useState(false)

  // localStorage doesn't exist on the server: start empty to match the server render, then load.
  useEffect(() => {
    dispatch({ type: "hydrate", items: loadCart() })
  }, [])

  // Saving before hydration would overwrite the stored cart with the empty initial state.
  useEffect(() => {
    if (state.isHydrated) saveCart(state.items)
  }, [state.items, state.isHydrated])

  const addItem = useCallback<TCartContextValue["addItem"]>(
    (product, variant, price) => dispatch({ type: "add", item: createCartItem(product, variant, price) }),
    []
  )
  const removeItem = useCallback((variantId: string) => dispatch({ type: "remove", variantId }), [])
  const clearCart = useCallback(() => dispatch({ type: "clear" }), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<TCartContextValue>(
    () => ({
      items: state.items,
      isHydrated: state.isHydrated,
      isOpen,
      count: getCartCount(state.items),
      addItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [state, isOpen, addItem, removeItem, clearCart, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
