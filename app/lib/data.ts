"use server";

import { connectToDatabase } from "@lib/mongodb";
import { Category, Product, InvoiceList, Cart } from "@lib/definitions";
import { ObjectId } from "mongodb";
import { baseImgUrl } from "@ui/data";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const db = await connectToDatabase();
    const categories = await db
      .collection<Category>("categories")
      .find({})
      .toArray();

    return categories.map(({ _id, ...rest }) => ({
      ...rest,
      categoryId: _id.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const db = await connectToDatabase();
    const products = await db
      .collection<Product>("products")
      .find({})
      .toArray();

    return products.map(({ _id, categoryId, images, ...rest }) => ({
      ...rest,
      productId: _id.toString(),
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
    const db = await connectToDatabase();
    const cart = await db
      .collection("carts")
      .findOne({ userId: new ObjectId(userId) });

    if (!cart || cart.products.length === 0) return null;

    return cart.products.map(
      ({ productId, ...rest }: { productId: ObjectId }) => ({
        ...rest,
        productId: productId.toString(),
      }),
    );
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
    const db = await connectToDatabase();

    const invoiceList = await db.collection("invoiceLists").findOne({
      userId: new ObjectId(userId),
    });

    if (!invoiceList || !invoiceList.invoices) return null;

    return invoiceList.invoices.map(
      ({
        invoiceId,
        products,
        ...rest
      }: {
        invoiceId: ObjectId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products: any[];
      }) => ({
        ...rest,
        invoiceId: invoiceId.toString(),
        products: products.map((product) => ({
          ...product,
          productId: product.productId.toString(),
        })),
      }),
    );
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}
