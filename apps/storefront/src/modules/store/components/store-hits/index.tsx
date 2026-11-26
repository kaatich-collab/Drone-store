"use client"

import type { Hit } from "instantsearch.js"
import { useEffect, useRef } from "react"
import {
  useHits,
  useInstantSearch,
  useSortBy,
  useStats,
} from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import { priceAttribute } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { getSortOptions } from "@modules/store/components/store-refinements/attributes"
import SearchPagination from "./pagination"
import HitPrice, { HitPricing } from "./price"
import StoreSearchBox from "../store-search-box"

type ProductHit = Hit<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & HitPricing
>

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
}

const StoreHits = ({ hitsPerPage, currencyCode }: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  const { status, error, indexUiState } = useInstantSearch()
  const sortOptions = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items: sortOptions })
  const { nbHits } = useStats()
  const { isSearching, hasNoResultsYet } = useSearchSettled()

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)

  const settled = useRef({ page: currentPage, refinementKey })

  useEffect(() => {
    if (!isSearching) {
      settled.current = { page: currentPage, refinementKey }
    }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly =
    refinementKey === settled.current.refinementKey &&
    currentPage !== settled.current.page

  const showSkeleton = hasNoResultsYet || (isSearching && isPagingOnly)

  if (status === "error") {
    return (
      <Text
        className="py-16 text-center text-ui-fg-error"
        data-testid="products-error"
      >
        Couldn&apos;t load products
        {error?.message ? `: ${error.message}` : "."}
      </Text>
    )
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <StoreSearchBox />
        <label className="flex min-h-12 items-center justify-between gap-4 rounded-md border border-ui-border-base px-4 md:min-w-64">
          <span className="text-small-regular text-ui-fg-muted">Sort by</span>
          <select
            aria-label="Sort products"
            className="min-w-0 flex-1 bg-transparent py-3 text-small-regular text-ui-fg-base outline-none"
            data-testid="sort-by-select"
            value={currentRefinement}
            onChange={(event) => refine(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-small-regular text-ui-fg-muted">
        {nbHits} {nbHits === 1 ? "product" : "products"}
      </p>
      {showSkeleton ? (
        <SkeletonProductGrid numberOfProducts={hitsPerPage} />
      ) : !items.length ? (
        <Text
          className="py-16 text-center text-ui-fg-subtle"
          data-testid="no-products"
        >
          No products matched these filters.
        </Text>
      ) : (
        <ul
          className="grid w-full grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-3 medium:grid-cols-4"
          data-testid="products-list"
        >
          {items.map((hit) =>
            hit.handle ? (
              <li key={hit.objectID}>
                <LocalizedClientLink
                  href={`/products/${hit.handle}`}
                  className="group block"
                >
                  <div data-testid="product-wrapper">
                    <Thumbnail
                      thumbnail={hit.thumbnail}
                      size="full"
                      imageFit="contain"
                    />
                    <div className="mt-4 flex min-h-16 flex-col gap-y-1">
                      <Text
                        className="line-clamp-2 font-medium text-ui-fg-base"
                        data-testid="product-title"
                      >
                        {hit.title}
                      </Text>
                      {typeof hit[
                        priceAttribute("min_price", currencyCode)
                      ] !== "number" ? (
                        <Text className="text-small-regular text-ui-fg-muted">
                          Pricing on request
                        </Text>
                      ) : (
                        <HitPrice hit={hit} currencyCode={currencyCode} />
                      )}
                    </div>
                  </div>
                </LocalizedClientLink>
              </li>
            ) : null
          )}
        </ul>
      )}
      <SearchPagination />
    </>
  )
}

export default StoreHits
