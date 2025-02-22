"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product, Banner } from "@lib/definitions";

type CustomerGroupCategory = {
  group: string;
  items: string[];
};

interface StoreContextProps {
  products: Product[];
  banners: Banner[];
  customerGroups: string[];
  categories: CustomerGroupCategory[];
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({
  children,
  products,
  banners,
  customerGroups,
  categories,
}: {
  children: ReactNode;
  products: Product[];
  banners: Banner[];
  customerGroups: string[];
  categories: CustomerGroupCategory[];
}) {
  return (
    <StoreContext.Provider
      value={{ products, banners, customerGroups, categories }}
    >
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
