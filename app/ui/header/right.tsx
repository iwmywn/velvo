"use client";

import Link from "next/link";
import { CiSearch, CiUser } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";

export default function Right() {
  return (
    <div className="flex w-[31.25rem] items-center justify-end gap-10 text-base">
      <CiSearch
        className="cursor-pointer"
        fontSize={24}
        onClick={() => console.log("hello")}
      />
      <Link href="/account">
        <CiUser fontSize={24} />
      </Link>
      <Link href="/cart">
        <GiShoppingCart fontSize={24} />
      </Link>
    </div>
  );
}
