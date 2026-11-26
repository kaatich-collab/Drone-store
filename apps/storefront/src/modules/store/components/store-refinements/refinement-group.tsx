"use client"

import clsx from "clsx"
import { useRefinementList } from "react-instantsearch"

type RefinementGroupProps = {
  attribute: string
  title: string
}

const RefinementGroup = ({ attribute, title }: RefinementGroupProps) => {
  const { items, refine } = useRefinementList({
    attribute,
    limit: 20,
    sortBy: ["count:desc", "name:asc"],
  })

  if (!items.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ui-fg-muted">
        {title}
      </span>
      <ul className="flex flex-col gap-y-1">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex cursor-pointer items-center justify-between gap-x-3 rounded-md px-2 py-2 transition-colors hover:bg-white">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="h-4 w-4 shrink-0 accent-black"
                data-testid={`refinement-${attribute}`}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={clsx("text-small-regular break-words", {
                    "font-medium text-ui-fg-base": item.isRefined,
                    "text-ui-fg-subtle": !item.isRefined,
                  })}
                >
                  {item.label}
                </span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-ui-fg-muted">
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RefinementGroup
