"use client";

import Link from "next/link";
import { IoIosMenu } from "react-icons/io";
import { useRef } from "react";
import NavMenu from "@ui/nav/nav-menu";
import { useElementHeight } from "@ui/hooks";
import AccountMenu from "@ui/nav/account-menu";
import { CategoryDropDown } from "@ui/shifting-dropdown";
import SearchOverlay from "@ui/search/search-overlay";
import CartOverlay from "@ui/cart/cart-overlay";
import { CiSearch } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { useUIStateContext } from "@ui/contexts";
import logo from "@ui/logo";
import showToast from "@ui/toast";
import { useCart } from "@lib/hooks";

export default function Header() {
  const ref = useRef<HTMLElement | null>(null);
  const {
    cart: { quantity },
    isLoading,
  } = useCart();
  const { state, setState } = useUIStateContext();

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
        <div className="mx-4 flex w-full items-center justify-between pb-3 pt-4 md:mx-16 md:pb-4 md:pt-7">
          <div className="hidden max-w-[27rem] flex-1 gap-2 lg:flex lg:items-center">
            <CategoryDropDown />
          </div>

          <Link className="h-6 select-none" href="/" title="Velvo">
            {logo}
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
                onClick={() => {
                  if (quantity > 0) setState("isCartOpen", true);
                  else if (isLoading) showToast("Loading cart...", "warning");
                  else showToast("Your shopping cart is empty.", "warning");
                }}
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
        </div>
      </header>
    </>
  );
}
