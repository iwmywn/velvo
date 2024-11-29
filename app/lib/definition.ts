export type Customer = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type ProductSize = {
  id: number;
  product_id: number;
  size: "S" | "M" | "L" | "XL";
  quantity: number;
};

export type Invoice = {
  id: number;
  customer_id: number;
  shipAddress: string;
  phone: number;
  status: "Processing" | "Completed" | "Rejected";
};

export type InvoiceDetails = {
  id: number;
  invoice_id: number;
  productSize_id: number;
  quantity: number;
};

export type Cart = {
  id: number;
  customer_id: number;
};

export type CartDetails = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  category_id: number;
  saleOff: number;
};
