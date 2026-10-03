import { ChevronDown } from "lucide-react"

type TFilterSelectOption = { value: string; label: string }

type TProps = {
  label: string
  value: string
  options: TFilterSelectOption[]
  onChange: (value: string) => void
  allLabel?: string
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
}: TProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-xs font-medium text-gray-600 sm:w-auto">
      {label}
      <span className="relative block">
        {/* appearance-none removes the native arrow, which sits flush against the border. */}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm font-normal text-black focus:border-black focus:outline-none"
        >
          {allLabel !== undefined && <option value="">{allLabel}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          aria-hidden
        />
      </span>
    </label>
  )
}
