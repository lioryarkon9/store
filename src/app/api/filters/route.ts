import { NextResponse } from "next/server"
import productsData from "../../../../mock-data/products.json"
import type { TFiltersResponse } from "@/types/common.types"

// The API can filter by collection/tag but has no way to list the valid values.
export async function GET() {
  const collections = new Map<string, TFiltersResponse["collections"][number]>()
  const tags = new Set<string>()

  for (const product of productsData) {
    collections.set(product.collection.handle, product.collection)
    product.tags.forEach((tag) => tags.add(tag.value))
  }

  const body: TFiltersResponse = {
    collections: [...collections.values()].sort((a, b) => a.title.localeCompare(b.title)),
    tags: [...tags].sort(),
  }
  return NextResponse.json(body)
}
