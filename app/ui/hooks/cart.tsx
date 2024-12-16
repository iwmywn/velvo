"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchCartProductQuantity } from "@lib/data";
import { useAuthContext } from "./auth";

interface CartContextProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState<number>(0);
  const { userId } = useAuthContext();
  useEffect(() => {
    async function initializeCart() {
      const cartQuantity = await fetchCartProductQuantity(userId);
      setQuantity(cartQuantity);
    }
    initializeCart();
  }, [userId]);

  return (
    <CartContext.Provider value={{ quantity, setQuantity }}>
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
