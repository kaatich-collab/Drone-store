import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-small-regular uppercase tracking-[0.12em] text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        {product.subtitle && (
          <p className="text-small-regular uppercase tracking-[0.14em] text-ui-fg-muted">
            {product.subtitle}
          </p>
        )}
        <Heading
          level="h1"
          className="text-3xl font-medium leading-tight tracking-tight text-ui-fg-base md:text-4xl"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-base leading-7 text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
