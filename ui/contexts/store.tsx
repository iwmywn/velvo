"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product, Banner } from "@lib/definitions";

interface StoreContextProps {
  products: Product[];
  banners: Banner[];
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({
  children,
  products,
  banners,
}: {
  children: ReactNode;
  products: Product[];
  banners: Banner[];
}) {
  return (
    <StoreContext.Provider value={{ products, banners }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const cxt = useContext(StoreContext);
  if (!cxt) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return cxt;
}
