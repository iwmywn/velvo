"use client";

import { useFooterHeight } from "@/hooks/footer-height";

export default function Gap() {
  const { footerHeight } = useFooterHeight();

  return (
    <div
      className="relative -z-[9999]"
      style={{ height: `${footerHeight + 10}px` }}
    />
  );
}
