import { getCurrencySymbol } from "@/utils/currency.utils"
import type { TCurrencyCode } from "@/types/common.types"
import type { Price, Product, ProductVariant } from "@/types/product"

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// amount is in minor units (agorot / cents): 29900 -> "₪299.00"
export function formatPrice(price: Price): string {
  return `${getCurrencySymbol(price.currency_code)}${amountFormatter.format(price.amount / 100)}`
}

function getPricesInCurrency(product: Product, currency: TCurrencyCode): Price[] {
  return product.variants.flatMap((variant) =>
    variant.prices.filter((price) => price.currency_code === currency)
  )
}

// null rather than a converted price when no variant is priced in `currency`.
export function getCheapestPrice(product: Product, currency: TCurrencyCode): Price | null {
  const prices = getPricesInCurrency(product, currency)
  if (prices.length === 0) return null
  return prices.reduce((cheapest, price) => (price.amount < cheapest.amount ? price : cheapest))
}

export function hasPriceRange(product: Product, currency: TCurrencyCode): boolean {
  return new Set(getPricesInCurrency(product, currency).map((price) => price.amount)).size > 1
}

export function getVariantPrice(variant: ProductVariant, currency: TCurrencyCode): Price | null {
  return variant.prices.find((price) => price.currency_code === currency) ?? null
}
