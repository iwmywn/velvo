"use client";

import { createContext, useContext, ReactNode } from "react";
import { Product } from "@lib/definition";

type ProductContextType = {
  products: Product[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) => {
  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const cxt = useContext(ProductContext);
  if (!cxt) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return cxt;
};
