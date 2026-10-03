import type { TBedSize } from "@/types/attributes.types"

// The API has no link between a variant and its options, only a title like "Queen - Oatmeal".
export const VARIANT_TITLE_SEPARATOR = " - "

// Ordered: a size between two others goes between them, e.g. "large_plus" between "large" and "extra_large".
export const BED_SIZES = ["small", "medium", "large", "extra_large"] as const

// Internal terminology chosen by the product owner, not derived from the API data.
export const BED_SIZE_ALIASES: Record<string, TBedSize> = {
  queen: "large",
  king: "extra_large",
}

// Identity for now; the value side is where a colour gets renamed.
export const COLOR_ALIASES: Record<string, string> = {
  black: "black",
  brown: "brown",
  charcoal: "charcoal",
  cream: "cream",
  dusty_rose: "dusty_rose",
  forest_green: "forest_green",
  gray: "gray",
  gunmetal: "gunmetal",
  lavender: "lavender",
  matte_black: "matte_black",
  midnight_blue: "midnight_blue",
  navy: "navy",
  navy_blue: "navy_blue",
  oatmeal: "oatmeal",
  olive_green: "olive_green",
  red: "red",
  sage: "sage",
  silver: "silver",
  slate: "slate",
  space_gray: "space_gray",
  teal: "teal",
  white: "white",
}
