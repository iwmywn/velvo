"use client";

import { navLinks } from "@ui/data/constants";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import useAnimation from "@ui/hooks/animation";

export default function NavMenu({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { isAnimating, triggerAnimation } = useAnimation();
  const handleCloseMenu = () => triggerAnimation(() => setIsOpen(false));

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/80 ${isAnimating ? "animate-fadeOut" : "animate-fadeIn"}`}
      onClick={handleCloseMenu}
    >
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-b-lg bg-white py-3 ${isAnimating ? "animate-centerToTop" : "animate-topToCenter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {navLinks.map(({ label, href }, index) => (
          <Link
            key={index}
            className="w-full py-[6px] text-center text-sm font-medium transition-all duration-300 hover:bg-slate-100"
            href={href}
            onClick={handleCloseMenu}
          >
            {label.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
