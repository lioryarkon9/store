import { API_ROUTES } from "@/constants/common.constants"
import { toApiSearchParams } from "@/utils/query.utils"
import type { TFiltersResponse, TProductsQuery } from "@/types/common.types"
import type { ProductsResponse } from "@/types/product"

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

export function fetchProducts(query: TProductsQuery, signal?: AbortSignal) {
  return getJson<ProductsResponse>(`${API_ROUTES.products}?${toApiSearchParams(query)}`, signal)
}

export function fetchFilters(signal?: AbortSignal) {
  return getJson<TFiltersResponse>(API_ROUTES.filters, signal)
}
