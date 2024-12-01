"use client";

import { useEffect, Dispatch, SetStateAction } from "react";

export default function useHideMenu(
  isShow: boolean,
  setIsShow: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    if (isShow) {
      const handleClick = () => setIsShow(false);
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [isShow, setIsShow]);
}
