import { ObjectId } from "mongodb";

type BaseAvatar<T> = {
  _id: T;
  image: string;
};

type BaseBanner<T> = {
  _id: T;
  name: string;
  slug: string;
  image: string;
};

type BaseCollection<T> = {
  _id: T;
  name: string;
  image: string;
  slug: string;
};

type BaseUser<T> = {
  _id: T;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
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
      color: string;
      size?: string;
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
    color: string;
    size?: string;
  }[];
};

type BaseCategories<T> = {
  _id: T;
  name: string;
  slug: string;
  subcategories: { name: string; slug: string; productIds: T[] }[];
};

type BaseProduct<T> = {
  _id: T;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  saleOff: number;
  slug: string;
  colors: {
    [color: string]: { sizes: { [size: string]: number } } | number;
  };
  availableColors: string[];
  keyFeatures: string[];
  createdAt: Date;
  updatedAt?: Date;
};

export type Avatar = BaseAvatar<string>;
export type DBAvatar = BaseAvatar<ObjectId>;

export type Banner = BaseBanner<string>;
export type DBBanner = BaseBanner<ObjectId>;

export type Collection = BaseCollection<string>;
export type DBCollection = BaseCollection<ObjectId>;

export type User = BaseUser<string>;
export type DBUser = BaseUser<ObjectId>;

export type InvoiceList = BaseInvoiceList<string>;
export type DBInvoiceList = BaseInvoiceList<ObjectId>;

export type Cart = BaseCart<string>;
export type DBCart = BaseCart<ObjectId>;

export type CustomerCategories = BaseCategories<string>;
export type DBCustomerCategories = BaseCategories<ObjectId>;

export type Product = BaseProduct<string>;
export type DBProduct = BaseProduct<ObjectId>;
