import { PRODUCTS_PAGE_SIZE } from "@/constants/common.constants"
import { toPositiveInt } from "@/utils/common.utils"
import type { TProductsQuery } from "@/types/common.types"

export function parseProductsQuery(params: URLSearchParams): TProductsQuery {
  return {
    q: params.get("q") ?? "",
    collection: params.get("collection") ?? "",
    tag: params.get("tag") ?? "",
    page: toPositiveInt(params.get("page"), 1),
  }
}

// { q: "", collection: "audio", page: 1 } -> "collection=audio"
export function serializeProductsQuery(query: TProductsQuery): string {
  const params = new URLSearchParams()
  if (query.q) params.set("q", query.q)
  if (query.collection) params.set("collection", query.collection)
  if (query.tag) params.set("tag", query.tag)
  if (query.page > 1) params.set("page", String(query.page))
  return params.toString()
}

// limit/offset are always valid here because the API doesn't validate them.
export function toApiSearchParams(query: TProductsQuery): string {
  const params = new URLSearchParams({
    limit: String(PRODUCTS_PAGE_SIZE),
    offset: String((query.page - 1) * PRODUCTS_PAGE_SIZE),
  })
  if (query.q) params.set("q", query.q)
  if (query.collection) params.set("collection", query.collection)
  if (query.tag) params.set("tag", query.tag)
  return params.toString()
}
