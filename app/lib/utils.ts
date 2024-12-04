import {
  // customers,
  carts,
  invoices,
  invoiceDetails,
  products,
  // categories,
  // productSizes,
} from "@lib/placeholder-data";
import {
  // Customer,
  // Cart,
  // Invoice,
  // InvoiceDetails,
  Product,
  // Category,
  // ProductSize,
} from "./definition";

function shuffleProduct(product: Product[]) {
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

function generateSlugWithRandom(
  category: string,
  name: string,
  description: string,
): string {
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((byte) => byte.toString(36).padStart(2, "0"))
    .join("")
    .substring(0, 16);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return `${normalize(category)}-${normalize(name)}-${normalize(description)}-${randomString}`;
}

function formatCurrency(priceCents: number): string {
  return (Math.round(priceCents) / 100).toFixed(2);
}

function getPriceAfterDiscount(
  priceCents: number,
  saleOff: number,
  quantity: number = 1,
): string {
  return formatCurrency((priceCents - (priceCents * saleOff) / 100) * quantity);
}

function getTotalPriceCents(
  products: (Product & { quantity: number })[],
): string {
  return formatCurrency(
    products.reduce(
      (total, product) => total + product.priceCents * product.quantity,
      0,
    ),
  );
}

function getCartIdByCustomerId(customerId: number): number | null {
  const cartItem = carts.find((cart) => cart.customer_id === customerId);
  return cartItem ? cartItem.id : null;
}

function getProductDetailsByCartId(
  cartId: number,
): { product_id: number; quantity: number }[] {
  const cartItem = carts.find((detail) => detail.id === cartId);

  if (!cartItem) {
    return [];
  }

  return cartItem.products;
}

function getCartProductsByCustomerId(
  customerId: number,
): (Product & { quantity: number })[] {
  const cartId = getCartIdByCustomerId(customerId);
  if (!cartId) return [];

  const productDetails = getProductDetailsByCartId(cartId);
  return getProductsByDetails(productDetails);
}

function getInvoiceIdsByCustomerId(
  customerId: number,
  status: string,
): number[] {
  const invoicesForCustomer = invoices.filter(
    (invoice) =>
      invoice.customer_id === customerId && invoice.status === status,
  );
  return invoicesForCustomer.map((invoice) => invoice.id);
}

function getProductDetailsByInvoiceId(
  invoiceId: number,
): { product_id: number; quantity: number }[] {
  const invoice = invoiceDetails.find(
    (detail) => detail.invoice_id === invoiceId,
  );

  if (!invoice) {
    return [];
  }

  return invoice.products;
}

function getInvoiceProductsByCustomerId(
  customerId: number,
  status: "PROCESSING" | "COMPLETED" | "CANCELLED",
): { invoiceId: number; products: (Product & { quantity: number })[] }[] {
  const invoiceIds = getInvoiceIdsByCustomerId(customerId, status);

  if (invoiceIds.length === 0) return [];

  const invoicesWithProducts = invoiceIds.map((invoiceId) => {
    const productDetails = getProductDetailsByInvoiceId(invoiceId);
    const products = getProductsByDetails(productDetails);

    return {
      invoiceId,
      products,
    };
  });

  return invoicesWithProducts;
}

function getProductsByDetails(
  productDetails: { product_id: number; quantity: number }[],
): (Product & { quantity: number })[] {
  return productDetails
    .map((detail) => {
      const product = products.find(
        (product) => product.id === detail.product_id,
      );
      return product ? { ...product, quantity: detail.quantity } : null;
    })
    .filter(
      (result): result is Product & { quantity: number } => result !== null,
    );
}

export {
  shuffleProduct,
  generateSlugWithRandom,
  formatCurrency,
  getPriceAfterDiscount,
  getTotalPriceCents,
  getCartProductsByCustomerId,
  getInvoiceProductsByCustomerId,
};
