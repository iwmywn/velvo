"use client";

import { useState } from "react";
import useOverflow from "@ui/hooks/overflow";
import { CiSearch } from "react-icons/ci";

export default function SearchAside() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useOverflow(isOpen);
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 250);
  };

  return (
    <>
      <CiSearch
        className="cursor-pointer text-[22px] md:text-2xl"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className={`fixed inset-0 z-[9998] h-screen bg-black/70 ${isAnimating ? "animate-fadeOut" : "animate-fadeIn"}`}
          onClick={handleClose}
        >
          <div
            className={`absolute bottom-0 left-0 right-0 z-[9999] h-[80%] overflow-y-auto rounded-tl-lg rounded-tr-lg bg-white text-sm sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] sm:rounded-bl-lg sm:rounded-tr-none lg:w-[33%] ${isAnimating ? "animate-centerToBottom sm:animate-leftToRight" : "animate-bottomToCenter sm:animate-rightToLeft"}`}
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
