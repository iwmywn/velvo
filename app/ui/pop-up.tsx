"use client";

import useOverflow from "@/hooks/useOverflow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GoArrowDown } from "react-icons/go";

const linkClass =
  "relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-stone-300 after:transition-all after:duration-300 hover:after:bg-black";

export default function PopUp() {
  const [isPopUpVisible, setIsPopUpVisible] = useState<boolean>(false);

  useOverflow(isPopUpVisible);
  useEffect(() => {
    const isPopupDismissed = sessionStorage.getItem("popup") === "true";
    if (!isPopupDismissed) {
      setIsPopUpVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsPopUpVisible(false);
    sessionStorage.setItem("popup", "true");
  };

  if (!isPopUpVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 text-base"
      onClick={handleDismiss}
    >
      <div
        className="relative mx-6 w-full max-w-[35rem] rounded-2xl bg-white p-8 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h3 className="text-lg font-medium">ĐỒ ÁN 2024</h3>
          <span>Ngô Nguyễn Việt Anh - 215052056</span>
          <Link
            className={linkClass}
            href="mailto:anhnnv21@uef.edu.vn"
            rel="noopener"
          >
            anhnnv21@uef.edu.vn
          </Link>
          <span>Hoàng Anh Tuấn - 215052152 </span>
          <Link
            className={linkClass}
            href="mailto:tuanha321@uef.edu.vn"
            rel="noopener"
          >
            tuanha321@uef.edu.vn
          </Link>
          <div className="mt-1 flex h-8 w-8 animate-bounce items-center justify-center rounded-full">
            <GoArrowDown fontSize={24} className="fill-blue-400" />
          </div>
          <a
            href="https://github.com/iwmywn/doan"
            target="_blank"
            rel="noopener"
          >
            <FaGithub
              className="transition-all duration-300 hover:scale-110"
              fontSize={24}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
