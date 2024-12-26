"use client";

import { navLinks } from "@ui/data/constants";
import Link from "next/link";
import useAnimation from "@ui/hooks/animation";
import { useUIState } from "@ui/context/state";

export default function NavMenu() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const { setState } = useUIState();
  const handleCloseMenu = () =>
    triggerAnimation(() => setState("isMenuOpen", false));

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
