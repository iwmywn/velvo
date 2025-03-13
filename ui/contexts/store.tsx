"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product, Banner } from "@lib/definitions";

type CustomerGroupCategory = {
  group: string;
  items: { name: string; slug: string }[];
};

interface StoreContextProps {
  products: Product[];
  banners: Banner[];
  customerGroups: string[];
  categoryItems: CustomerGroupCategory[];
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({
  children,
  products,
  banners,
  customerGroups,
  categoryItems,
}: {
  children: ReactNode;
  products: Product[];
  banners: Banner[];
  customerGroups: string[];
  categoryItems: CustomerGroupCategory[];
}) {
  return (
    <StoreContext.Provider
      value={{ products, banners, customerGroups, categoryItems }}
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
