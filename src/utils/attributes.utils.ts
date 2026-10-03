import { VARIANT_TITLE_SEPARATOR } from "@/constants/attributes.constants"
import { extractColor } from "@/utils/color.utils"
import { getOwn, slugify } from "@/utils/common.utils"
import { extractSize } from "@/utils/size.utils"
import type { TAttributeExtractor, TVariantAttributes } from "@/types/attributes.types"
import type { ProductOption } from "@/types/product"

const EXTRACTORS: Record<string, TAttributeExtractor> = {
  size: extractSize,
  color: extractColor,
}

export function getOptionCategory(optionTitle: string): string {
  return slugify(optionTitle)
}

export function normalizeAttributeValue(category: string, raw: string): string {
  return getOwn(EXTRACTORS, category)?.(raw) ?? slugify(raw)
}

// "Black" in "EU 42 - Black" belongs to no option; this finds that it is a colour.
function detectCategory(raw: string): string | null {
  return Object.keys(EXTRACTORS).find((category) => EXTRACTORS[category](raw) !== null) ?? null
}

// "500ml - White" with options [Size, Color] -> { size: "500ml", color: "white" }
// "EU 42 - Black" with options [Size]        -> { size: "eu_42", color: "black" }
// Segments are matched to options by value, not position; an unrecognised leftover becomes `extra_<n>`.
export function extractVariantAttributes(
  variantTitle: string,
  options: ProductOption[]
): TVariantAttributes {
  const attributes: TVariantAttributes = {}
  const unassigned = [...options]

  variantTitle.split(VARIANT_TITLE_SEPARATOR).forEach((segment, index) => {
    const matchIndex = unassigned.findIndex((option) => {
      const category = getOptionCategory(option.title)
      const key = normalizeAttributeValue(category, segment)
      return option.values.some((value) => normalizeAttributeValue(category, value) === key)
    })

    if (matchIndex >= 0) {
      const [option] = unassigned.splice(matchIndex, 1)
      const category = getOptionCategory(option.title)
      attributes[category] = normalizeAttributeValue(category, segment)
      return
    }

    const category = detectCategory(segment) ?? `extra_${index}`
    attributes[category] ??= normalizeAttributeValue(category, segment)
  })

  return attributes
}
