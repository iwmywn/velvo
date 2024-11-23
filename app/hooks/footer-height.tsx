"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FooterHeightProps {
  footerHeight: number;
  setFooterHeight: (height: number) => void;
}

const FooterHeightContext = createContext<FooterHeightProps | null>(null);

export function FooterHeightProvider({ children }: { children: ReactNode }) {
  const [footerHeight, setFooterHeight] = useState<number>(0);

  return (
    <FooterHeightContext.Provider value={{ footerHeight, setFooterHeight }}>
      {children}
    </FooterHeightContext.Provider>
  );
}

export function useFooterHeight() {
  const context = useContext(FooterHeightContext);
  if (!context) {
    throw new Error("useFooterHeight must be used within FooterHeightProvider");
  }
  return context;
}
