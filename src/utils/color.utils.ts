import { COLOR_ALIASES } from "@/constants/attributes.constants"
import { getOwn, slugify } from "@/utils/common.utils"

export function extractColor(raw: string): string | null {
  return getOwn(COLOR_ALIASES, slugify(raw))
}
