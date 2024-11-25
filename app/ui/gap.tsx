"use client";

import { useHeightContext } from "@/hooks/useHeight";

export default function Gap() {
  const { heights } = useHeightContext();

  return (
    <div
      className="relative -z-[9999] bg-white"
      style={{ height: `${heights + 10}px` }}
    />
  );
}
