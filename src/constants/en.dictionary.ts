// UI copy only: product data from the API (titles, option values) is not translated.
export const en = {
  meta: {
    title: "Youleap Store — Dev Test",
    description: "Mid-level developer recruitment test",
  },
  common: {
    close: "Close",
    tryAgain: "Try again",
    clearFilters: "Clear filters",
    loading: "Loading…",
    price: {
      from: "From {price}",
      unavailable: "Price unavailable",
    },
    stock: {
      inStock: "In stock",
      outOfStock: "Out of stock",
    },
  },
  home: {
    title: "Youleap Store",
    subtitle: "Dev Test",
    browse: "Browse Products",
  },
  productPage: {
    title: "Product {id}",
  },
  products: {
    title: "Products",
    loading: "Loading products",
    loadError: "Couldn't load products.",
    empty: "No products match your search.",
    search: {
      label: "Search products",
      placeholder: "Search products",
    },
    filters: {
      collection: "Collection",
      allCollections: "All collections",
      tag: "Tag",
      allTags: "All tags",
    },
    card: {
      quickView: "Quick View",
    },
    pagination: {
      label: "Pagination",
      previous: "Prev",
      next: "Next",
      page: "Page {page}",
    },
  },
  quickView: {
    addToCart: "Add to Cart",
    selectOptions: "Select {options}",
    added: {
      title: "Added to your cart",
      announcement: "{product} added to your cart",
      viewCart: "View cart",
    },
    stockInCart: "All available stock is already in your cart.",
    combinationUnavailable: "This combination is not available.",
    temporarilyUnavailable: "Temporarily unavailable",
    gallery: {
      imageAlt: "{title} - image {current} of {total}",
      showImage: "Show image {number}",
      loading: "Loading image",
      error: "Image unavailable",
    },
  },
  header: {
    brand: "Youleap Store",
    cart: "Cart ({count})",
  },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    quantity: "Qty {quantity}",
    remove: "Remove {title}",
    total: "Total",
    checkout: "Checkout",
    continueShopping: "Continue shopping",
  },
  checkout: {
    title: "Checkout",
    shippingDetails: "Shipping details",
    orderSummary: "Order summary",
    placeOrder: "Place order",
    fields: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      address: "Street address",
      city: "City",
      postalCode: "Postal code",
      country: "Country",
    },
    errors: {
      required: "This field is required.",
      fullName: "Enter your full name.",
      email: "Enter a valid email address.",
      phone: "Enter a valid phone number.",
      address: "Enter your street address.",
      city: "Enter your city.",
      postalCode: "Enter a valid postal code.",
      country: "Enter your country.",
    },
    success: {
      title: "Thank you, {name}!",
      message: "Your order has been placed.",
    },
  },
} as const satisfies Record<string, unknown>
