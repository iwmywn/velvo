"use client";

import { useEffect } from "react";

export default function useOverflow(isOpen: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      html.style.overflow = "hidden";
      html.style.paddingRight = `${scrollbarWidth}px`;

      if (header)
        (header as HTMLElement).style.marginRight = `${scrollbarWidth}px`;
      if (footer)
        (footer as HTMLElement).style.marginRight = `${scrollbarWidth}px`;
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";

      if (header) (header as HTMLElement).style.marginRight = "";
      if (footer) (footer as HTMLElement).style.marginRight = "";
    }

    return () => {
      html.style.overflow = "";
      html.style.paddingRight = "";

      if (header) (header as HTMLElement).style.marginRight = "";
      if (footer) (footer as HTMLElement).style.marginRight = "";
    };
  }, [isOpen]);
}
