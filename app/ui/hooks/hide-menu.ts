"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import useDeviceType from "@ui/hooks/device-type";

export default function useHideMenu(
  isShow: boolean,
  setIsShow: Dispatch<SetStateAction<boolean>>,
) {
  const deviceType = useDeviceType();

  useEffect(() => {
    if (deviceType !== "desktop" && isShow) {
      const handleOutsideClick = () => setIsShow(false);
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [deviceType, isShow, setIsShow]);
}
