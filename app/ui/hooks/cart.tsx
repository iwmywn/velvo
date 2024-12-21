"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import {
  fetchCartProductQuantity,
  fetchCartProducts,
  fetchInvoiceProducts,
} from "@lib/data";
import { useAuthContext } from "./auth";
import { CartProductsProps, InvoiceProductsProps } from "@lib/definition";

interface CartContextProps {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  cartProducts: CartProductsProps | null;
  setCartProducts: Dispatch<SetStateAction<CartProductsProps | null>>;
  invoiceProducts: InvoiceProductsProps | null;
  setInvoiceProducts: Dispatch<SetStateAction<InvoiceProductsProps | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<CartProductsProps | null>(
    null,
  );
  const [invoiceProducts, setInvoiceProducts] =
    useState<InvoiceProductsProps | null>(null);
  const { userId } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    async function initialize() {
      const [cartQuantity, fetchedCartProducts, fetchedInvoiceProducts] =
        await Promise.all([
          fetchCartProductQuantity(userId),
          fetchCartProducts(userId),
          fetchInvoiceProducts(userId),
        ]);
      setQuantity(cartQuantity);
      setCartProducts(fetchedCartProducts);
      setInvoiceProducts(fetchedInvoiceProducts);
      setIsLoading(false);
    }

    if (userId) initialize();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        quantity,
        setQuantity,
        cartProducts,
        setCartProducts,
        invoiceProducts,
        setInvoiceProducts,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
