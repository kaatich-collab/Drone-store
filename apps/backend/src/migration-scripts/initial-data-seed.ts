import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import droneCatalog from "../data/drone-catalog.json"

const DEMO_PRODUCT_HANDLES = new Set([
  "t-shirt",
  "sweatshirt",
  "sweatpants",
  "shorts",
])

const DEMO_CATEGORY_NAMES = new Set([
  "Shirts",
  "Sweatshirts",
  "Pants",
  "Merch",
])

export default async function seedBrochureCatalog({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const [{ data: salesChannels }, { data: shippingProfiles }] =
    await Promise.all([
      query.graph({
        entity: "sales_channel",
        fields: ["id", "is_disabled"],
      }),
      query.graph({
        entity: "shipping_profile",
        fields: ["id"],
      }),
    ])

  const activeSalesChannels = salesChannels.filter(
    (salesChannel) => !salesChannel.is_disabled
  )
  const shippingProfile = shippingProfiles[0]

  if (!activeSalesChannels.length || !shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Medusa store setup is incomplete. Create a sales channel and shipping profile before seeding the catalog."
    )
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })

  const demoProductIds = existingProducts
    .filter((product) => product.handle && DEMO_PRODUCT_HANDLES.has(product.handle))
    .map((product) => product.id)

  if (demoProductIds.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demoProductIds },
    })
    logger.info(`Removed ${demoProductIds.length} starter apparel products.`)
  }

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })

  const demoCategoryIds = existingCategories
    .filter((category) => DEMO_CATEGORY_NAMES.has(category.name))
    .map((category) => category.id)

  if (demoCategoryIds.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: demoCategoryIds,
    })
    logger.info(`Removed ${demoCategoryIds.length} unused apparel categories.`)
  }

  const { data: catalogCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const catalogCategoryNames = [
    ...new Set(droneCatalog.map((product) => product.category)),
  ]
  const existingCategoryNames = new Set(
    catalogCategories.map((category) => category.name)
  )
  const missingCategoryNames = catalogCategoryNames.filter(
    (name) => !existingCategoryNames.has(name)
  )

  if (missingCategoryNames.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategoryNames.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
  }

  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const categoryIds = new Map(
    allCategories.map((category) => [category.name, category.id])
  )
  const existingHandles = new Set(
    existingProducts
      .filter(
        (product) =>
          product.handle && !DEMO_PRODUCT_HANDLES.has(product.handle)
      )
      .map((product) => product.handle)
  )
  const productsToCreate = droneCatalog.filter(
    (product) => !existingHandles.has(product.slug)
  )

  if (!productsToCreate.length) {
    logger.info("Brochure catalog is already seeded.")
    return
  }

  await createProductsWorkflow(container).run({
    input: {
      products: productsToCreate.map((product) => {
        const categoryId = categoryIds.get(product.category)

        if (!categoryId) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Missing Medusa category for ${product.category}.`
          )
        }

        return {
          title: product.name,
          handle: product.slug,
          subtitle: product.brand,
          description: product.description,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          category_ids: [categoryId],
          thumbnail: product.imageUrl || undefined,
          images: product.imageUrl ? [{ url: product.imageUrl }] : [],
          metadata: {
            brand: product.brand,
            catalog_category: product.category,
            source_document: product.sourceDocument,
            pricing_on_request: true,
            model_url: product.modelUrl || null,
            specifications: product.specifications,
          },
          options: [
            {
              title: "Configuration",
              values: ["Standard"],
            },
          ],
          variants: [
            {
              title: "Standard",
              sku: `DRONE-${product.slug.toUpperCase()}`,
              manage_inventory: false,
              options: {
                Configuration: "Standard",
              },
            },
          ],
          sales_channels: activeSalesChannels.map(({ id }) => ({ id })),
        }
      }),
    },
  })

  logger.info(
    `Seeded ${productsToCreate.length} brochure products without fabricated prices or stock.`
  )
}
