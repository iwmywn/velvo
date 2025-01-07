"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { fetchCartQuantity, fetchCart, fetchInvoices } from "@lib/data";
import { useAuthContext } from "@ui/contexts";
import { Cart, InvoiceList } from "@lib/definition";

interface CartContextProps {
  quantity: number;
  cartProducts: Cart["products"] | null;
  invoiceProducts: InvoiceList["invoices"] | null;
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
  const [cartProducts, setCartProducts] = useState<Cart["products"] | null>(
    null,
  );
  const [invoiceProducts, setInvoiceProducts] = useState<
    InvoiceList["invoices"] | null
  >(null);
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
          cartQuantity ? fetchCartQuantity(userId) : undefined,
          cartProducts ? fetchCart(userId) : undefined,
          invoiceProducts ? fetchInvoices(userId) : undefined,
        ]);

        if (fetchedCartQuantity !== undefined) {
          setQuantity(fetchedCartQuantity);
          sessionStorage.setItem(
            "cartQuantity",
            JSON.stringify(fetchedCartQuantity),
          );
        }
        if (fetchedCartProducts !== undefined) {
          setCartProducts(fetchedCartProducts);
          sessionStorage.setItem("cart", JSON.stringify(fetchedCartProducts));
        }
        if (fetchedInvoiceProducts !== undefined)
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
      if (userId) {
        const cachedQuantity = sessionStorage.getItem("cartQuantity");
        if (cachedQuantity) setQuantity(JSON.parse(cachedQuantity));
        else {
          const fetchedCartQuantity = await fetchCartQuantity(userId);
          setQuantity(fetchedCartQuantity);
          sessionStorage.setItem(
            "cartQuantity",
            JSON.stringify(fetchedCartQuantity),
          );
        }
      }
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
  const cxt = useContext(CartContext);
  if (!cxt) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return cxt;
}
