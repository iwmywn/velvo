"use client";

import { useEffect } from "react";

export function useOverflow(isOpen: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    const elements = document.querySelectorAll(".space-right");
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      html.style.overflow = "hidden";
      html.style.paddingRight = `${scrollbarWidth}px`;

      elements.forEach((ele) => {
        (ele as HTMLElement).style.marginRight = `${scrollbarWidth}px`;
      });
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";

      elements.forEach((ele) => {
        (ele as HTMLElement).style.marginRight = "";
      });
    }

    return () => {
      html.style.overflow = "";
      html.style.paddingRight = "";

      elements.forEach((ele) => {
        (ele as HTMLElement).style.marginRight = "";
      });
    };
  }, [isOpen]);
}
