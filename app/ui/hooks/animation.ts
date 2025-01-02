"use client";

import { useState } from "react";

export function useAnimation(duration: number = 250) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const triggerAnimation = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      callback();
    }, duration);
  };

  return { isAnimating, triggerAnimation };
}
