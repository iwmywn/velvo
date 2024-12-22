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
  refreshCart: (forceLoading?: boolean) => Promise<void>;
  triggerRefetchCart: () => void;
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
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);

  const refreshCart = useCallback(
    async (forceLoading: boolean = false) => {
      if (forceLoading) {
        setIsLoading(true);
      }
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
        setTriggerRefetch(false);
        if (forceLoading) {
          setIsLoading(false);
        }
      }
    },
    [userId],
  );

  useEffect(() => {
    if (userId) {
      refreshCart(true);
    }
  }, [userId, triggerRefetch, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        quantity,
        cartProducts,
        invoiceProducts,
        isLoading,
        refreshCart,
        triggerRefetchCart: () => setTriggerRefetch(true),
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
