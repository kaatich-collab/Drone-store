import { Metadata } from "next"

import { STORE_NAME } from "@lib/util/site"
import { PolicyPage } from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Contact",
  description: `How to contact ${STORE_NAME}.`,
}

export default async function ContactPage(props: {
  searchParams: Promise<{ product?: string }>
}) {
  const { product } = await props.searchParams
  const salesEmail = process.env.NEXT_PUBLIC_SALES_EMAIL?.trim()
  const subject = product
    ? `Quote request: ${product}`
    : "Product quote request"

  return (
    <PolicyPage title="Contact">
      <p>
        Contact {STORE_NAME} for product availability, configurations, and
        pricing{product ? ` for ${product}` : ""}.
      </p>
      {salesEmail ? (
        <p>
          <a
            className="underline underline-offset-4"
            href={`mailto:${salesEmail}?subject=${encodeURIComponent(subject)}`}
          >
            Email our sales team
          </a>
        </p>
      ) : (
        <p className="text-ui-fg-subtle">
          The sales email is not configured yet. Set NEXT_PUBLIC_SALES_EMAIL in
          the storefront environment to enable quote requests.
        </p>
      )}
    </PolicyPage>
  )
}
