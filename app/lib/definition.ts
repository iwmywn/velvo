export type Customer = {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
};

export type DeliveryAddress = {
  id: string;
  customerId: string;
  addresses: [
    {
      recipient: string;
      phone: string;
      address: string;
    },
  ];
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
};

export type Size = {
  id: string;
  productId: string;
  size: "WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  quantity: number;
};
