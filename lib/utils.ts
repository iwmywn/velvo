import { Product, Cart, InvoiceList } from "@lib/definitions";

export function shuffleProduct(product: Product[]) {
  const shuffledProduct = [...product];
  for (let i = shuffledProduct.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledProduct[i], shuffledProduct[j]] = [
      shuffledProduct[j],
      shuffledProduct[i],
    ];
  }
  return shuffledProduct;
}

export function formatCurrency(priceCents: number): string {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function getPriceAfterDiscount(
  priceCents: number,
  saleOff: number,
  quantity: number = 1,
): string {
  return formatCurrency((priceCents - (priceCents * saleOff) / 100) * quantity);
}

export function getTotalPriceCents(
  products: (Product & { quantity: number })[] | [],
): string {
  if (!products) return "0";
  return formatCurrency(
    products.reduce(
      (total, product) =>
        total +
        (product.priceCents - (product.priceCents * product.saleOff) / 100) *
          product.quantity,
      0,
    ),
  );
}

export function transformCartProducts(
  cartProducts: Cart["products"] | [],
  products: Product[],
): (Product & { quantity: number; color: string; size: string })[] {
  if (cartProducts.length === 0) return [];

  const productMap = new Map(products.map((product) => [product._id, product]));

  return cartProducts
    .map((cartItem) => {
      const product = productMap.get(cartItem.productId);
      if (!product) return null;

      return {
        ...product,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
      };
    })
    .filter(Boolean) as (Product & {
    quantity: number;
    color: string;
    size: string;
  })[];
}

export function transformInvoiceProducts(
  invoiceProducts: InvoiceList["invoices"][0]["products"] | [],
  products: Product[],
): (Product & {
  quantity: number;
  color: string;
  size: string;
  discountedPriceDetails: [string, string];
})[] {
  if (invoiceProducts.length === 0) return [];

  const productMap = new Map(products.map((product) => [product._id, product]));

  return invoiceProducts
    .map((invoiceProduct) => {
      const product = productMap.get(invoiceProduct.productId);

      if (!product) return null;

      return {
        ...product,
        quantity: invoiceProduct.quantity,
        color: invoiceProduct.color,
        size: invoiceProduct.size,
        discountedPriceDetails: invoiceProduct.discountedPriceDetails,
      };
    })
    .filter(Boolean) as (Product & {
    quantity: number;
    color: string;
    size: string;
    discountedPriceDetails: [string, string];
  })[];
}
