"use client";

import { useEffect } from "react";

export default function useOverflow(isOpen: boolean) {
  useEffect(() => {
    const html = document.documentElement;

    html.classList.toggle("overflow-hidden", isOpen);
    return () => void html.classList.toggle("overflow-hidden", false);
  }, [isOpen]);
}
