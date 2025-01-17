"use client";

import { useHeightContext } from "@ui/contexts";
import { useEffect, RefObject } from "react";

export function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const { setHeight } = useHeightContext();

  useEffect(() => {
    const updateFooterHeight = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    };

    updateFooterHeight();

    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, [ref, setHeight]);
}
