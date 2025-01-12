import useSWR from "swr";
import axios from "axios";
import { Cart, InvoiceList } from "@lib/definitions";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useCart() {
  const { data, isLoading, error } = useSWR<{
    products: Cart["products"];
    quantity: number;
  }>("/api/store/cart", fetcher);

  const cart = data || { products: [], quantity: 0 };

  return {
    cart,
    isLoading,
    isError: error,
  };
}

export function useInvoices() {
  const { data, isLoading, error } = useSWR<InvoiceList["invoices"]>(
    "/api/store/invoices",
    fetcher,
  );

  const invoices = data || [];

  return {
    invoices,
    isLoading,
    isError: error,
  };
}
