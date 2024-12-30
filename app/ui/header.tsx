"use client";

import Link from "next/link";
import { IoIosMenu } from "react-icons/io";
import { useRef } from "react";
import NavMenu from "@ui/nav/nav-menu";
import { useElementHeight } from "@ui/hooks/height";
import AccountMenu from "@ui/nav/account-menu";
import Image from "next/image";
import { CategoryDropDown } from "@ui/shifting-dropdown";
import SearchOverlay from "@ui/search/search-overlay";
import CartOverlay from "@ui/cart/cart-overlay";
import { CiSearch } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { useCartContext } from "@ui/context/cart";
import { useUIState } from "@ui/context/state";

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);
  const { quantity } = useCartContext();
  const { state, setState } = useUIState();

  useElementHeight(ref);

  return (
    <>
      {state.isMenuOpen && <NavMenu />}
      {state.isSearchOpen && <SearchOverlay />}
      {state.isCartOpen && <CartOverlay />}
      <header
        ref={ref}
        id="header"
        className="space-right fixed left-0 right-0 top-0 z-20 flex justify-center border-b bg-white/80 backdrop-blur"
      >
        <nav className="mx-8 flex w-full items-center justify-between pb-3 pt-4 md:mx-20 md:pb-4 md:pt-7">
          <div className="hidden max-w-[27rem] flex-1 gap-2 lg:flex lg:items-center">
            <CategoryDropDown />
          </div>

          <Link
            className="select-none text-2xl font-bold"
            href="/"
            title="StyleWave"
          >
            <Image
              src="/logo-text.svg"
              alt="StyleWave"
              width={132}
              height={23}
              priority
            />
          </Link>

          <div className="flex items-center justify-end gap-5 text-base lg:max-w-[27rem] lg:flex-1 lg:gap-10">
            <CiSearch
              className="cursor-pointer text-[22px] md:text-2xl"
              onClick={() => setState("isSearchOpen", true)}
              title="Search"
            />
            <AccountMenu />
            <span className="relative">
              <GiShoppingCart
                className="cursor-pointer text-[22px] md:text-2xl"
                onClick={() => setState("isCartOpen", true)}
                title="Cart"
              />
              {quantity > 0 && (
                <span className="pointer-events-none absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border bg-white text-xs text-black">
                  {quantity}
                </span>
              )}
            </span>
            <IoIosMenu
              className="block cursor-pointer text-[22px] md:text-2xl lg:hidden"
              onClick={() => setState("isMenuOpen", true)}
            />
          </div>
        </nav>
      </header>
    </>
  );
}
