export type Customer = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type Cart = {
  id: number;
  customer_id: number;
  products: { product_id: number; quantity: number }[];
};

export type Invoice = {
  id: number;
  customer_id: number;
  recipientName: string;
  phone: string;
  shipAddress: string;
  date: Date;
  status: "PROCESSING" | "COMPLETED" | "CANCELLED";
};

export type InvoiceDetails = {
  id: number;
  invoice_id: number;
  products: { product_id: number; quantity: number }[];
};

export type Product = {
  id: number;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  category_id: number;
  saleOff: number;
  slug: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type ProductSize = {
  id: number;
  product_id: number;
  size: "S" | "M" | "L" | "XL";
  quantity: number;
};
