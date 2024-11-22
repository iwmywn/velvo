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
  { name: "Children", href: "/category/children" },
];

export default function Left() {
  const pathname = usePathname();

  return (
    <div className="flex w-[31.25rem] items-center gap-10">
      {links.map(({ name, href }) => {
        return (
          <Link
            key={name}
            href={href}
            className={`rounded px-4 py-1 ${pathname === href && "bg-stone-100"}`}
          >
            <p className="hidden md:block">{name}</p>
          </Link>
        );
      })}
    </div>
  );
}
