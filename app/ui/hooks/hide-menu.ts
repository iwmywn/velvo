"use client";

import { useEffect, Dispatch, SetStateAction } from "react";

export default function useHideMenu(
  setIsOpen: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [setIsOpen]);
}
