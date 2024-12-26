import { CartProductsProps } from "@lib/definition";
import { fetchCart } from "@lib/data";
import { create } from "zustand";

interface CartState {
  cartProducts: CartProductsProps;
  isLoading: boolean;
  fetchCartProducts: (userId: string | undefined) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cartProducts: [],
  isLoading: true,
  fetchCartProducts: async (userId) => {
    const cachedCartProducts = sessionStorage.getItem("cartProducts");
    if (cachedCartProducts) {
      set({ cartProducts: JSON.parse(cachedCartProducts), isLoading: false });
    } else {
      try {
        const fetchedCartProducts = await fetchCart(userId);
        set({ cartProducts: fetchedCartProducts });
        sessionStorage.setItem(
          "cartProducts",
          JSON.stringify(fetchedCartProducts),
        );
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
      } finally {
        set({ isLoading: false });
      }
    }
  },
}));
