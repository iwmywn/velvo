"use client";

import { useEffect } from "react";

export default function useOverflow(isShow: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    const className = "overflow-hidden";

    if (isShow && !html.classList.contains(className)) {
      html.classList.add(className);
    } else if (!isShow && html.classList.contains(className)) {
      html.classList.remove(className);
    }

    return () => html.classList.remove(className);
  }, [isShow]);
}
