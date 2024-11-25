"use client";

import { useHeight } from "@/hooks/useHeight";

export default function Gap() {
  const { heights } = useHeight();

  return (
    <div
      className="relative -z-[9999] bg-white"
      style={{ height: `${heights + 10}px` }}
    />
  );
}
