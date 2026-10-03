import { LoadingOverlay } from "@/components/LoadingOverlay"
import { ProductCard } from "@/components/ProductCard"
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton"
import { useTranslation } from "@/hooks/common.hooks"
import type { TCurrencyCode } from "@/types/common.types"
import type { Product } from "@/types/product"

type TProps = {
  products: Product[]
  currency: TCurrencyCode
  isLoading: boolean
  hasError: boolean
  hasActiveFilters: boolean
  onQuickView: (product: Product) => void
  onRetry: () => void
  onClear: () => void
}

export function ProductGrid({
  products,
  currency,
  isLoading,
  hasError,
  hasActiveFilters,
  onQuickView,
  onRetry,
  onClear,
}: TProps) {
  const { t } = useTranslation()
  const showSkeleton = isLoading && products.length === 0
  const showEmpty = !isLoading && !hasError && products.length === 0

  return (
    <div className="relative min-h-64" aria-busy={isLoading}>
      {isLoading && !showSkeleton && <LoadingOverlay />}
      {showSkeleton && (
        <>
          <div role="status" className="sr-only">
            {t("products.loading")}
          </div>
          <ProductGridSkeleton />
        </>
      )}

      {hasError && (
        <div className="py-16 text-center" role="alert">
          <p className="text-gray-700">{t("products.loadError")}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      )}

      {showEmpty && (
        <div className="py-16 text-center">
          <p className="text-gray-700">{t("products.empty")}</p>
          {hasActiveFilters && (
            <button type="button" onClick={onClear} className="mt-3 text-sm underline">
              {t("common.clearFilters")}
            </button>
          )}
        </div>
      )}

      {/* `inert` also blocks keyboard access to the dimmed grid while loading. */}
      <div
        inert={isLoading}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={currency}
            priority={index < 4}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  )
}
