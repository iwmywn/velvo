"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import Logo from "@ui/logo";
import { navLinks } from "@ui/data/constants";
import { useRef, useState } from "react";
import NavMenu from "@ui/nav/nav-menu";
import useOverflow from "@ui/hooks/overflow";
import { useElementHeight } from "@ui/hooks/height";
import CartSummary from "./nav/cart-aside";
import AccountMenu from "@ui/nav/account-menu";
import SearchSummary from "./nav/search-aside";
import { useSession } from "next-auth/react";
import useDeviceType from "@ui/hooks/device-type";
import useHideMenu from "@ui/hooks/hide-menu";
import { CiUser } from "react-icons/ci";

export default function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpenAccount, setIsOpenAccount] = useState<boolean>(false);
  const deviceType = useDeviceType();
  const { data: session } = useSession();
  // console.log(session?.user?.id);

  useHideMenu(setIsOpenAccount);
  useOverflow(isOpenMenu);
  useElementHeight(ref);

  return (
    <>
      {isOpenMenu && <NavMenu setIsOpen={setIsOpenMenu} />}
      <header
        ref={ref}
        className="fixed left-0 right-0 top-0 z-20 flex justify-center bg-white/80 backdrop-blur"
      >
        <nav className="mx-8 flex w-full items-center justify-between pb-1 pt-5 md:mx-20 md:pb-3 md:pt-8">
          <div className="hidden max-w-[28rem] flex-1 lg:flex lg:items-center lg:justify-between">
            <Link className="text-2xl font-bold" href="/" title="StyleWave">
              StyleWave
            </Link>
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`rounded-md border px-4 py-1 text-sm ${pathname === href ? "bg-slate-100" : "border-transparent transition-all duration-300 hover:border-inherit hover:bg-slate-100"}`}
                title={`${label} Category`}
              >
                <span className="hidden font-semibold md:block">{label}</span>
              </Link>
            ))}
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-5 text-base lg:max-w-[28rem] lg:flex-1 lg:gap-10">
            <SearchSummary />
            <div
              className="relative flex items-center"
              onMouseEnter={() => {
                if (deviceType === "desktop" && session) setIsOpenAccount(true);
              }}
              onMouseLeave={() => {
                if (deviceType === "desktop" && session)
                  setIsOpenAccount(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (deviceType !== "desktop" && session) {
                  setIsOpenAccount((prev) => !prev);
                }
              }}
            >
              <Link
                href={`/user/${session ? "account" : "signin"}`}
                title="Account"
              >
                <CiUser className="cursor-pointer text-[22px] md:text-2xl" />
              </Link>
              {isOpenAccount && session && <AccountMenu />}
            </div>

            <CartSummary />
            <IoIosMenu
              className="block cursor-pointer text-[22px] md:text-2xl lg:hidden"
              onClick={() => setIsOpenMenu(true)}
            />
          </div>
        </nav>
      </header>
    </>
  );
}
