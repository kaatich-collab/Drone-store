import React, { Suspense } from "react"

import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const hasPrice = product.variants?.some(
    (variant) =>
      typeof variant.calculated_price?.calculated_amount === "number"
  )

  return (
    <>
      <div
        className="content-container py-8 lg:py-12"
        data-testid="product-container"
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12">
          <VariantImageGallery product={product} />
          <div className="flex flex-col gap-y-7 lg:sticky lg:top-28 lg:self-start">
            <ProductInfo product={product} />
            {hasPrice ? (
              <ProductActions product={product} region={region} />
            ) : (
              <div className="flex flex-col gap-y-3 border-y border-ui-border-base py-5">
                <p className="text-lg font-medium">Pricing on request</p>
                <p className="text-sm leading-6 text-ui-fg-subtle">
                  Contact our sales team to discuss pricing and configuration.
                </p>
                <LocalizedClientLink
                  href={`/contact?product=${encodeURIComponent(product.handle)}`}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Request a quote
                </LocalizedClientLink>
              </div>
            )}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
