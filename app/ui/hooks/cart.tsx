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
  refreshCart: (
    cartQuantity?: boolean,
    cartProducts?: boolean,
    invoiceProducts?: boolean,
  ) => Promise<void>;
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

  const refreshCart = useCallback(
    async (
      cartQuantity = true,
      cartProducts = true,
      invoiceProducts = true,
    ) => {
      if (!userId) return;
      // setIsLoading(true);
      try {
        const [
          fetchedCartQuantity,
          fetchedCartProducts,
          fetchedInvoiceProducts,
        ] = await Promise.all([
          cartQuantity ? fetchCartProductQuantity(userId) : null,
          cartProducts ? fetchCartProducts(userId) : null,
          invoiceProducts ? fetchInvoiceProducts(userId) : null,
        ]);

        if (fetchedCartQuantity !== null) setQuantity(fetchedCartQuantity);
        if (fetchedCartProducts !== null) {
          setCartProducts(fetchedCartProducts);
          sessionStorage.setItem(
            "cartProducts",
            JSON.stringify(fetchedCartProducts),
          );
        }
        if (fetchedInvoiceProducts !== null)
          setInvoiceProducts(fetchedInvoiceProducts);
      } catch (error) {
        console.error("Failed to refresh cart:", error);
      } finally {
        if (cartQuantity && cartProducts && invoiceProducts)
          setIsLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    async function initialize() {
      const fetchedCartQuantity = await fetchCartProductQuantity(userId);
      setQuantity(fetchedCartQuantity);
    }

    initialize();
  }, [userId]);

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
