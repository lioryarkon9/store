import { FilterSelect } from "@/components/FilterSelect"
import { SearchInput } from "@/components/SearchInput"
import { useTranslation } from "@/hooks/common.hooks"
import type { TFiltersResponse, TProductsQuery } from "@/types/common.types"

type TProps = {
  query: TProductsQuery
  filters: TFiltersResponse | null
  hasActiveFilters: boolean
  onQueryChange: (patch: Partial<TProductsQuery>, options?: { replace?: boolean }) => void
  onClear: () => void
}

export function ProductFilters({
  query,
  filters,
  hasActiveFilters,
  onQueryChange,
  onClear,
}: TProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="w-full sm:max-w-xs sm:flex-1 sm:self-end">
        <SearchInput value={query.q} onChange={(q) => onQueryChange({ q }, { replace: true })} />
      </div>
      <FilterSelect
        label={t("products.filters.collection")}
        value={query.collection}
        allLabel={t("products.filters.allCollections")}
        options={(filters?.collections ?? []).map((c) => ({ value: c.handle, label: c.title }))}
        onChange={(collection) => onQueryChange({ collection })}
      />
      <FilterSelect
        label={t("products.filters.tag")}
        value={query.tag}
        allLabel={t("products.filters.allTags")}
        options={(filters?.tags ?? []).map((tag) => ({ value: tag, label: tag }))}
        onChange={(tag) => onQueryChange({ tag })}
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-3 py-2 text-sm text-gray-700 underline hover:text-black"
        >
          {t("common.clearFilters")}
        </button>
      )}
    </div>
  )
}
