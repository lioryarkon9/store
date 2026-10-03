import { BED_SIZES, BED_SIZE_ALIASES } from "@/constants/attributes.constants"
import { getOwn, slugify } from "@/utils/common.utils"
import type { TBedSize, TLiquidSize, TShoeSize, TSize, TWeightSize } from "@/types/attributes.types"

const MEASUREMENT = /^(\d+(?:\.\d+)?)\s*(ml|l|kg|g)$/
const SHOE_SIZE = /^eu[\s_-]*(\d+(?:\.\d+)?)$/

// "500ML" / "500 ml" -> "500ml", "EU 42" -> "eu_42", "Queen" -> "large". Null if unrecognised.
export function extractSize(raw: string): TSize | null {
  const value = raw.trim().toLowerCase()

  const measurement = value.match(MEASUREMENT)
  if (measurement) return `${Number(measurement[1])}${measurement[2]}` as TLiquidSize | TWeightSize

  const shoe = value.match(SHOE_SIZE)
  if (shoe) return `eu_${Number(shoe[1])}` as TShoeSize

  const key = slugify(value)
  if ((BED_SIZES as readonly string[]).includes(key)) return key as TBedSize
  return getOwn(BED_SIZE_ALIASES, key)
}
