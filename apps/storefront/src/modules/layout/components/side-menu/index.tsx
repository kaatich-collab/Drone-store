"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"


const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative flex h-full items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200 hover:text-ui-fg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-base focus-visible:ring-offset-4"
                >
                  <span aria-hidden="true" className="flex w-4 flex-col gap-[4px]">
                    <span className="h-px w-full bg-current" />
                    <span className="h-px w-full bg-current" />
                    <span className="h-px w-full bg-current" />
                  </span>
                  <span>Menu</span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-[2px]"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="fixed inset-y-4 left-4 z-[51] flex w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111713] text-sm text-white shadow-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                          Aerial Systems
                        </p>
                        <p className="mt-1 text-xs text-white/55">Navigation</p>
                      </div>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Close menu"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <XMark />
                      </button>
                    </div>
                    <div className="px-6 pt-8">
                      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        Explore
                      </p>
                      <ul className="flex flex-col divide-y divide-white/10">
                        {Object.entries(SideMenuItems).map(([name, href], index) => {
                        return (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="group flex items-center justify-between py-4 text-white/80 transition-colors hover:text-white"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span className="flex items-baseline gap-4">
                                <span className="text-[10px] tabular-nums text-white/35">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-2xl font-light tracking-tight">
                                  {name}
                                </span>
                              </span>
                              <ArrowRightMini className="text-white/40 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                            </LocalizedClientLink>
                          </li>
                        )
                        })}
                      </ul>
                    </div>
                    <div className="mt-auto flex flex-col gap-y-3 border-t border-white/10 px-6 py-5">
                      {!!locales?.length && (
                        <div
                          className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 transition-colors hover:bg-white/5"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 transition-colors hover:bg-white/5"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="pt-2 text-[10px] text-white/45">
                        © {new Date().getFullYear()} Aerial Systems. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
