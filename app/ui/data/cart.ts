const mockOrders = [
  {
    id: "82893usax3ep57qq53a6wf83fqahkc",
    products: [
      {
        href: "/men_1.png",
        name: "Young Green College Varsity Jacket",
        quantity: 2,
        priceCents: 4545,
      },
      {
        href: "/women_1.png",
        name: "Cardigan",
        quantity: 1,
        priceCents: 7000,
      },
    ],
  },
  {
    id: "e7g5g79cvcrtyb4zwv7g386c58gea5",
    products: [
      {
        href: "/women_2.png",
        name: "Tiffany Dress",
        quantity: 1,
        priceCents: 12000,
      },
    ],
  },
].map((order) => ({
  ...order,
  totalPriceCents: order.products.reduce(
    (total, product) => total + product.priceCents * product.quantity,
    0,
  ),
}));

const mockProducts = [
  {
    href: "/men_1.png",
    name: "Young Green College Varsity Jacket",
    priceCents: 4545,
    quantity: 2,
  },
  {
    href: "/women_1.png",
    name: "Cardigan",
    priceCents: 7000,
    quantity: 1,
  },
].map((product) => ({
  ...product,
  totalPriceCents: product.priceCents * product.quantity,
}));

export { mockOrders, mockProducts };
