"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiSearch, CiUser } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import Logo from "@ui/logo";
import { navLinks } from "@ui/data/constants";
import { useRef, useState } from "react";
import Menu from "@ui/menu";
import useOverflow from "@ui/hooks/overflow";
import { useElementHeight } from "@ui/hooks/height";
// import CartOverlay from "@ui/cart/cart-overlay";
import useDeviceType from "@ui/hooks/device-type";
import AccountMenu from "@/ui/nav/account-menu";
import useHideMenu from "@ui/hooks/hide-menu";
import CartSummary from "./nav/cart";

export default function Header() {
  const pathname = usePathname();
  const deviceType = useDeviceType();
  const ref = useRef<HTMLElement>(null);
  const [isShowAccount, setIsShowAccount] = useState<boolean>(false);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  useOverflow(isShowMenu);
  useElementHeight(ref);
  useHideMenu(isShowAccount, setIsShowAccount);

  return (
    <>
      {isShowMenu && <Menu setIsShowMenu={setIsShowMenu} />}
      <header
        ref={ref}
        className="fixed left-0 right-0 top-0 z-20 flex justify-center bg-white/80 backdrop-blur"
      >
        <nav className="mx-8 flex w-full items-center justify-between pb-1 pt-5 md:mx-20 md:pb-3 md:pt-8">
          {/* Left */}
          <div className="hidden max-w-[28rem] flex-1 lg:flex lg:items-center lg:justify-between">
            <Link className="text-2xl font-bold" href="/">
              StyleWave
            </Link>
            {navLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                className={`rounded-md border px-4 py-1 text-sm ${pathname === href ? "bg-stone-100" : "border-transparent transition-all duration-300 hover:border-inherit hover:bg-stone-100"}`}
              >
                <span className="hidden font-medium md:block">{name}</span>
              </Link>
            ))}
          </div>

          <Logo />

          {/* Right */}
          <div className="flex items-center justify-end gap-5 text-base lg:max-w-[28rem] lg:flex-1 lg:gap-10">
            <CiSearch
              className="cursor-pointer text-[22px] md:text-2xl"
              // todo: search
              // onClick={() => console.log("hello")}
            />
            <div
              className="relative flex items-center"
              onMouseEnter={() => setIsShowAccount(true)}
              onMouseLeave={() => setIsShowAccount(false)}
              onClick={() => {
                if (deviceType !== "desktop") {
                  setIsShowAccount(true);
                }
              }}
            >
              {/* todo: check sign in */}
              <Link href="/user/account" aria-label="user account">
                <CiUser className="cursor-pointer text-[22px] md:text-2xl" />
              </Link>
              {isShowAccount && <AccountMenu />}
            </div>
            <CartSummary />
            <IoIosMenu
              className="block cursor-pointer text-[22px] md:text-2xl lg:hidden"
              onClick={() => setIsShowMenu(true)}
            />
          </div>
        </nav>
      </header>
    </>
  );
}
