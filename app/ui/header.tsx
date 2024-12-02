"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import Logo from "@ui/logo";
import { navLinks } from "@ui/data/constants";
import { useRef, useState } from "react";
import NavMenu from "@/ui/nav/nav-menu";
import useOverflow from "@ui/hooks/overflow";
import { useElementHeight } from "@ui/hooks/height";
import CartSummary from "./nav/cart-aside";
import AccountMenu from "@/ui/nav/account-menu";
import SearchAside from "./nav/search-aside";

export default function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOverflow(isOpen);
  useElementHeight(ref);

  return (
    <>
      {isOpen && <NavMenu setIsOpen={setIsOpen} />}
      <header
        ref={ref}
        className="fixed left-0 right-0 top-0 z-20 flex justify-center bg-white/80 backdrop-blur"
      >
        <nav className="mx-8 flex w-full items-center justify-between pb-1 pt-5 md:mx-20 md:pb-3 md:pt-8">
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
                <span className="hidden font-semibold md:block">{name}</span>
              </Link>
            ))}
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-5 text-base lg:max-w-[28rem] lg:flex-1 lg:gap-10">
            <SearchAside />
            <AccountMenu />
            <CartSummary />
            <IoIosMenu
              className="block cursor-pointer text-[22px] md:text-2xl lg:hidden"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </nav>
      </header>
    </>
  );
}
