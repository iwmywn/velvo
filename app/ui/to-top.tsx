"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 700);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-20 right-0 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-black text-white transition-all duration-300 hover:scale-95"
        >
          <FaArrowUp fontSize={12} />
        </div>
      )}
    </>
  );
}
