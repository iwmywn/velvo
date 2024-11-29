import {
  Cart,
  CartDetails,
  Category,
  Customer,
  Invoice,
  InvoiceDetails,
  Product,
  ProductSize,
} from "./definition";

export const customers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    password: "hashedpassword123",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "hashedpassword456",
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    password: "charliepassword789",
  },
];

export const carts: Cart[] = [
  {
    id: 1,
    customer_id: 1,
  },
  {
    id: 2,
    customer_id: 2,
  },
  {
    id: 3,
    customer_id: 3,
  },
];

export const cartDetails: CartDetails[] = [
  { id: 1, cart_id: 1, product_id: 10, quantity: 2 },
  { id: 2, cart_id: 2, product_id: 20, quantity: 1 },
  { id: 3, cart_id: 3, product_id: 30, quantity: 5 },
];

export const invoices: Invoice[] = [
  {
    id: 1,
    customer_id: 1,
    recipientName: "John Doe",
    phone: "1234567890",
    shipAddress: "123 Main St",
    date: new Date("2024-11-15"),
    status: "Processing",
  },
  {
    id: 2,
    customer_id: 2,
    recipientName: "Jane Smith",
    phone: "9876543210",
    shipAddress: "456 Elm St",
    date: new Date("2024-11-20"),
    status: "Completed",
  },
  {
    id: 3,
    customer_id: 3,
    recipientName: "Charlie",
    phone: "1122334455",
    shipAddress: "789 Oak St",
    date: new Date("2024-11-10"),
    status: "Rejected",
  },
];

export const invoiceDetails: InvoiceDetails[] = [
  { id: 1, invoice_id: 1, product_id: 10, quantity: 2 },
  { id: 2, invoice_id: 2, product_id: 20, quantity: 1 },
  { id: 3, invoice_id: 3, product_id: 30, quantity: 4 },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Young Green College Varsity Jacket",
    priceCents: 4702,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 41,
  },
  {
    id: 2,
    name: "Tiffany Dress",
    priceCents: 9935,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 3,
    name: "Comfortable Hoodie",
    priceCents: 2117,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 5,
  },
  {
    id: 4,
    name: "Young Green College Varsity Jacket",
    priceCents: 4904,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 5,
    name: "Tiffany Dress",
    priceCents: 5112,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 6,
    name: "Comfortable Hoodie",
    priceCents: 3242,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 3,
  },
  {
    id: 7,
    name: "Young Green College Varsity Jacket",
    priceCents: 7953,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 35,
  },
  {
    id: 8,
    name: "Tiffany Dress",
    priceCents: 4714,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 9,
    name: "Comfortable Hoodie",
    priceCents: 6067,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 0,
  },
  {
    id: 10,
    name: "Young Green College Varsity Jacket",
    priceCents: 6738,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 11,
    name: "Tiffany Dress",
    priceCents: 5926,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 12,
    name: "Comfortable Hoodie",
    priceCents: 4013,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 16,
  },
  {
    id: 13,
    name: "Young Green College Varsity Jacket",
    priceCents: 3257,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 14,
    name: "Tiffany Dress",
    priceCents: 3859,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 25,
  },
  {
    id: 15,
    name: "Comfortable Hoodie",
    priceCents: 6860,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 0,
  },
  {
    id: 16,
    name: "Young Green College Varsity Jacket",
    priceCents: 8051,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 17,
    name: "Tiffany Dress",
    priceCents: 3817,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 41,
  },
  {
    id: 18,
    name: "Comfortable Hoodie",
    priceCents: 3281,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 20,
  },
  {
    id: 19,
    name: "Young Green College Varsity Jacket",
    priceCents: 5587,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 45,
  },
  {
    id: 20,
    name: "Tiffany Dress",
    priceCents: 5298,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 27,
  },
  {
    id: 21,
    name: "Comfortable Hoodie",
    priceCents: 4293,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 16,
  },
  {
    id: 22,
    name: "Young Green College Varsity Jacket",
    priceCents: 1745,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 23,
    name: "Tiffany Dress",
    priceCents: 3030,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 24,
    name: "Comfortable Hoodie",
    priceCents: 9033,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 48,
  },
  {
    id: 25,
    name: "Young Green College Varsity Jacket",
    priceCents: 8094,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 26,
    name: "Tiffany Dress",
    priceCents: 9436,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 0,
  },
  {
    id: 27,
    name: "Comfortable Hoodie",
    priceCents: 4342,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 5,
  },
  {
    id: 28,
    name: "Young Green College Varsity Jacket",
    priceCents: 6605,
    images: ["/men.png", "/women.png", "/kids.png"],
    description: "description",
    category_id: 1,
    saleOff: 0,
  },
  {
    id: 29,
    name: "Tiffany Dress",
    priceCents: 8574,
    images: ["/women.png", "/men.png", "/kids.png"],
    description: "description",
    category_id: 2,
    saleOff: 27,
  },
  {
    id: 30,
    name: "Comfortable Hoodie",
    priceCents: 6863,
    images: ["/kids.png", "/women.png", "/men.png"],
    description: "description",
    category_id: 3,
    saleOff: 41,
  },
];

export const categories: Category[] = [
  {
    id: 1,
    name: "men",
    description:
      "Discover a collection of stylish, dynamic, and versatile fashion pieces for men, perfect for any occasion.",
  },
  {
    id: 2,
    name: "women",
    description:
      "Express your personality and unique style with elegant and modern designs crafted for women.",
  },
  {
    id: 3,
    name: "kids",
    description:
      "Explore adorable, comfortable, and safe collections for kids, perfect for everyday activities.",
  },
];

export const productSizes: ProductSize[] = [
  {
    id: 1,
    product_id: 1,
    size: "S",
    quantity: 50,
  },
  {
    id: 2,
    product_id: 1,
    size: "M",
    quantity: 30,
  },
  {
    id: 3,
    product_id: 2,
    size: "L",
    quantity: 20,
  },
  {
    id: 4,
    product_id: 3,
    size: "XL",
    quantity: 10,
  },
];

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

export { mockOrders, mockProducts };
