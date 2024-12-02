"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/search-overlay") setIsOpen(true);
  }, [pathname]);

  useOverflow(isOpen);
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
      router.back();
    }, 250);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-[9998] bg-black/70 ${isAnimating ? "animate-fadeOut" : "animate-fadeIn"}`}
          onClick={handleClose}
        >
          <div
            className={`fixed bottom-0 left-0 right-0 z-[9999] h-[80%] overflow-y-auto rounded-tl-lg rounded-tr-lg bg-white text-sm sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] sm:rounded-bl-lg sm:rounded-tr-none lg:w-[33%] ${isAnimating ? "animate-centerToBottom sm:animate-leftToRight" : "animate-bottomToCenter sm:animate-rightToLeft"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-black/80 outline-none focus:border-black"
              />
            </div>
            <div className="mx-4 text-center">
              Search for the latest fashion trends that match your style.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
