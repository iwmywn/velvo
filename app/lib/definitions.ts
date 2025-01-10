export type UserBase = {
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

export type InvoiceBase = {
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
};

export type CartBase = {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    size: string;
  }[];
};

export type CategoryBase = {
  name: string;
};

export type ProductBase = {
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
  updatedAt?: Date;
};

export type SessionPayload = {
  userId: string;
  image: string;
  expires: Date;
};

export type User = UserBase & { _id: string };
// export type DBUser = UserBase & {
//   _id?: ObjectId;
// };

export type InvoiceList = {
  _id: string;
  userId: string;
  invoices: Array<
    {
      invoiceId: string;
    } & InvoiceBase
  >;
};
// export type DBInvoiceList = {
//   _id?: ObjectId;
//   userId: string;
//   invoices: Array<
//     {
//       invoiceId: ObjectId;
//     } & InvoiceBase
//   >;
// };

export type Cart = CartBase & {
  _id: string;
};
// export type DBCart = CartBase & {
//   _id?: ObjectId;
// };

export type Category = CategoryBase & {
  _id: string;
};
// export type DBCategory = CategoryBase & {
//   _id?: ObjectId;
// };

export type Product = ProductBase & {
  _id: string;
};
// export type DBProduct = ProductBase & {
//   _id?: ObjectId;
// };
