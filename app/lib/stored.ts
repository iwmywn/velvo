import { CartProductsProps } from "@lib/definition";
import { fetchCart } from "@lib/data";
import { create } from "zustand";

interface CartState {
  cartProducts: CartProductsProps;
  isLoading: boolean;
  fetchCartProducts: (userId: string | undefined) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cartProducts: null,
  isLoading: true,
  fetchCartProducts: async (userId) => {
    if (!userId) {
      set({ isLoading: false });
      return;
    }
    const cachedCartProducts = sessionStorage.getItem("cart");
    if (cachedCartProducts) {
      set({ cartProducts: JSON.parse(cachedCartProducts), isLoading: false });
    } else {
      try {
        const fetchedCartProducts = await fetchCart(userId);
        set({ cartProducts: fetchedCartProducts });
        sessionStorage.setItem("cart", JSON.stringify(fetchedCartProducts));
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
      } finally {
        set({ isLoading: false });
      }
    }
  },
}));
