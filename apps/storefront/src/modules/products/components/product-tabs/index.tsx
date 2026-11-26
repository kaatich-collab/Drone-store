"use client"

import { HttpTypes } from "@medusajs/types"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const getSpecifications = (product: HttpTypes.StoreProduct) => {
  const rawSpecifications = product.metadata?.specifications

  if (!Array.isArray(rawSpecifications)) {
    return []
  }

  return rawSpecifications.flatMap((specification) => {
    if (
      !isRecord(specification) ||
      typeof specification.name !== "string" ||
      typeof specification.value !== "string"
    ) {
      return []
    }

    return [{ name: specification.name, value: specification.value }]
  })
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const specifications = getSpecifications(product)
  const brand =
    typeof product.metadata?.brand === "string"
      ? product.metadata.brand
      : product.subtitle
  const category =
    typeof product.metadata?.catalog_category === "string"
      ? product.metadata.catalog_category
      : null
  const sourceDocument =
    typeof product.metadata?.source_document === "string"
      ? product.metadata.source_document
      : null

  return (
    <div className="w-full">
      <Accordion type="multiple">
        <Accordion.Item
          title="Technical specifications"
          headingSize="medium"
          value="technical-specifications"
        >
          <div className="py-6">
            {specifications.length ? (
              <table className="w-full text-left text-sm">
                <tbody>
                  {specifications.map((specification) => (
                    <tr
                      key={specification.name}
                      className="border-b border-ui-border-base last:border-0"
                    >
                      <th className="py-3 pr-6 font-medium text-ui-fg-subtle">
                        {specification.name}
                      </th>
                      <td className="py-3 text-ui-fg-base">
                        {specification.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-ui-fg-subtle">
                Contact us for the available technical documentation.
              </p>
            )}
          </div>
        </Accordion.Item>
        <Accordion.Item
          title="Catalog details"
          headingSize="medium"
          value="catalog-details"
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 text-sm">
            {brand && (
              <div>
                <dt className="font-medium">Brand</dt>
                <dd className="mt-1 text-ui-fg-subtle">{brand}</dd>
              </div>
            )}
            {category && (
              <div>
                <dt className="font-medium">Category</dt>
                <dd className="mt-1 text-ui-fg-subtle">{category}</dd>
              </div>
            )}
            {sourceDocument && (
              <div className="col-span-2">
                <dt className="font-medium">Source document</dt>
                <dd className="mt-1 break-words text-ui-fg-subtle">
                  {sourceDocument}
                </dd>
              </div>
            )}
          </dl>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default ProductTabs
