import { ObjectId } from "mongodb";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  image: string;
  address: {
    recipient: string;
    phone: string;
    address: string;
  }[];
  verificationToken: string;
  resendVerification: number;
};

export type Invoice = {
  id: string;
  userId: string;
  recipient: string;
  phone: string;
  address: string;
  date: Date;
  status: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
  }[];
  totalPriceCents: string;
};

export type Cart = {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
  }[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  categoryId: string;
  saleOff: number;
  slug: string;
  sizes: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
  subCategory: string;
  keyFeatures: string[];
};

export type Products = {
  productId: ObjectId;
  quantity: number;
  size: string;
  priceCentsAfterDiscount: string[];
};

interface InvoiceWithProducts {
  invoiceId: string;
  recipient: string;
  phone: string;
  address: string;
  date: Date;
  status: "WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  products: (Product & {
    quantity: number;
    size: string;
    priceCentsAfterDiscount: string[];
  })[];
  totalPriceCents: string;
}

export type CartProductsProps =
  | {
      productId: string;
      quantity: number;
      size: string;
    }[]
  | null;
export type InvoiceProductsProps = InvoiceWithProducts[] | null;
