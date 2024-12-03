"use client";

import Link from "next/link";
import { useState } from "react";
import useHideMenu from "@ui/hooks/hide-menu";
import useDeviceType from "@ui/hooks/device-type";
import { CiUser } from "react-icons/ci";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const deviceType = useDeviceType();

  useHideMenu(isOpen, setIsOpen);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => {
        if (deviceType !== "desktop") {
          setIsOpen(true);
        }
      }}
    >
      {/* todo: check sign in */}
      <Link href="/user/account" title="Account">
        <CiUser className="cursor-pointer text-[22px] md:text-2xl" />
      </Link>
      {isOpen && (
        <div className="absolute left-1/2 top-full z-10 mt-2 w-32 -translate-x-1/2 text-sm">
          <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-stone-100 border-x-transparent"></div>
          <div className="rounded-md border bg-white">
            <div className="flex flex-col">
              <Link
                href="/user/account"
                className="px-4 py-2 hover:bg-stone-100"
              >
                My Account
              </Link>
              <Link
                href="/user/purchase"
                className="px-4 py-2 hover:bg-stone-100"
              >
                My Purchase
              </Link>
              <button
                // onClick={() => {
                //   console.log("Signed out");
                // }}
                className="px-4 py-2 text-left hover:bg-stone-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
