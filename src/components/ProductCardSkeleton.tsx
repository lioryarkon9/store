// Must match ProductCard's structure and sizes so nothing moves when the real card replaces it.
export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="h-64 w-full bg-gray-200" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-7 w-3/4 rounded bg-gray-200" />
        <div className="mt-1 h-6 w-1/4 rounded bg-gray-200" />
        <div className="mt-auto pt-3">
          <div className="h-9 w-full rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
