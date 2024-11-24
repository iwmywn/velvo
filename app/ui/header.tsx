"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiSearch, CiUser } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import Logo from "./logo";
import links from "@/app/data/nav-links";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex justify-center bg-white/80">
      <nav className="mx-8 flex w-full items-center justify-between pb-1 pt-5 backdrop-blur md:mx-20 md:pb-3 md:pt-8">
        <div className="hidden w-[25rem] items-center gap-5 lg:flex">
          {links.map(({ name, href }) => {
            return (
              <Link
                key={name}
                href={href}
                className={`rounded-md border px-4 py-1 ${pathname === href ? "bg-stone-100" : "border-transparent transition-all duration-300 hover:border-inherit hover:bg-stone-100"}`}
              >
                <span className="hidden font-medium md:block">{name}</span>
              </Link>
            );
          })}
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-5 text-base lg:w-[25rem] lg:gap-10">
          <CiSearch
            className="cursor-pointer text-[22px] md:text-2xl"
            fontSize={24}
            // todo: search
            // onClick={() => console.log("hello")}
          />
          <Link href="/account">
            <CiUser fontSize={24} className="text-[22px] md:text-2xl" />
          </Link>
          <Link href="/cart">
            <GiShoppingCart fontSize={24} className="text-[22px] md:text-2xl" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
