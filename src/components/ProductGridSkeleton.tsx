import { ProductCardSkeleton } from "@/components/ProductCardSkeleton"
import { PRODUCTS_PAGE_SIZE } from "@/constants/common.constants"

// Must match ProductGrid's classes so the layout doesn't shift when loading finishes.
export function ProductGridSkeleton() {
  return (
    <div
      aria-hidden
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: PRODUCTS_PAGE_SIZE }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
