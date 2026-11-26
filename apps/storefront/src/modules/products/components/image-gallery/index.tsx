"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  alt: string
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [selectedImageId, setSelectedImageId] = useState(images[0]?.id)
  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0]

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ui-border-base bg-[#f6f6f3]">
        {selectedImage?.url ? (
          <Image
            src={selectedImage.url}
            priority
            className="object-contain p-6 md:p-10"
            alt={alt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ui-fg-muted">
            Product image coming soon
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImageId(image.id)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={image.id === selectedImage?.id}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-[#f6f6f3] p-2 transition-colors ${
                image.id === selectedImage?.id
                  ? "border-ui-fg-base"
                  : "border-ui-border-base hover:border-ui-fg-muted"
              }`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
