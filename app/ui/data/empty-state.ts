export const emptyStates = {
  toPay: {
    title: "Your cart is empty",
    description: "Looks like you have not added anything to your cart yet.",
  },
  completed: {
    title: "No Completed Orders",
    description:
      "You haven't completed any orders yet. Start shopping and place your first order!",
  },
  toShipNReceive: {
    title: "No Orders to Ship or Receive",
    description:
      "You currently have no orders waiting to be shipped or received. Start shopping and place a new order!",
  },
  cancelled: {
    title: "No Cancelled Orders",
    description:
      "You don't have any cancelled orders yet. Shop with confidence and place your order today!",
  },
} as const;
