"use client"

import { Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/common.hooks"

export function LoadingOverlay() {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      className="absolute inset-0 z-10 flex cursor-wait items-start justify-center rounded-lg bg-white/70 pt-24"
    >
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" aria-hidden />
      <span className="sr-only">{t("products.loading")}</span>
    </div>
  )
}
