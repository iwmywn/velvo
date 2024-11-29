const mockOrders = [
  {
    id: "ShBg5PDzEFBrW3dT",
    products: [
      {
        src: "/men_1.png",
        name: "Young Green College Varsity Jacket",
        quantity: 2,
        priceCents: 4545,
      },
      {
        src: "/women_1.png",
        name: "Cardigan",
        quantity: 1,
        priceCents: 7000,
      },
    ],
  },
  {
    id: "7qSZpM7NQ2RMhzBP",
    products: [
      {
        src: "/women_2.png",
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
    src: "/men_1.png",
    name: "Young Green College Varsity Jacket",
    priceCents: 4545,
    quantity: 2,
  },
  {
    src: "/women_1.png",
    name: "Cardigan",
    priceCents: 7000,
    quantity: 1,
  },
].map((product) => ({
  ...product,
  totalPriceCents: product.priceCents * product.quantity,
}));

const productsByCategory: Record<
  string,
  {
    id: number;
    name: string;
    priceCents: number;
    images: string[];
    saleOff: number;
  }[]
> = {
  men: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Men's Product ${i + 1}`,
    priceCents: Math.floor(Math.random() * 100 * 100),
    images: ["/men.png", "/women.png", "/kids.png"],
    saleOff: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
  })),
  women: Array.from({ length: 20 }, (_, i) => ({
    id: i + 21,
    name: `Women's Product ${i + 21}`,
    priceCents: Math.floor(Math.random() * 100 * 100),
    images: ["/women.png", "/men.png", "/kids.png"],
    saleOff: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
  })),
  kids: Array.from({ length: 20 }, (_, i) => ({
    id: i + 41,
    name: `Kids' Product ${i + 41}`,
    priceCents: Math.floor(Math.random() * 100 * 100),
    images: ["/kids.png", "/women.png", "/men.png"],
    saleOff: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
  })),
};

export { mockOrders, mockProducts, productsByCategory };
