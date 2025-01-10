import { collection } from "@lib/mongodb";
import {
  UserBase,
  InvoiceBase,
  CartBase,
  CategoryBase,
  ProductBase,
} from "@lib/definitions";
import { ObjectId } from "mongodb";

export async function getUserCollection() {
  return await collection<UserBase>("users");
}

export async function getInvoiceListCollection() {
  return await collection<{
    userId: string;
    invoices: Array<
      {
        invoiceId: ObjectId;
      } & InvoiceBase
    >;
  }>("invoiceLists");
}

export async function getCartCollection() {
  return await collection<CartBase>("carts");
}

export async function getCategoryCollection() {
  return await collection<CategoryBase>("categories");
}

export async function getProductCollection() {
  return await collection<ProductBase>("products");
}
