import { Dispatch, SetStateAction } from "react";
import { Product, Cart, InvoiceList } from "@lib/definitions";

export function createResponse(message: string, status: number) {
  return new Response(JSON.stringify({ message }), { status });
}

export async function handleTokenVerification(
  endpoint: string,
  setStatus: Dispatch<SetStateAction<"success" | "error" | null>>,
  setMessage: Dispatch<SetStateAction<string>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  token: string | undefined,
) {
  if (token) {
    try {
      const res = await fetch(`/api/auth/${endpoint}?token=${token}`);
      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Verification Token Error: ", error);
      setStatus("error");
      setMessage("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  } else {
    setStatus("error");
    setMessage("Invalid token!");
    setLoading(false);
  }
}

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
  products: (Product & { quantity: number })[] | null,
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

export function transformProducts(
  products: {
    productId: string;
    quantity: number;
    size: string;
    priceCents: number;
    saleOff: number;
  }[],
): {
  productId: string;
  quantity: number;
  size: string;
  discountedPriceDetails: string[];
}[] {
  return products.map((product) => ({
    productId: product.productId,
    quantity: product.quantity,
    size: product.size,
    discountedPriceDetails: [
      getPriceAfterDiscount(product.priceCents, product.saleOff),
      getPriceAfterDiscount(
        product.priceCents,
        product.saleOff,
        product.quantity,
      ),
    ],
  }));
}

export function transformCartProducts(
  cartProducts: Cart["products"] | null,
  products: Product[],
): (Product & { quantity: number; size: string })[] | null {
  if (!cartProducts || !products) return null;

  const productMap = new Map(
    products.map((product) => [product.productId, product]),
  );

  return cartProducts
    .map((cartItem) => {
      const product = productMap.get(cartItem.productId);
      if (!product) return null;

      return {
        ...product,
        quantity: cartItem.quantity,
        size: cartItem.size,
      };
    })
    .filter(Boolean) as (Product & { quantity: number; size: string })[];
}

export function transformInvoiceProducts(
  invoiceProducts: InvoiceList["invoices"][0]["products"] | null,
  products: Product[],
):
  | (Product & {
      quantity: number;
      size: string;
      discountedPriceDetails: [string, string];
    })[]
  | null {
  if (!invoiceProducts) {
    return null;
  }

  const productMap = new Map(
    products.map((product) => [product.productId, product]),
  );

  return invoiceProducts
    .map((invoiceProduct) => {
      const product = productMap.get(invoiceProduct.productId);

      if (!product) return null;

      return {
        ...product,
        quantity: invoiceProduct.quantity,
        size: invoiceProduct.size,
        discountedPriceDetails: invoiceProduct.discountedPriceDetails,
      };
    })
    .filter(Boolean) as (Product & {
    quantity: number;
    size: string;
    discountedPriceDetails: [string, string];
  })[];
}
