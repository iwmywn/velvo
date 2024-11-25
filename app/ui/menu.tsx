"use client";

import { useState } from "react";
import links from "@/data/nav-links";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function Menu({
  setIsShowMenu,
}: {
  setIsShowMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleCloseMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsShowMenu(false);
    }, 250);
  };

  return (
    <div
      className={`animate-fadeIn fixed inset-0 z-[9999] bg-black/70 ${isAnimating && "animate-fadeOut"}`}
      onClick={handleCloseMenu}
    >
      <div
        className={`flex animate-moveDown flex-col items-center justify-center gap-2 rounded-bl-lg rounded-br-lg bg-white py-3 ${isAnimating && "animate-moveUp"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {links.map(({ name, href }, index) => (
          <Link
            key={index}
            className="w-full py-[6px] text-center text-sm font-medium transition-all duration-300 hover:bg-stone-100"
            href={href}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
