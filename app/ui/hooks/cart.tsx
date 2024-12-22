"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
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
  cartProducts: CartProductsProps | null;
  invoiceProducts: InvoiceProductsProps | null;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<CartProductsProps | null>(
    null,
  );
  const [invoiceProducts, setInvoiceProducts] =
    useState<InvoiceProductsProps | null>(null);
  const { userId, isLoading: isAuthLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshCart = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [cartQuantity, fetchedCartProducts, fetchedInvoiceProducts] =
        await Promise.all([
          fetchCartProductQuantity(userId),
          fetchCartProducts(userId),
          fetchInvoiceProducts(userId),
        ]);
      setQuantity(cartQuantity);
      setCartProducts(fetchedCartProducts);
      setInvoiceProducts(fetchedInvoiceProducts);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthLoading || !userId) return;
    refreshCart();
  }, [isAuthLoading, userId, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        quantity,
        cartProducts,
        invoiceProducts,
        isLoading,
        refreshCart,
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
