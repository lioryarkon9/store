import type { TPageItem } from "@/types/common.types"

export function getTotalPages(count: number, pageSize: number): number {
  return Math.max(1, Math.ceil(count / pageSize))
}

// getPageItems(5, 10) -> [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
export function getPageItems(current: number, total: number): TPageItem[] {
  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  const items: TPageItem[] = []
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push("ellipsis")
    items.push(page)
  })
  return items
}
