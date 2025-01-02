"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product } from "@lib/definition";

interface ProductContextProps {
  products: Product[];
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined,
);

export function ProductProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const cxt = useContext(ProductContext);
  if (!cxt) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return cxt;
}
