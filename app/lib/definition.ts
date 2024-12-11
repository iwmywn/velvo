export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  address: [
    {
      recipient: string;
      phone: string;
      address: string;
    },
  ];
  verificationToken: string;
  resendVerification: number;
};

export type Invoice = {
  id: string;
  customerId: string;
  recipient: string;
  phone: string;
  address: string;
  date: Date;
  status: string;
  products: [
    {
      productId: string;
      quantity: number;
    },
  ];
};

export type Cart = {
  id: string;
  customerId: string;
  products: [
    {
      productId: string;
      quantity: number;
    },
  ];
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
  size: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
};
