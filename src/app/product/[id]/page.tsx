import { DEFAULT_LOCALE } from "@/constants/i18n.constants"
import { translate } from "@/utils/i18n.utils"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main>
      <h1>{translate(DEFAULT_LOCALE, "productPage.title", { id })}</h1>
    </main>
  )
}
