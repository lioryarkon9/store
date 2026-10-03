import type { ProductOption, ProductVariant } from "@/types/product"

// option id -> the value exactly as the API labels it (not normalised)
export type TVariantSelection = Record<string, string>

export type TDataErrorReason =
  | "no_variants"
  | "empty_option"
  | "ambiguous_selection"
  | "invalid_inventory"

export type TVariantStatus =
  | { status: "incomplete"; missing: ProductOption[] }
  | { status: "unavailable_combination" }
  | { status: "data_error"; reason: TDataErrorReason }
  | { status: "ready"; variant: ProductVariant }
