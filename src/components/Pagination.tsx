import { useTranslation } from "@/hooks/common.hooks"
import { getPageItems } from "@/utils/pagination.utils"

type TProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonClass =
  "min-w-9 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"

export function Pagination({ page, totalPages, onPageChange }: TProps) {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  return (
    <nav aria-label={t("products.pagination.label")} className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className={buttonClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t("products.pagination.previous")}
      </button>
      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-gray-500" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            aria-label={t("products.pagination.page", { page: item })}
            className={`${buttonClass} ${item === page ? "border-black bg-black text-white hover:bg-black" : ""}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className={buttonClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t("products.pagination.next")}
      </button>
    </nav>
  )
}
