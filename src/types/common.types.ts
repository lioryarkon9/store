import type { ProductCollection } from "@/types/product"

export type TCurrencyCode = "ILS" | "USD" | "EUR"

export type TCurrencyContextValue = {
  currency: TCurrencyCode
  setCurrency: (currency: TCurrencyCode) => void
}

export type TProductsQuery = {
  q: string
  collection: string
  tag: string
  page: number
}

export type TFiltersResponse = {
  collections: ProductCollection[]
  tags: string[]
}

export type TPageItem = number | "ellipsis"
