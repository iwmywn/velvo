"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeightProps {
  heights: number;
  setHeight: (height: number) => void;
}

const HeightContext = createContext<HeightProps | null>(null);

export function HeightProvider({ children }: { children: ReactNode }) {
  const [heights, setHeight] = useState<number>(0);

  return (
    <HeightContext.Provider value={{ heights, setHeight }}>
      {children}
    </HeightContext.Provider>
  );
}

export function useHeightContext() {
  const ctx = useContext(HeightContext);
  if (!ctx) {
    throw new Error("useHeightContext must be used within HeightProvider");
  }
  return ctx;
}
