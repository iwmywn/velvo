"use client";

import { navLinks } from "@ui/data";
import Link from "next/link";
import { useAnimation } from "@ui/hooks";
import { useUIStateContext } from "@ui/contexts";

export default function NavMenu() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const { setState } = useUIStateContext();
  const handleCloseMenu = () =>
    triggerAnimation(() => setState("isMenuOpen", false));

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/80 ${isAnimating ? "animate-fade-out" : "animate-fade-in"}`}
      onClick={handleCloseMenu}
    >
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-b-lg bg-white py-3 ${isAnimating ? "animate-center-to-top" : "animate-top-to-center"}`}
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
