"use client";

import useOverflow from "@ui/hooks/overflow";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GoArrowDown } from "react-icons/go";

const contact = [
  {
    name: "Ngô Nguyễn Việt Anh",
    mssv: "215052056",
    email: "anhnnv21@uef.edu.vn",
  },
  {
    name: "Hoàng Anh Tuấn",
    mssv: "215052152",
    email: "tuanha321@uef.edu.vn",
  },
];

export default function PopUp() {
  const [isPopUpVisible, setIsPopUpVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useOverflow(isPopUpVisible);
  useEffect(() => {
    if (!(sessionStorage.getItem("popup") === "true")) {
      setIsPopUpVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("popup", "true");
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsPopUpVisible(false);
    }, 250);
  };

  if (!isPopUpVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex animate-fadeIn items-center justify-center bg-black/70 text-base ${isAnimating && "animate-fadeOut"}`}
      onClick={handleDismiss}
    >
      <div
        className={`relative mx-6 w-full max-w-[35rem] animate-popUpIn rounded-2xl bg-white p-8 text-black ${isAnimating && "animate-popUpOut"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <h3 className="text-lg font-medium">ĐỒ ÁN 2024</h3>
          {contact.map(({ name, mssv, email }) => (
            <Fragment key={name}>
              <span>
                {name} - {mssv}
              </span>
              <Link
                className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-stone-300 after:transition-all after:duration-300 hover:after:bg-black"
                href={`mailto:${email}`}
                rel="noopener"
              >
                {email}
              </Link>
            </Fragment>
          ))}
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
