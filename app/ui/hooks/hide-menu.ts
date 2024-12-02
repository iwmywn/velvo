"use client";

import { useEffect, Dispatch, SetStateAction } from "react";

export default function useHideMenu(
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    if (isOpen) {
      const handleClick = () => setIsOpen(false);
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [isOpen, setIsOpen]);
}
