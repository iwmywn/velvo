"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  {
    name: "Men",
    href: "/category/men",
  },
  { name: "Women", href: "/category/women" },
  { name: "Kids", href: "/category/kids" },
];

export default function Left() {
  const pathname = usePathname();

  return (
    <div className="hidden w-[25rem] items-center gap-5 lg:flex">
      {links.map(({ name, href }) => {
        return (
          <Link
            key={name}
            href={href}
            className={`rounded-md px-4 py-1 ${pathname === href && "bg-stone-100"}`}
          >
            <p className="hidden font-medium md:block">{name}</p>
          </Link>
        );
      })}
    </div>
  );
}
