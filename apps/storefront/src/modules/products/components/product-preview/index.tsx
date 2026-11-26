import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={product.title}
          size="full"
          imageFit="contain"
          isFeatured={isFeatured}
        />
        <div className="mt-4 flex min-h-16 flex-col gap-y-1">
          <Text
            className="line-clamp-2 font-medium text-ui-fg-base"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="text-small-regular text-ui-fg-muted">
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <Text className="text-ui-fg-muted">Pricing on request</Text>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
