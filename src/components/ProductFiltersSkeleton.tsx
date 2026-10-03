// Heights match the real controls (input 38px, labelled select 58px) so nothing shifts.
export function ProductFiltersSkeleton() {
  return (
    <div
      aria-hidden
      className="mb-6 flex animate-pulse flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="h-[38px] w-full rounded-md bg-gray-200 sm:max-w-xs sm:flex-1" />
      <div className="h-[58px] w-full rounded-md bg-gray-200 sm:w-44" />
      <div className="h-[58px] w-full rounded-md bg-gray-200 sm:w-44" />
    </div>
  )
}
