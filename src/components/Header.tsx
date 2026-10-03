"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { CartDrawer } from "@/components/CartDrawer"
import { useCart, useTranslation } from "@/hooks/common.hooks"

export function Header() {
  const { t } = useTranslation()
  const { count, isHydrated, isOpen, openCart } = useCart()

  // The first value after the stored cart loads is the baseline, not a change.
  const [bump, setBump] = useState(0)
  const baseline = useRef<number | null>(null)
  useEffect(() => {
    if (!isHydrated) return
    if (baseline.current === null) {
      baseline.current = count
      return
    }
    if (count !== baseline.current) {
      baseline.current = count
      setBump((current) => current + 1)
    }
  }, [count, isHydrated])

  return (
    <header className="sticky top-0 z-20 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold">
          {t("header.brand")}
        </Link>
        <button
          type="button"
          onClick={openCart}
          aria-label={t("header.cart", { count })}
          className="relative rounded-md p-2 hover:bg-gray-100"
        >
          <ShoppingCart className="h-6 w-6" aria-hidden />
          {count > 0 && (
            <span
              key={bump}
              aria-hidden
              className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white ${
                bump > 0 ? "cart-bump" : ""
              }`}
            >
              {count}
            </span>
          )}
        </button>
      </div>
      {isOpen && <CartDrawer />}
    </header>
  )
}
