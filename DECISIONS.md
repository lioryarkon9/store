# DECISIONS

Running log of decisions and reasoning for the Product Quick View task. Sections follow the README
(Key decisions, Tradeoffs, Verification, Surprises). Entries are added stage by stage.

## Stage 0 — API & data-shape verification (before writing any feature code)

### Verification

Ran against the live dev server (`localhost:3000`) with `curl`, plus a script that audited all 26
products (fetched with `limit=1000`) against `src/types/product.ts` and `openapi.json`.

**Result: the data shape matches the README, `src/types/product.ts` and `openapi.json`. No
structural adjustments to the types are needed.**

What was checked and confirmed:

| Check | Result |
|-------|--------|
| List envelope `{products, count, limit, offset}` | Matches. `count` is the total after filtering, not the page size (26 total, 12 default page). |
| Top-level keys on every product | 1 distinct key set across all 26 products, identical to the `Product` type. |
| Required string fields non-empty (`id`, `title`, `handle`, `description`, `thumbnail`, `created_at`) | 0 issues. |
| `collection` present, `variants`/`images`/`options` non-empty | 0 issues. |
| Variant keys, price keys, `amount` is an integer, `inventory_quantity` is an integer >= 0 | 0 issues. |
| IDs unique | 26 product ids, 59 variant ids, all unique. |
| `GET /api/products/:id` | `{product}` for a valid id, `404 {"error":"Product not found"}` otherwise. |
| `limit` / `offset` | Paginate correctly. An offset past the end returns `[]` with the real `count`. |
| `q` | Case-insensitive on title and description (`WIRELESS` and `wireless` both give 4). |
| `collection`, `tag` | Exact match, combinable (`tag=audio&collection=audio` gives 3). Both are case-sensitive (`tag=ELECTRONICS` gives 0). |
| Image hosts | `picsum.photos` is already allowed in `next.config.mjs`, so `next/image` can be used. |

Data facts the UI depends on (measured, not assumed):

- **Currency:** every price is `ILS`, exactly one price per variant. `amount` is in agorot, so
  `29900` is ₪299.00 (stated in `openapi.json`).
- **Variants per product:** 1 to 4. **Options per product:** 1 (23 products) or 2 (3 products).
- **Stock:** 3 of 59 variants are at 0 stock (e.g. `var_01c`). No product is out of stock on all
  variants. 3 variants are low stock (<= 5): `var_10c`, `var_20c`, `var_24b`.
- **Prices vary by variant** on 9 products (e.g. `prod_01`: 29900 and 31900), so the modal price must
  follow the selected variant.
- **Collections:** audio, home, office, lifestyle, health. 22 distinct tags.
- **Images:** 2 or 3 per product. `thumbnail` is never one of `images`.

### Surprises

1. **Variants are not linked to options by id.** A variant only has a free-text `title`. For
   single-option products the title equals the option value (`"Black"`). For two-option products it is
   the values joined by `" - "`, in option order (`"500ml - White"`). There is no `option_id` or
   `options` map on the variant, so selecting variant options in the UI means matching on `title`.
   - Handled by deriving a variant from the selected option values (join with `" - "`) and looking it
     up by title. This relies on the title convention, so it's isolated in one util and documented there.
2. **`prod_14` (Running Shoes) breaks the pattern.** It has one option (`Size`: `EU 42/43/44`) but the
   variant titles are `"EU 42 - Black"` etc. The colour is in the title with no matching option. An
   exact-title match fails here.
   - Plan: match a variant when its title *starts with* the selected values in option order, rather than
     requiring equality. To be tested against this product explicitly.
3. **`prod_20` (Linen Bedding Set) has 3 variants for 4 option combinations.** `King - Slate` doesn't
   exist. The selector must handle a combination with no variant (disable it or show unavailable). It
   must not crash or silently pick another variant.
4. **The starter `ProductCard` has latent bugs against this data:**
   - It shows `variants[0].prices[0]`. The README asks for the *starting* (lowest) price. `variants[0]`
     happens to be the cheapest on every current product, so it looks right, but it isn't guaranteed.
     Compute the minimum instead.
   - It divides by 100 and shows no currency, so the card says `299.00` with no ₪.
   - It uses a plain `<img>` with no `alt`, although `next.config.mjs` is set up for `next/image`.
   - The `Quick View` button has an empty `onClick` and `onQuickView` is never called. This is the
     entry point of our work.
   - `ProductsPage` and the card use `any`. These will be replaced with the types from
     `src/types/product.ts`.
5. **`openapi.json` is slightly out of sync with the data.** The `tag` enum lists 16 values but the
   data has 22. `footwear`, `decor`, `equipment`, `leather`, `photography` and `wellness` exist on
   products but not in the enum. The tag filter options will therefore not be hard-coded from the
   OpenAPI enum. The data wins, and filter options will come from the real products.
6. **The API does not validate its params** (and we may not modify `src/app/api/`):
   - `limit=abc` gives `limit: null` and an empty list.
   - `limit=-1` drops the last item (`slice(0, -1)`).
   - `offset=-5` gives an empty list.
   - `limit=0` gives an empty list.

   All return `200`. The client will only ever send valid, clamped integers.
7. **There is no endpoint that lists collections or tags.** The filter UI needs those values, so they
   must be derived on the client from the products (decision pending, see the filters stage).
8. **Simulated latency.** The routes sleep 200 to 500 ms (list) and 150 to 350 ms (detail). Loading and
   skeleton states are not optional, and search needs debouncing and stale-response protection.

### Key decisions (agreed with the user so far)

| Decision | Choice | Why |
|----------|--------|-----|
| Build order | Everything in README order, checking in after each stage | Keeps each stage reviewable. |
| Cart state | React Context + `useReducer`, persisted to `localStorage` through a hook | Small state, no new dependency. |
| Modal | Native `<dialog>` element | Focus trapping, Escape and top layer built in, no dependency. Backdrop click handled manually. |
| Form validation | `zod` (already installed) + a small hand-written `useCheckoutForm` hook | No new libraries. |
| Code organisation | One component per file. `src/{utils,constants,types,hooks}/` with `common.<what>.ts` names. Once 3 or more related items sit in a common file, split them into a dedicated file (e.g. `strings.utils.ts`). Types live in `types/` only if imported elsewhere, otherwise they stay in the consuming file. | Requested structure. |
| Responsiveness | Keep the existing mobile-first Tailwind breakpoints (`grid-cols-1 sm:2 lg:3 xl:4`) and make the modal and drawer work at phone width | Matches the existing foundation. |

### Tradeoffs

What I would do differently with more time, roughly by value:

- **Cart price and stock are snapshots.** An item keeps the price and stock it had when added, and is
  never re-checked against the API. Fine for a mock; a real store must re-validate at checkout (and the
  server must be the authority on price and stock).
- **No quantity stepper.** The cart supports adding (capped at stock) and removing a line, which is
  what the README asks for. Changing a quantity in place needs +/- controls and a decision on how to
  show the stock limit there.
- **Variant matching depends on the title convention** (see Surprises 1-3). The extraction layer makes
  it explicit and testable, but the durable fix is the backend linking variants to option values.
- **Colour and bed-size terminology is mostly identity.** The infrastructure is there; real
  names still need a decision (`Navy` vs `Navy Blue` vs `Midnight Blue`).
- **i18n is the minimum:** no plurals, no per-key parameter typing, no locale switching or RTL (see the
  Translations section).
- **No automated tests in the repo.** I verified with throwaway scripts (see each Verification
  section). With more time these become committed unit tests for the pure utils plus a Playwright
  smoke test for the flows.
- **Cart is not synced between tabs** (no `storage` event listener).
- **Accessibility is good but not audited:** dialogs, labels, `aria-invalid`, focus handling and
  `inert` are done; a screen-reader pass and a colour-contrast audit are not.
- **The API's lack of validation and the stale `openapi.json`** (12 vs 26 products, 16 vs 22 tags)
  were worked around, not fixed.

---

## Stage 1 — Product grid, search, filters, pagination

### Key decisions

- **The URL is the single source of truth** for `q`, `collection`, `tag` and `page`
  (`useProductsQuery` reads `useSearchParams` and writes with `router.push/replace`). Nothing from the
  URL is mirrored in `useState` or a reducer. The one exception is the search box's `draft`: it holds
  only keystrokes that haven't been committed yet (debounced 400 ms), and adopts the URL value
  when it changes from outside (back button, "Clear filters"). Search uses `replace` so typing doesn't
  fill the history. Filters and pages use `push`.
- **Changing any search/filter resets `page` to 1**, unless a page is passed explicitly. Otherwise
  filtering to 6 results while on page 3 would show an empty grid.
- **New route `GET /api/filters`** returns `{ collections, tags }`. The backend filters by
  collection/tag but has no way to list valid values, so the dropdowns had nothing to show.
  It is a new file derived from the same `mock-data`, so no existing API file is modified and the
  lists can't drift from the products. (The real tags in the data are 22, not the 16 in `openapi.json`.)
- **Stale responses:** each fetch has an `AbortController`. A newer request aborts the older one, so a
  slow earlier response can't overwrite the latest. The previous products stay on screen while
  loading.
- **Loading overlay covers the grid only, not the search box.** A full-page overlay would have
  disabled the input mid-typing. The grid is also `inert` while loading, so keyboard users can't
  reach the dimmed cards either.
- **Prices:** `getCheapestPrice` replaces `variants[0]`. The card shows "From ₪x" when variants differ
  in price. `amount` is divided by 100 and the symbol comes from `currency_code`. ILS/USD/EUR are
  supported, and any other code is shown as the raw code instead of a guessed symbol.
- **Currency:** the API does carry `currency_code`, so the symbol follows the data. A
  `CurrencyProvider` holds the selected currency (default `ILS`) and price lookups use it. There is **no
  currency dropdown**: it was built first and removed, since every price is ILS (all 59 variants) and
  every price already shows its own symbol, so it only took up space. Adding one later means a
  component calling `setCurrency` (the provider and the ILS/USD/EUR symbols are already there). There is
  no conversion: a product without a price in the selected currency shows "Price unavailable".
- **Pagination:** Prev/Next plus page numbers with ellipsis, mapped to `limit=12`/`offset`. The client
  always sends valid integers (page is parsed with a positive-integer fallback), since the API itself
  doesn't validate them.
- **Starter card fixed:** typed (no `any`), `next/image` with `alt`, and the `onQuickView` prop is
  wired to the button. The handler is a placeholder until the modal exists (Stage 2).

### Code organisation

One component per file in `src/components/`. Shared code is in `src/{constants,utils,hooks,types}/`
with `common.<what>.ts` for general items. Groups of 3 related items were given their own file from the
start: `currency.constants.ts`, `currency.utils.ts`, `price.utils.ts`, `pagination.utils.ts`,
`query.utils.ts`, `api.utils.ts`, `products.hooks.ts`. Types used in more than one file are in
`types/common.types.ts`. Prop types used by one component stay in that file.

### Verification

- `tsc --noEmit` and `eslint src`: no errors or warnings.
- `curl /api/filters`: 5 collections, 22 tags (matches the earlier data audit).
- `curl` with the exact query strings the client builds (`limit=12&offset=24&q=a` etc.): correct
  counts and offsets. An out-of-range page returns an empty list, which the UI shows as the empty state.
- `/products` and `/products?q=…&collection=…&page=2` both return 200 and render the page shell.
- The pure utils were run directly: `getTotalPages`, `getPageItems` (ellipsis cases),
  `parseProductsQuery` (`page=abc`, `-3`, `2.5` all give 1), `serializeProductsQuery`, `toApiSearchParams`,
  `formatPrice` (₪/$/€/unknown code), `getCheapestPrice` (unordered variants, missing currency) and
  `hasPriceRange`.
- **Not yet verified:** the interactive behaviour in a browser (debounce, back button, overlay).

---

## Stage 2 — Quick View modal

### Variant ↔ option matching (extraction layer)

The backend gives variants only a free-text title (see Surprises 1–3), so matching is done by an
extraction layer instead of per-product special cases:

- `extractVariantAttributes(title, options)` turns `"500ml - White"` into `{ size: "500ml", color: "white" }`.
- Each category has an extractor that returns **our internal key** or `null` when it doesn't recognise
  the value: `extractSize` (`size.utils.ts`) and `extractColor` (`color.utils.ts`). Extractors are
  registered in one map in `attributes.utils.ts`. Categories with no extractor (Flavor, Finish,
  Switch Type, ...) fall back to a slug, so they still match.
- **Size is a single category** covering volume, weight, shoe and bed sizes (`TLiquidSize`,
  `TWeightSize`, `TShoeSize`, `TBedSize`, `TSize` in `types/attributes.types.ts`).
  `500ML`, `500 ml` and `500ml` all become `500ml`. `EU 42` becomes `eu_42`.
- **Bed sizes use an ordered scale** (`BED_SIZES`) plus an alias table. `Queen → large`,
  `King → extra_large` is **our own terminology, given by the product owner**, not something derived
  from the data. To add a size between two others, insert it into `BED_SIZES` in position and alias
  the backend label. Nothing else changes.
- **Colours** go through `COLOR_ALIASES` (backend label → internal key). Today every entry is the
  identity (`oatmeal → oatmeal`) for the 22 colours present in the data. Renaming one is a one-line
  change. `Navy`, `Navy Blue` and `Midnight Blue` are kept as three separate colours until a
  terminology decision is made.
- The UI **shows the backend's label** ("Queen"). Only matching uses the internal key.
- Segments are matched to options **by value, not position**. A segment that matches no option is
  classified by what it looks like: this is how `"EU 42 - Black"` (prod_14) gets `color: black` even
  though the product has no Color option.
- Known limit: a segment with no matching option **and** a value no extractor recognises (e.g. a
  colour missing from `COLOR_ALIASES` appearing as an extra segment) is kept as `extra_<n>`, not as
  `color`. It is never dropped and never breaks matching of the real options.

### Selection model (final)

Principle from the product owner: **the code never guesses.** The modal stores only the option values
the shopper chose (`useVariantSelection`). `getVariantStatus(product, selection)` derives what that
means, always one of four states (`types/variant.types.ts`):

| State | When | Shown |
|-------|------|-------|
| `incomplete` | not every option is chosen | Starting price ("From ₪x"), "Select Size and Color", Add to Cart disabled |
| `unavailable_combination` | all chosen, no variant has that combination (prod_20 `King + Slate`) | "This combination is not available." |
| `data_error` | data can't be trusted (below) | "Temporarily unavailable" |
| `ready` | exactly one variant matches | That variant's price, stock status, Add to Cart enabled |

- **Nothing is pre-selected**, with one exception: an option with a single value (e.g. "Standard") is
  selected automatically, since there is nothing to choose between. The modal then opens `ready` for the
  5 single-variant products and `incomplete` for the other 21.
- `data_error` reasons: product has no variants; an option has no values; **more than one variant matches
  the selection** (previously the first in-stock one was picked silently); the matched variant's
  `inventory_quantity` is not a non-negative integer (previously shown as "Out of stock", which would
  have been wrong). A product with several variants but no options is also caught by the ambiguity rule.
- The two messages are kept separate on purpose: for "not available" the shopper can pick something
  else, for "temporarily unavailable" there is nothing they can do.
- An out-of-stock variant is a normal `ready` state ("Out of stock", button disabled), not an error.
- A variant with no price in the selected currency stays `ready` but shows "Price unavailable" with the
  button disabled, because the cause is the currency, not corrupted data.
- Option buttons are never disabled, so every combination can be reached and then explained.

History: the first version defaulted to the first in-stock variant, then silently jumped to the
"closest" variant on an impossible click. Both were replaced because they decide on the shopper's behalf.

### Modal

- Native `<dialog>` opened with `showModal()`: focus trap, Escape, top layer and focus restoration
  come from the browser. Closes via Escape, the close button or a click on the backdrop (a click
  whose target is the `<dialog>` itself, since the content sits in an inner wrapper that fills it).
- Page scroll is locked with `body:has(dialog[open])` in CSS, with no JS.
- The modal is mounted only while a product is open, keyed by product id, so gallery and selection
  reset on every open.
- It uses the product already loaded in the list. Verified that all 26 list items are identical to
  their `GET /api/products/:id` response, so a second request would add latency and nothing else.
- **Out of stock:** red "Out of stock" status and a disabled button that says "Out of stock". No
  low-stock badges, as agreed. The button is also disabled when the variant has no price in the
  selected currency.
- Layout: single column on phones (image above details), two columns from `md`. The content scrolls
  inside the dialog (`max-h-[90dvh]`).
- The first 4 product cards load their image eagerly (`priority`): Next.js warned in the console that
  the largest visible image was lazy-loaded.
- "Add to Cart" is wired in Stage 3.

### Verification

- `tsc --noEmit` and `eslint src`: clean. The dev server compiled with no errors, `/products` returns 200.
- The extraction layer and variant logic were run against **all 26 real products** (script, not
  committed):
  - Unit cases for `extractSize` (`500ML`, `500 ml`, `1.5L`, `EU 42`, `Queen`, `KING`, unknown values,
    `constructor`) and `extractColor`.
  - `extractVariantAttributes` on prod_03, prod_08 (option order flipped relative to prod_03),
    prod_14 (extra segment) and prod_20.
  - For **every variant of every product**: each option resolves to exactly one selected value.
  - Across all 60 option combinations of the real catalogue: 59 are `ready` (one per variant) and exactly
    one is `unavailable_combination` (prod_20 `King + Slate`).
  - First-open state of all 26 products: 5 `ready`, 21 `incomplete`. An option is pre-selected if and
    only if it has a single value.
  - Real cases: partial selection reports the missing options by name; `EU 43` on prod_14 resolves to
    `var_14b` although Colour isn't an option; a real out-of-stock variant (`var_01c`) is `ready`.
  - **Simulated corrupted data** (shoes cloned in memory, not real data): no variants, an option with
    no values, an extra `EU 42 - White` variant making `EU 42` ambiguous, and `inventory_quantity` of
    `-1`, `1.5`, `NaN`, `undefined` and `"5"` all give `data_error` with the right reason. A product
    with no options is `ready` with one variant and `data_error` with two. A selected value that doesn't
    exist gives `unavailable_combination`.
- **Not yet verified:** the modal's behaviour in a browser (Escape, backdrop click, focus return,
  scroll lock, phone layout).

---

## Translations (dictionary infrastructure)

Requirement: no hard-coded UI strings in components, and a mechanism that can grow, with no library for now.

- `src/constants/en.dictionary.ts` holds all UI copy, nested by feature (`products.card.quickView`).
  Placeholders are `{name}` (`"Page {page}"`).
- `translate(locale, key, params)` (`utils/i18n.utils.ts`) is a pure function, so server components call
  it directly (layout metadata, home page, Suspense fallback).
- Client components use `useTranslation()` (`hooks/common.hooks.ts`), which returns `t` bound to the
  active locale from `I18nProvider`.
- **Keys are type-checked.** `TranslationKey` is derived from the dictionary, so a typo in
  `t("products.crad.quickView")` is a compile error. Other locales are typed as `TDictionary`
  (same keys, string values), so a missing translation is also a compile error.
- A missing key at runtime (only possible through a cast) returns the key itself, so the gap is visible
  instead of an empty string.
- **What is deliberately not translated:** content from the API (product titles, descriptions, option
  names and values such as "Queen"). That is data, and localising it would come from the backend.
  Currency codes and symbols are also left as they are.
- Removed the raw error text from the load-error message (`Couldn't load products (Request failed
  (500))`), since technical English from a util can't go through the dictionary. The hook now exposes
  `hasError`.

How to add a language: create `<locale>.dictionary.ts` typed as `TDictionary`, add the locale to
`TLocale`, register it in `DICTIONARIES`. `I18nProvider` already holds the locale state.

Known gaps, left out on purpose (not needed for one language):
- No plural rules (`Intl.PluralRules`) yet. Add `_one`/`_other` keys when a count appears in copy.
- `{param}` values aren't type-checked per key.
- Nothing yet sets `<html lang>`/`dir` from a changed locale, detects or persists the locale, or loads
  dictionaries lazily. `I18nProvider` is where that goes.
- **RTL:** ILS suggests a Hebrew storefront is plausible. Layout uses physical utilities (`left-3`,
  `pr-9`, `right-3`) in a few places. Moving to logical ones (`start-3`, `pe-9`, `end-3`) would be needed
  before RTL works.

### Verification

- `tsc --noEmit` and `eslint src`: clean.
- `translate` tested: plain key, single and multiple placeholders, a missing param is kept as `{price}`,
  an invalid key and a branch key both return the key.
- Searched all `.ts`/`.tsx` files for hard-coded copy (text between tags, string `aria-label`/`alt`/
  `placeholder`/`title` attributes, multi-line JSX text): only code identifiers remain.
- `/`, `/products` and `/product/prod_01` return 200. The home page still renders the same text, the
  `<title>` and `<html lang="en">` come through the dictionary.

---

## Stage 3 — Cart and checkout

### Cart

- **State:** `CartProvider` = `useReducer` + context (as agreed). The reducer (`cartReducer`) is a pure
  function in `cart.utils.ts`: `add`, `remove`, `clear`, `hydrate`.
- **A line is a variant.** Adding the same variant again increases its quantity, **never beyond its
  stock** (`maxQuantity` = `inventory_quantity` when added). When the cart already holds all the stock,
  the modal disables Add to Cart and says so.
- **Persistence:** `localStorage` under `youleap.cart.v1`.
  - The first render is always empty, matching the server render. The stored cart is loaded in an
    effect (`isHydrated` flag), and **nothing is saved before that**, otherwise the empty initial
    state would overwrite the stored cart.
  - Stored data is untrusted (user-editable, or from an older version): it is validated with zod and
    **invalid items are dropped individually**, not the whole cart. Duplicates and quantity above stock
    are dropped too. If storage is unavailable (private mode, quota) the cart just isn't persisted.
- **Totals are per currency** (`getCartTotals`), so amounts in different currencies are never added.
  Today there is one currency, so one total.
- **UI:** a sticky header with the cart icon and an item count (sum of quantities, hidden at 0). The drawer
  is a native `<dialog>` (same `BaseDialog` as the Quick View modal: Escape, backdrop click, focus trap
  and focus return). Adding to the cart no longer opens it: the confirmation appears in the
  product modal (see "Add to cart feedback" below). Each line has a remove button. "Checkout" goes to `/checkout`.
- **Hooks live by topic, not by mechanism.** `useCurrency`, `useTranslation` and `useCart` happen to read a React
  context, but that is an implementation detail a reader doesn't care about; each belongs to a different feature with no
  sibling hooks yet, so they sit in `common.hooks.ts` with `useDebounce` (an earlier `context.hooks.ts` grouped them by
  the mechanism and was removed). A feature gets its own file (`cart.hooks.ts`, ...) once it has three related hooks.

### Checkout

- **A page, `/checkout`,** with the form next to an order summary (stacked on phones).
- **Validation: zod + `useCheckoutForm`.** One schema (`checkout.utils.ts`); fields are described in
  `CHECKOUT_FIELDS`, so the form is a loop, not seven copies.
  - **Error messages are dictionary keys** (checked at compile time), translated where displayed.
  - **Errors are derived from the values on every render**, never stored, so they can't go stale. A
    field shows its error after it is left (blur) or after a submit attempt; fixing it clears the error
    immediately.
  - On a failed submit the first invalid field is focused; fields set `aria-invalid` and
    `aria-describedby`. `noValidate` is set so the browser's own bubbles don't compete.
  - Values are trimmed before validating (`"   "` counts as empty).
- **Rules:** name >= 2 chars; email via zod; phone = digits, spaces, `+ ( ) . -` with 7 to 15 digits;
  address, city and country >= 2 (the address minimum was 5, a number I picked with no requirement behind it; a single short word is a legitimate street); **postal code is deliberately generic** (2-10 letters, digits,
  spaces, hyphens) since formats differ too much between countries to pick one without a country list.
- **Success:** "Thank you, {name}! Your order has been placed.", the order summary and a link back to
  the products. The cart is emptied. **No order number, email or "confirmation sent" is shown,
  because nothing is sent or created** (no backend); inventing an order id would be fabricated data.
  The confirmation is kept in page state only, so a reload shows the empty-cart state.
- Visiting `/checkout` with an empty cart shows an empty state with a link to the products.

### Verification (real browser)

Besides `tsc` and `eslint` (clean) and the pure-logic scripts, the whole app was driven in headless
Chromium (Playwright, installed outside the repo; `package.json` is untouched) against **both the dev
server and a production build** (`next build` + `next start` on a separate port from a scratch copy).
**60 of 60 checks pass on each**, covering:

- Grid: 12 cards, symbols on prices, no currency dropdown.
- Modal: nothing pre-selected, "Select Color", starting price, disabled button; Black gives ₪299.00 and
  In stock; Navy Blue gives ₪319.00 and Out of stock with a disabled button; gallery; closes with
  Escape, backdrop and the close button; clicking inside doesn't close it; scroll lock on and off;
  focus returns to the Quick View button.
- Cart: add opens the drawer; the same variant merges (Qty 2, total ₪598.00); stock cap (12 White, then
  disabled with the message); badge counts; persistence across reload and the stored JSON; remove.
- Checkout: nothing shown before interacting; empty submit gives 7 errors and focus on the first;
  `aria-invalid`/`aria-describedby`; invalid email and phone; errors clear as they're fixed; success
  message and summary; cart emptied and storage reset to `[]`; empty state after reload.
- `prod_20`: `King + Slate` shows the unavailable message with no price or stock; picking Oatmeal
  recovers.
- Search: URL updates after the debounce; the input keeps its value while loading; collection filter
  pushes history, and back/forward restore and re-apply it; page 3 has 2 cards and Next is disabled;
  filter resets the page; Clear filters; `?page=abc&q=zzzz` shows the empty state.
- 375px wide: no horizontal overflow on the grid, modal, cart drawer or checkout; the modal stays inside
  the viewport and the drawer fills the width.
- Console: only a `/favicon.ico` 404 (the starter has no favicon). The earlier Next.js LCP warning is gone.

### Surprises

- **Dev server only:** with `next dev` (Turbopack), pressing Back to return to a page across a *full*
  page load shows the server-rendered HTML but React doesn't hydrate (the grid stays on its loading
  state until a reload). It reproduces on the home page too, which contains none of our logic, and
  **does not happen in the production build** (verified on both). Client-side back/forward (the app's own
  history entries) works in both. Treated as a dev-server issue; nothing to fix in the app.
- **Search uses `replace`, filters and pages use `push`.** Typing doesn't fill the history, so Back goes
  to the last filter or page change, not to every keystroke. I first wrote a test that expected the
  opposite; the behaviour is as designed.
- `next build` passes (`/`, `/products`, `/checkout` static; API routes and `/product/[id]` dynamic).

---

## Polish pass (after reviewing Stages 1-3 in the browser)

Each item was first reproduced and measured, then fixed.

- **Page jumped while `/products` loaded.** Measured on a throttled phone: for ~600ms the page was the
  title and filters over an empty area, then all 12 cards appeared at once (page height 629px to
  5341px), then images popped in one by one. Fixes:
  - The `Suspense` fallback is now the page's own shape (title, filter placeholders, 12 skeleton
    cards) instead of the word "Loading...", so it is what the visitor sees from the first paint.
  - On the first load (nothing to show yet) the grid shows skeleton cards instead of an empty grid under
    a spinner. When results already exist and are being refreshed, the old results stay under the
    overlay as before.
  - Skeletons reuse the real components' classes, and the card image sits on a grey box.
  - **A layout bug of mine surfaced by this:** making `body` a flex column (Stage 3, for the header)
    made `<main className="mx-auto ...">` shrink to its content width, so the skeleton was narrower than
    the loaded page (54px side margins instead of 24px) and the width jumped. Fixed with `w-full` on every
    page `main`. Layout shift measured during the navigation went from 0.042 to 0.000.
  - Also restored the gap above "Quick View", which had been lost when I changed `mt-3` to `mt-auto`.
  - Remaining difference: a real card can be taller than its skeleton when the title wraps to two lines.
- **Pagination scroll.** Going *forward* (Next, or a higher page number) scrolls to the top; going *back* (Prev, or a lower
  page number) leaves the page where it is; the browser's Back/Forward restore the previous position. Measured at desktop
  and phone sizes on both a fresh dev server and a production build.
  - Next.js's own `router.push(..., { scroll: true })` was tried first and is **not reliable**: on the dev server Prev also
    jumped to the top, while on a production build a forward page number did not scroll at all.
  - Scrolling inside the click handler (`window.scrollTo(0)`) was also tried and breaks Back, because it runs before the
    history entry records the current position, so Back returned to the top.
  - Final approach: the click records whether the move is forward; an effect on `query.page` scrolls to the top after the page
    change has been committed. Back/Forward never set the flag, so the browser's own restoration stays untouched. Search and
    filters still never move the page.
- **Quick View image.** The main image shows a pulsing placeholder with a spinner until it has loaded and
  then fades in; thumbnails sit on a grey box; a failed image shows "Image unavailable" instead of
  an endless spinner. Verified with the image requests delayed and with them aborted. (Uncached, the image
  loaded in ~300ms here; the 3 seconds seen in the browser is the remote image host plus Next's image
  optimiser, which the loading state covers rather than removes.)
- **Street address.** The minimum is now 2 characters (see Checkout). In the real form `gfgfg` (5
  characters) was already accepted and `gfgf` (4) rejected; the only field that rejects `gfgfg` is Phone.

### Verification

`tsc`, `eslint` and `next build` are clean. The browser suite now has **73 checks**, and all pass on a
production build and on a freshly started dev server. New checks: first-load skeleton (12 cards, no
overlay, announced to screen readers), no movement of the grid between skeleton and loaded page, full-width
`main`, Next goes to the top, Back keeps the position, the three street-address cases, and the image
spinner, fade-in and error state.

### Dev-server note

While verifying, the long-running `next dev` on port 3000 kept serving stale server-rendered HTML for
files edited during the session (old `main` classes), so the browser reported a hydration mismatch
(`+ className="mx-auto w-full ..."` vs `- className="mx-auto ..."`). Touching the files did not help. A fresh
dev server and the production build show no mismatch, so the code is consistent; the fix is to restart
`pnpm dev`.

---

## Add to cart feedback

Problem found in use: after Add to Cart the cart drawer opened over everything, and closing it left no sign
that the item had been added unless the header (then not sticky) happened to be in view.

Researched current practice first. The consistent guidance: confirm in context, show *what* was added (a bare
toast loses trust), and offer both ways forward with unambiguous labels; avoid full-screen takeovers on mobile;
announce the confirmation through a live region without moving focus unexpectedly. Sources: Baymard's
"Added to Cart confirmation" research (https://baymard.com/ecommerce-design-examples/added-to-cart-confirmation),
Ryviu mini-cart UX (https://www.ryviu.com/blog/mini-cart-ux; the 2-8% mobile conversion figure is that
vendor's claim, treated as indicative), and the WCAG 4.1.3 status-message guidance
(https://www.accessitree.com/wcag-ultimate-guide/make-status-messages-announceable-by-assistive-technologies/).

What was built:

- **Add to Cart keeps you in the product modal.** The button is replaced *in place* by a confirmation panel, so
  it is always on screen, even in a tall modal on a phone: "Added to your cart", the item that was added
  (thumbnail, product, variant, quantity in the cart, price), and two buttons, **View cart** (primary) and
  **Continue shopping** (secondary).
  - *View cart* closes the modal and opens the cart drawer. *Continue shopping* closes the modal.
  - The drawer no longer opens by itself. The header icon still opens it.
  - Changing the selection clears the confirmation and brings Add to Cart back, so several variants can be
    added in one visit. Returning to the same variant shows the button, not a stale confirmation.
- **Accessibility.** A `role="status"` region is always in the DOM and receives "{product} added to your
  cart", so it is announced. Focus moves to "View cart" because the focused Add button has just been replaced.
- **Sticky header.** This was the underlying cause of the complaint: the cart count scrolled out of view. It now
  stays visible, and the badge does a short pulse when the count changes (not on the initial load of a stored
  cart, and not for users who prefer reduced motion).
- **Left out on purpose:** "In cart" badges on product cards (Baymard notes most sites don't, but it goes beyond
  the README) and auto-dismissing toasts (no item details, a known accessibility failure).
- Known limit: to add *more of the same variant*, the shopper changes the selection and back (the drawer's line
  has no quantity stepper, see Tradeoffs).

### Verification

`tsc` and `eslint` clean. The browser suite is now **87 checks, all passing on a production build and on a freshly
started dev server**. New or changed checks: the add stays in the modal and no drawer opens; the panel shows
product, variant, quantity and price; Add to Cart is replaced by View cart + Continue shopping; focus moves to
View cart; the live region text; the badge shows 1 and pulses; changing the selection (and returning) restores the
Add button; adding again merges to Qty 2; View cart closes the modal and opens the drawer (Qty 2, total
₪598.00); Continue shopping closes the modal without opening the drawer; no badge pulse when a stored cart loads;
the header stays at the top (and the badge visible) when scrolled 1500px; at 375px the confirmation fits, both
buttons are visible and nothing overflows horizontally.

One test mistake worth recording: Playwright's `getByRole("heading", { name })` is a case-insensitive *substring*
match, so "Your cart" also matched "Added to your cart"; exact matching is needed where titles overlap.

---

## Code conventions (applied across `src/`)

Set by the product owner; applied to every file in one pass, then re-verified (tsc, eslint, `next build`, and the
full browser suite on a production build and a fresh dev server).

- **No default exports.** Every export is a plain named export, so an import can't be renamed by accident.
  Exception: Next.js requires `export default` in route files, so `page.tsx` and `layout.tsx` under
  `src/app/` (5 files) keep it. They are thin and only compose named components.
- **Comments only for *why*, never *what*.** Kept: a workaround or non-obvious constraint (why saving waits for
  hydration, why `inert`, why `noValidate`, why a `catch` is empty, why a regex is generic, why the API can't be
  trusted to validate), and short worked examples in utils whose behaviour is hard to see at a glance
  (`extractSize`, `extractVariantAttributes`, `getPageItems`, `formatPrice`, `translate`, `formatList`,
  `serializeProductsQuery`). Removed: everything that restated the code, history, and how-to notes (those
  live here).
- **Props types:** a props type that isn't exported is declared in its component's file and named `TProps`
  (components that typed props inline now use the same form, so they all look alike). Types used by more than one
  file stay in `types/`.
- **Every type name has a `T` prefix** (`TCartItem`, `TCheckoutValues`, `TTranslationKey`, local helpers such as `TUpdateOptions`
  included), so a type is recognisable at a glance. 29 types were renamed (189 occurrences in 39 files); `tsc`, `eslint`,
  `next build` and the browser suite (87 checks) pass unchanged, since the change is type-only.
  **The one exception is `src/types/product.ts`** (`Product`, `Price`, `ProductVariant`, `ProductOption`, `ProductImage`,
  `ProductTag`, `ProductCollection`, `ProductsResponse`, `ProductResponse`): the task README forbids modifying that file, so
  its names are unprefixed. Prefixing them would mean aliasing them in a new file; left as is.

Verification: 87 of 87 browser checks pass on both servers. The throwaway scripts for earlier stages
(`extractVariantAttributes`/variant selection, cart/checkout logic) were re-run: those that call code removed in
earlier stages, or that encode the old 5-character address rule, fail by design and were not updated; the current
variant-status script passes.
