"use client";

import Link from "next/link";
import useDeviceType from "@ui/hooks/device-type";
import useHideMenu from "@ui/hooks/hide-menu";
import { CiUser } from "react-icons/ci";
import { useAuthContext } from "@ui/hooks/auth";
import { useState } from "react";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const deviceType = useDeviceType();
  const { isSignedIn, userId } = useAuthContext();

  useHideMenu(setIsOpen);

  return (
    <>
      {isSignedIn ? (
        <div
          className="relative flex items-center"
          onMouseEnter={() => {
            if (deviceType === "desktop") setIsOpen(true);
          }}
          onMouseLeave={() => {
            if (deviceType === "desktop") setIsOpen(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (deviceType !== "desktop") {
              setIsOpen((prev) => !prev);
            }
          }}
        >
          <Link href="/user/account-settings" title="Account">
            <CiUser className="cursor-pointer text-[22px] md:text-2xl" />
          </Link>
          {isOpen && (
            <div className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 text-sm">
              <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-b-8 border-stone-100 border-x-transparent"></div>
              <div className="rounded-md border bg-white">
                <div className="flex flex-col">
                  <Link
                    href="/user/account-settings"
                    className="text-nowrap px-4 py-2 hover:bg-slate-100"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/user/purchase"
                    className="text-nowrap px-4 py-2 hover:bg-slate-100"
                  >
                    My Purchase
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button className="w-full text-nowrap px-4 py-2 text-left hover:bg-slate-100">
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="/user/signin" title="Signin">
          <CiUser className="cursor-pointer text-[22px] md:text-2xl" />
        </Link>
      )}
    </>
  );
}
