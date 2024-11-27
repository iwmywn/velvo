"use client";

import { useHeightContext } from "@ui/hooks/height";

export default function Gap({ z }: { z: number }) {
  const { heights } = useHeightContext();

  return (
    <div
      className="relative bg-white"
      style={{ height: `${heights + 10}px`, zIndex: `${z}` }}
    />
  );
}
