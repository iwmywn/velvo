"use client";

import { useEffect, useState } from "react";

export default function useWindowHeight() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return height;
}
