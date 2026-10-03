import { useContext, useEffect, useState } from "react"
import { CartContext } from "@/components/CartProvider"
import { CurrencyContext } from "@/components/CurrencyProvider"
import { I18nContext } from "@/components/I18nProvider"

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error("useCurrency must be used inside <CurrencyProvider>")
  return context
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useTranslation must be used inside <I18nProvider>")
  return context
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside <CartProvider>")
  return context
}
