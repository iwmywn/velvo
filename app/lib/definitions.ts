import { ObjectId } from "mongodb";

type BaseAvatar<T> = {
  _id: T;
  image: string;
};

type BaseUser<T> = {
  _id: T;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  image: string;
  verificationToken: string;
  resendVerification: number;
  address?: {
    recipient: string;
    phone: string;
    address: string;
  }[];
  createdAt: Date;
  updatedAt?: Date;
};

type BaseInvoiceList<T> = {
  _id: T;
  userId: T;
  invoices: {
    invoiceId: T;
    recipient: string;
    phone: string;
    address: string;
    status: "waiting" | "processing" | "completed" | "cancelled";
    totalPriceCents: string;
    products: {
      productId: T;
      quantity: number;
      size: string;
      /**
       * [0] - Price after discount (cents)
       * [1] - Total price after discount (cents, including quantity)
       */
      discountedPriceDetails: [string, string];
    }[];
    orderDate: Date;
    receivedDate?: Date;
  }[];
};

type BaseCart<T> = {
  _id: T;
  userId: T;
  products: {
    productId: T;
    quantity: number;
    size: string;
  }[];
};

type BaseCategory<T> = {
  _id: T;
  name: string;
};

type BaseProduct<T> = {
  _id: T;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  categoryId: T;
  saleOff: number;
  slug: string;
  customerGroup: "men" | "women" | "kids";
  sizes: { [key: string]: number };
  keyFeatures: string[];
  createdAt: Date;
  updatedAt?: Date;
};

export type SessionPayload = {
  userId: string;
  image: string;
};

export type Avatar = BaseAvatar<string>;
export type DBAvatar = BaseAvatar<ObjectId>;

export type User = BaseUser<string>;
export type DBUser = BaseUser<ObjectId>;

export type InvoiceList = BaseInvoiceList<string>;
export type DBInvoiceList = BaseInvoiceList<ObjectId>;

export type Cart = BaseCart<string>;
export type DBCart = BaseCart<ObjectId>;

export type Category = BaseCategory<string>;
export type DBCategory = BaseCategory<ObjectId>;

export type Product = BaseProduct<string>;
export type DBProduct = BaseProduct<ObjectId>;
