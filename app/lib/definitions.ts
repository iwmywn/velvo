export type User = {
  userId: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  image: string;
  verificationToken: string;
  resendVerification: number;
  address: {
    recipient: string;
    phone: string;
    address: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceList = {
  invoiceListId: string;
  userId: string;
  invoices: {
    invoiceId: string;
    recipient: string;
    phone: string;
    address: string;
    status: "waiting" | "processing" | "completed" | "cancelled";
    totalPriceCents: string;
    products: {
      productId: string;
      quantity: number;
      size: string;
      /**
       * [0] - Price after discount (cents)
       * [1] - Total price after discount (cents, including quantity)
       */
      discountedPriceDetails: [string, string];
    }[];
    orderDate: Date;
    receivedDate: Date;
  }[];
};

export type Cart = {
  cartId: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
  }[];
};

export type Category = {
  categoryId: string;
  name: string;
};

export type Product = {
  productId: string;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  categoryId: string;
  saleOff: number;
  slug: string;
  customerGroup: "men" | "women" | "kids";
  sizes: { [key: string]: number };
  keyFeatures: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type SessionPayload = {
  userId: string;
  image: string;
  expires: Date;
};
