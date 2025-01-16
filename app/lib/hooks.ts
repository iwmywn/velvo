import useSWR from "swr";
import { Cart, InvoiceList } from "@lib/definitions";
import { getCart, getInvoices } from "@lib/data";

export interface CartResponse {
  products: Cart["products"];
  quantity: number;
  error?: string;
}

export interface InvoicesResponse {
  invoices: InvoiceList["invoices"];
  error?: string;
}

export function useCart() {
  const { data, isLoading } = useSWR<CartResponse>("cart", getCart);
  const cart = data || { products: [], quantity: 0 };
  const isError = data?.error || null;

  return {
    cart,
    isLoading,
    isError,
  };
}

export function useInvoices() {
  const { data, isLoading } = useSWR<InvoicesResponse>("invoices", getInvoices);
  const invoices = data?.invoices || [];
  const isError = data?.error || null;

  return {
    invoices,
    isLoading,
    isError,
  };
}
