"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { SEARCH_DEBOUNCE_MS } from "@/constants/common.constants"
import { useDebounce, useTranslation } from "@/hooks/common.hooks"

type TProps = {
  value: string
  onChange: (value: string) => void
}

// `draft` only holds keystrokes not yet committed to the URL, which stays the source of truth.
export function SearchInput({ value, onChange }: TProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(value)
  const debouncedDraft = useDebounce(draft, SEARCH_DEBOUNCE_MS)
  const lastCommitted = useRef(value)

  useEffect(() => {
    if (debouncedDraft === lastCommitted.current) return
    lastCommitted.current = debouncedDraft
    onChange(debouncedDraft)
  }, [debouncedDraft, onChange])

  // The URL changed from outside (back button, "clear filters"), so adopt it.
  useEffect(() => {
    if (value === lastCommitted.current) return
    lastCommitted.current = value
    setDraft(value)
  }, [value])

  return (
    <label className="relative block w-full">
      <span className="sr-only">{t("products.search.label")}</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        aria-hidden
      />
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t("products.search.placeholder")}
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-black focus:outline-none"
      />
    </label>
  )
}
