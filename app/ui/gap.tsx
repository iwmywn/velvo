"use client";

import { useFooterHeight } from "@/app/hooks/footer-height";

export default function Gap() {
  const { footerHeight } = useFooterHeight();

  return (
    <div
      className="relative -z-50"
      style={{ height: `${footerHeight + 10}px` }}
    />
  );
}
