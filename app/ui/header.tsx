"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiSearch, CiUser } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import Logo from "./logo";
import links from "../data/nav-links";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex justify-center">
      <nav className="mx-8 flex w-full items-center justify-between bg-white/80 pb-3 pt-8 backdrop-blur md:mx-20">
        <div className="hidden w-[25rem] items-center gap-5 lg:flex">
          {links.map(({ name, href }) => {
            return (
              <Link
                key={name}
                href={href}
                className={`rounded-md px-4 py-1 ${pathname === href ? "border border-black/5 bg-stone-100" : "hover:bg-stone-100"}`}
              >
                <span className="hidden font-medium md:block">{name}</span>
              </Link>
            );
          })}
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-5 text-base lg:w-[25rem] lg:gap-10">
          <CiSearch
            className="cursor-pointer"
            fontSize={24}
            // todo: search
            // onClick={() => console.log("hello")}
          />
          <Link href="/account">
            <CiUser fontSize={24} />
          </Link>
          <Link href="/cart">
            <GiShoppingCart fontSize={24} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
