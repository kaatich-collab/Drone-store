import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#171916] text-white small:min-h-[680px]">
      <Image
        src="/images/products/griflion-m8.png"
        alt="Griflion M8 unmanned aircraft"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="content-container relative z-10 flex min-h-[560px] items-center py-20 small:min-h-[680px]">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/70">
            Unmanned aircraft · payloads · ground systems
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] tracking-tight small:text-7xl">
            Built for the
            <br />
            work that matters.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/80 small:text-lg">
            Explore aircraft, payloads, and mission equipment from the supplied
            product catalog. Technical details and pricing are available on
            request.
          </p>
          <LocalizedClientLink
            href="/store"
            className="mt-9 inline-flex h-12 items-center bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Explore the catalog
          </LocalizedClientLink>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden text-right text-xs uppercase tracking-[0.2em] text-white/70 small:block">
        <span>Griflion M8</span>
        <br />
        <span>VTOL platform</span>
      </div>
    </section>
  )
}

export default Hero
