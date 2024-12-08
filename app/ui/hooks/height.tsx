"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  RefObject,
} from "react";

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
  const context = useContext(HeightContext);
  if (!context) {
    throw new Error("useHeightContext must be used within HeightProvider");
  }
  return context;
}

export function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const { setHeight } = useHeightContext();

  useEffect(() => {
    const updateFooterHeight = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    };

    updateFooterHeight();

    window.addEventListener("resize", updateFooterHeight);
    return () => window.removeEventListener("resize", updateFooterHeight);
  }, [ref, setHeight]);
}
