import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { fetchFilters, fetchProducts } from "@/utils/api.utils"
import { parseProductsQuery, serializeProductsQuery } from "@/utils/query.utils"
import type { TFiltersResponse, TProductsQuery } from "@/types/common.types"
import type { ProductsResponse } from "@/types/product"

type TUpdateOptions = { replace?: boolean }

export function useProductsQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = useMemo(() => parseProductsQuery(searchParams), [searchParams])

  const updateQuery = useCallback(
    (patch: Partial<TProductsQuery>, { replace = false }: TUpdateOptions = {}) => {
      // A changed search or filter invalidates the current page unless a page is given explicitly.
      const next = { ...query, page: 1, ...patch }
      const search = serializeProductsQuery(next)
      const url = search ? `${pathname}?${search}` : pathname
      if (replace) router.replace(url, { scroll: false })
      else router.push(url, { scroll: false })
    },
    [query, pathname, router]
  )

  const clearQuery = useCallback(() => router.push(pathname, { scroll: false }), [pathname, router])

  return { query, updateQuery, clearQuery }
}

type TProductsState = {
  data: ProductsResponse | null
  isLoading: boolean
  hasError: boolean
}

export function useProducts(query: TProductsQuery) {
  const [state, setState] = useState<TProductsState>({ data: null, isLoading: true, hasError: false })
  const [reloadToken, setReloadToken] = useState(0)
  const { q, collection, tag, page } = query

  useEffect(() => {
    const controller = new AbortController()
    // The previous data stays on screen while loading so the grid doesn't collapse.
    setState((prev) => ({ ...prev, isLoading: true, hasError: false }))

    fetchProducts({ q, collection, tag, page }, controller.signal)
      .then((data) => setState({ data, isLoading: false, hasError: false }))
      .catch(() => {
        // Aborted means a newer request superseded this one; ignoring it keeps stale responses from winning.
        if (controller.signal.aborted) return
        setState((prev) => ({ ...prev, isLoading: false, hasError: true }))
      })

    return () => controller.abort()
  }, [q, collection, tag, page, reloadToken])

  const reload = useCallback(() => setReloadToken((token) => token + 1), [])

  return {
    products: state.data?.products ?? [],
    count: state.data?.count ?? 0,
    isLoading: state.isLoading,
    hasError: state.hasError,
    reload,
  }
}

export function useProductFilters() {
  const [filters, setFilters] = useState<TFiltersResponse | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchFilters(controller.signal)
      .then(setFilters)
      .catch(() => {
        // Non-critical: without options the dropdowns stay empty, search still works.
      })
    return () => controller.abort()
  }, [])

  return filters
}
