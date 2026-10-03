import type { TVariantSelection } from "@/types/variant.types"
import type { Product, ProductOption } from "@/types/product"

type TProps = {
  product: Product
  selection: TVariantSelection
  onSelect: (option: ProductOption, value: string) => void
}

export function VariantSelector({ product, selection, onSelect }: TProps) {
  return (
    <div className="space-y-4">
      {product.options.map((option) => (
        <fieldset key={option.id}>
          <legend className="mb-2 text-sm font-medium text-gray-700">{option.title}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selection[option.id] === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(option, value)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white hover:border-black"
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
