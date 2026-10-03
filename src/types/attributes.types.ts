import type { BED_SIZES } from "@/constants/attributes.constants"

export type TLiquidSize = `${number}${"ml" | "l"}`
export type TWeightSize = `${number}${"kg" | "g"}`
export type TShoeSize = `eu_${number}`
export type TBedSize = (typeof BED_SIZES)[number]
export type TSize = TLiquidSize | TWeightSize | TShoeSize | TBedSize

export type TAttributeExtractor = (raw: string) => string | null

// e.g. { size: "large", color: "oatmeal" }
export type TVariantAttributes = Record<string, string>
