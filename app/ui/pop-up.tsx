"use client";

import useOverflow from "@ui/hooks/overflow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GoArrowDown } from "react-icons/go";
import Backdrop from "@ui/overlays/backdrop";
import { linkClass } from "@ui/form-class";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useOverflow(isOpen);
  useEffect(() => {
    if (!(sessionStorage.getItem("popup") === "true")) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("popup", "true");
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 250);
  };

  return (
    isOpen && (
      <Backdrop isAnimating={isAnimating} onClick={handleClose}>
        <div
          className={`relative mx-6 w-full max-w-[30rem] animate-popUpIn rounded-2xl bg-white px-8 py-6 text-black ${isAnimating && "animate-popUpOut"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h3 className="font-semibold">ĐỒ ÁN 2024</h3>
            {contact.map(({ name, mssv, email }) => (
              <div className="text-sm" key={name}>
                <span>
                  {name} - {mssv}{" "}
                </span>
                <Link
                  className={linkClass}
                  href={`mailto:${email}`}
                  rel="noopener"
                >
                  {email}
                </Link>
              </div>
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
      </Backdrop>
    )
  );
}
