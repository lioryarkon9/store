import { Inter } from "next/font/google"
import { CartProvider } from "@/components/CartProvider"
import { CurrencyProvider } from "@/components/CurrencyProvider"
import { Header } from "@/components/Header"
import { I18nProvider } from "@/components/I18nProvider"
import { DEFAULT_LOCALE } from "@/constants/i18n.constants"
import { translate } from "@/utils/i18n.utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: translate(DEFAULT_LOCALE, "meta.title"),
  description: translate(DEFAULT_LOCALE, "meta.description"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={DEFAULT_LOCALE} className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <I18nProvider>
          <CurrencyProvider>
            <CartProvider>
              <Header />
              {children}
            </CartProvider>
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
