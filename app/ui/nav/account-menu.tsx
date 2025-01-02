"use client";

import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { useAuthContext } from "@ui/contexts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isSignedIn, image, isLoading } = useAuthContext();

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <div
        className="relative flex h-[22px] w-[22px] cursor-pointer items-center justify-center md:h-6 md:w-6"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
      >
        {isSignedIn ? (
          <Image
            src={image!}
            fill
            sizes="(min-width: 768px) 24px, 22px"
            alt="The avatar style Adventurer is a remix of: Adventurer by Lisa Wischofsky, licensed under CC BY 4.0 ."
          />
        ) : isLoading ? (
          <div className="h-[18px] w-[18px] animate-spin rounded-full border-4 border-gray-300 border-t-black md:h-5 md:w-5" />
        ) : (
          <Link href="/user/signin" title="Sign in">
            <CiUser className="text-[22px] md:text-2xl" />
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isOpen && isSignedIn && (
          <motion.div
            className="absolute top-[calc(100%_+_16px)] bg-white text-sm"
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, y: 20 }}
            style={{ left: "50%" }}
          >
            <div className="absolute -top-4 left-0 right-0 h-4" />
            <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-b-transparent border-r-transparent bg-white" />
            <div className="rounded-md border bg-white">
              <div className="relative z-[11] flex flex-col">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
