"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/common.hooks"
import type { ProductImage } from "@/types/product"

type TProps = { images: ProductImage[]; title: string }

type TImageStatus = "loaded" | "error"

export function ProductImageGallery({ images, title }: TProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  // No entry for a url means it is still loading.
  const [statuses, setStatuses] = useState<Record<string, TImageStatus>>({})
  const active = images[activeIndex]
  if (!active) return null

  const status = statuses[active.url]
  const setStatus = (url: string, next: TImageStatus) =>
    setStatuses((current) => ({ ...current, [url]: next }))

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {/* Keyed by url so switching images starts a fresh load. */}
        <Image
          key={active.url}
          src={active.url}
          alt={t("quickView.gallery.imageAlt", {
            title,
            current: activeIndex + 1,
            total: images.length,
          })}
          fill
          sizes="(min-width: 768px) 400px, 100vw"
          className={`object-cover transition-opacity duration-300 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          priority
          onLoad={() => setStatus(active.url, "loaded")}
          onError={() => setStatus(active.url, "error")}
        />
        {status === undefined && (
          <div
            role="status"
            className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-200"
          >
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" aria-hidden />
            <span className="sr-only">{t("quickView.gallery.loading")}</span>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
            <ImageOff className="h-8 w-8" aria-hidden />
            <span className="text-sm">{t("quickView.gallery.error")}</span>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={t("quickView.gallery.showImage", { number: index + 1 })}
                aria-current={index === activeIndex}
                className={`relative block h-16 w-16 overflow-hidden rounded-md border-2 bg-gray-200 ${
                  index === activeIndex ? "border-black" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
