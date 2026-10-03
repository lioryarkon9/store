"use client"

import { useEffect, useRef, useState } from "react"
import { Pagination } from "@/components/Pagination"
import { ProductFilters } from "@/components/ProductFilters"
import { ProductGrid } from "@/components/ProductGrid"
import { QuickViewModal } from "@/components/QuickViewModal"
import { PRODUCTS_PAGE_SIZE } from "@/constants/common.constants"
import { useCart, useCurrency, useTranslation } from "@/hooks/common.hooks"
import { useProductFilters, useProducts, useProductsQuery } from "@/hooks/products.hooks"
import { getTotalPages } from "@/utils/pagination.utils"
import type { Product } from "@/types/product"

export function ProductsView() {
  const { query, updateQuery, clearQuery } = useProductsQuery()
  const { products, count, isLoading, hasError, reload } = useProducts(query)
  const filters = useProductFilters()
  const { currency } = useCurrency()
  const { t } = useTranslation()
  const { addItem, openCart } = useCart()
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const scrollToTopAfterPageChange = useRef(false)

  // Next.js's own scroll option behaves differently in dev and production, and scrolling inside the
  // click handler would run before the history entry records the current position, which breaks Back.
  useEffect(() => {
    if (!scrollToTopAfterPageChange.current) return
    scrollToTopAfterPageChange.current = false
    window.scrollTo({ top: 0 })
  }, [query.page])

  const hasActiveFilters = Boolean(query.q || query.collection || query.tag)
  const totalPages = getTotalPages(count, PRODUCTS_PAGE_SIZE)

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{t("products.title")}</h1>
      <ProductFilters
        query={query}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onQueryChange={updateQuery}
        onClear={clearQuery}
      />
      <ProductGrid
        products={products}
        currency={currency}
        isLoading={isLoading}
        hasError={hasError}
        hasActiveFilters={hasActiveFilters}
        onQuickView={setQuickViewProduct}
        onRetry={reload}
        onClear={clearQuery}
      />
      <Pagination
        page={query.page}
        totalPages={totalPages}
        onPageChange={(page) => {
          scrollToTopAfterPageChange.current = page > query.page
          updateQuery({ page })
        }}
      />
      {quickViewProduct && (
        <QuickViewModal
          // Keyed so the variant selection and gallery start fresh for each product.
          key={quickViewProduct.id}
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addItem}
          onViewCart={() => {
            setQuickViewProduct(null)
            openCart()
          }}
        />
      )}
    </main>
  )
}
