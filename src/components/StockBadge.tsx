"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { useTranslation } from "@/hooks/common.hooks"

type TProps = { inStock: boolean }

export function StockBadge({ inStock }: TProps) {
  const { t } = useTranslation()

  return inStock ? (
    <p className="flex items-center gap-1.5 text-sm text-green-700">
      <CheckCircle2 className="h-4 w-4" aria-hidden />
      {t("common.stock.inStock")}
    </p>
  ) : (
    <p className="flex items-center gap-1.5 text-sm font-medium text-red-700">
      <XCircle className="h-4 w-4" aria-hidden />
      {t("common.stock.outOfStock")}
    </p>
  )
}
