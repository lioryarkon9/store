import { Suspense } from "react"
import { ProductFiltersSkeleton } from "@/components/ProductFiltersSkeleton"
import { ProductGridSkeleton } from "@/components/ProductGridSkeleton"
import { ProductsView } from "@/components/ProductsView"
import { DEFAULT_LOCALE } from "@/constants/i18n.constants"
import { translate } from "@/utils/i18n.utils"

// useSearchParams() requires a Suspense boundary; the fallback mirrors the page so nothing shifts when it is replaced.
function ProductsFallback() {
  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{translate(DEFAULT_LOCALE, "products.title")}</h1>
      <ProductFiltersSkeleton />
      <div role="status" className="sr-only">
        {translate(DEFAULT_LOCALE, "products.loading")}
      </div>
      <ProductGridSkeleton />
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsView />
    </Suspense>
  )
}
