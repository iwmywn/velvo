"use server";

import { Category, Product, InvoiceList, Cart } from "@lib/definitions";
import { baseImgUrl } from "@ui/data";
import {
  getInvoiceListCollection,
  getCartCollection,
  getCategoryCollection,
  getProductCollection,
} from "@lib/collections";
import { ObjectId } from "mongodb";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await (await getCategoryCollection()).find({}).toArray();

    return categories.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await (await getProductCollection()).find({}).toArray();

    return products.map(({ _id, categoryId, images, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      categoryId: categoryId.toString(),
      images: images.map((image) => baseImgUrl + image),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch products.");
  }
}

export async function fetchCart(
  userId: string | undefined,
): Promise<Cart["products"] | null> {
  if (!userId) return null;

  try {
    const cart = await (
      await getCartCollection()
    ).findOne({ userId: new ObjectId(userId) });

    if (!cart || cart.products.length === 0) return null;

    return cart.products.map(({ productId, ...rest }) => ({
      ...rest,
      productId: productId.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch carts.");
  }
}

export async function fetchCartQuantity(
  userId: string | undefined,
): Promise<number> {
  const products = await fetchCart(userId);
  if (!products) return 0;

  return products.reduce((sum, product) => sum + product.quantity, 0);
}

export async function fetchInvoices(
  userId: string | undefined,
): Promise<InvoiceList["invoices"] | null> {
  if (!userId) return null;

  try {
    const invoiceList = await (
      await getInvoiceListCollection()
    ).findOne({
      userId: new ObjectId(userId),
    });

    if (!invoiceList || !invoiceList.invoices) return null;

    return invoiceList.invoices.map(({ invoiceId, products, ...rest }) => ({
      ...rest,
      invoiceId: invoiceId.toString(),
      products: products.map(({ productId, ...rest }) => ({
        ...rest,
        productId: productId.toString(),
      })),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}
