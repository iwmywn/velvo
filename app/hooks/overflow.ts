"use client";

import { useEffect } from "react";

export default function useOverflow(isShow: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    if (isShow) html.classList.add("overflow-hidden");
    else html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [isShow]);
}
