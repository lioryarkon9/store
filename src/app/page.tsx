import Link from "next/link"
import { DEFAULT_LOCALE } from "@/constants/i18n.constants"
import { translate } from "@/utils/i18n.utils"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">{translate(DEFAULT_LOCALE, "home.title")}</h1>
      <p className="text-gray-600 mb-8">{translate(DEFAULT_LOCALE, "home.subtitle")}</p>
      <Link
        href="/products"
        className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 transition-colors"
      >
        {translate(DEFAULT_LOCALE, "home.browse")}
      </Link>
    </main>
  )
}
