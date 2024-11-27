import { GiShoppingCart } from "react-icons/gi";

export const emptyStates = {
  cart: {
    icon: <GiShoppingCart fontSize={50} />,
    title: "Your cart is empty",
    description: "Looks like you have not added anything to your cart yet.",
    href: "/",
    text: "Continue shopping",
  },
  orders: {
    icon: <GiShoppingCart fontSize={50} />,
    title: "No Completed Orders",
    description:
      "You haven't completed any orders yet. Start shopping and place your first order!",
    href: "/",
    text: "Continue shopping",
  },
};
