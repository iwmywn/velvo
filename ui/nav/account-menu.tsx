"use client";

import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { useAuthContext } from "@ui/contexts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { baseImgUrl } from "@ui/data";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { userId, userImage } = useAuthContext();

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <div
        className="relative flex h-[22px] w-[22px] cursor-pointer items-center justify-center md:h-6 md:w-6"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
      >
        {userId ? (
          <Image
            src={`${baseImgUrl}${userImage}`}
            fill
            sizes="(min-width: 768px) 24px, 22px"
            alt="The avatar style Adventurer is a remix of: Adventurer by Lisa Wischofsky, licensed under CC BY 4.0 ."
          />
        ) : (
          <Link href="/signin" title="Sign in">
            <CiUser className="text-[22px] md:text-2xl" />
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isOpen && userId && (
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
            <div className="absolute -top-4 right-0 left-0 h-4" />
            <span className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-r-transparent border-b-transparent bg-white" />
            <div className="rounded-md border bg-white">
              <div className="relative z-[11] flex flex-col">
                <Link
                  href="/account"
                  className="px-4 py-2 text-nowrap hover:bg-slate-100"
                >
                  My account
                </Link>
                <Link
                  href="/purchase"
                  className="px-4 py-2 text-nowrap hover:bg-slate-100"
                >
                  My Purchase
                </Link>
                <form action="/api/signout" method="POST">
                  <button
                    className="w-full px-4 py-2 text-left text-nowrap hover:bg-slate-100"
                    onClick={() => {
                      sessionStorage.removeItem("cart");
                      sessionStorage.removeItem("cartQuantity");
                    }}
                  >
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
