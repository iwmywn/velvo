"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product, Banner } from "@lib/definitions";

type Category = { name: string; slug: string };

type MainSubCategories = {
  main: Category;
  sub: Category[];
};

interface StoreContextProps {
  products: Product[];
  banners: Banner[];
  mainCategories: Category[];
  mainSubCategories: MainSubCategories[];
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({
  children,
  products,
  banners,
  mainCategories,
  mainSubCategories,
}: {
  children: ReactNode;
  products: Product[];
  banners: Banner[];
  mainCategories: Category[];
  mainSubCategories: MainSubCategories[];
}) {
  return (
    <StoreContext.Provider
      value={{ products, banners, mainCategories, mainSubCategories }}
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
