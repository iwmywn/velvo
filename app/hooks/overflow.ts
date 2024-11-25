import { useEffect } from "react";

export default function useOverflow(isShow: boolean) {
  useEffect(() => {
    const html = document.documentElement;
    isShow
      ? html.classList.add("overflow-hidden")
      : html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [isShow]);
}
