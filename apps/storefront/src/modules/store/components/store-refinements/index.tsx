"use client"

import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
} from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

const StoreRefinements = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <aside className="mb-8 flex flex-col gap-6 rounded-xl border border-ui-border-base bg-[#f7f7f5] p-5 small:w-[220px] small:shrink-0">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ui-fg-base">
        Filters
      </h2>
      <CurrentRefinements currencyCode={currencyCode} />
      <OptionRefinements />
      <PriceRange currencyCode={currencyCode} />
      <OnSaleToggle currencyCode={currencyCode} />
      <RefinementGroup attribute={CATEGORY_ATTRIBUTE} title="Category" />
      <RefinementGroup attribute={LABELS_ATTRIBUTE} title="Labels" />
    </aside>
  )
}

export default StoreRefinements
