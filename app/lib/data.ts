"use server";

import { connectToDatabase } from "@lib/mongodb";
import {
  Category,
  Product,
  Cart,
  Products,
  CartProductsProps,
  InvoiceProductsProps,
} from "@lib/definition";
import { ObjectId } from "mongodb";

export interface AuthContextType {
  isSignedIn: boolean;
  userId?: string;
}

export async function fetchCategories() {
  try {
    const db = await connectToDatabase();
    const categories = await db
      .collection<Category>("categories")
      .find({})
      .toArray();

    return categories.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function fetchProducts() {
  try {
    const db = await connectToDatabase();
    const products = await db
      .collection<Product>("products")
      .find({})
      .toArray();

    return products.map(({ _id, categoryId, ...rest }) => ({
      ...rest,
      id: _id.toString(),
      categoryId: categoryId.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch products.");
  }
}

export async function fetchCartProducts(
  userId: string | undefined,
): Promise<(Product & { quantity: number })[] | null> {
  if (!userId) return null;

  try {
    const db = await connectToDatabase();
    const cart = await db
      .collection("carts")
      .findOne({ userId: new ObjectId(userId) });

    if (!cart) return null;

    const productIds = cart.products.map(
      (p: Products) => new ObjectId(p.productId),
    );
    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    const result = products.map((product) => {
      const quantity: number = cart.products.find(
        (p: Products) => p.productId.toString() === product._id.toString(),
      ).quantity;

      return {
        id: product._id.toString(),
        name: product.name,
        priceCents: product.priceCents,
        images: product.images,
        description: product.description,
        categoryId: product.categoryId.toString(),
        saleOff: product.saleOff,
        slug: product.slug,
        sizes: product.sizes,
        quantity,
      };
    });

    return result;
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch carts.");
  }
}

export async function fetchInvoiceProducts(userId: string | undefined): Promise<
  | {
      invoiceId: string;
      status: "WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
      products: (Product & { quantity: number })[];
    }[]
  | null
> {
  if (!userId) return null;

  try {
    const db = await connectToDatabase();

    const invoices = await db
      .collection("invoices")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    if (!invoices.length) return null;

    const results = await Promise.all(
      invoices.map(async (invoice) => {
        const productIds = invoice.products.map(
          (p: Products) => new ObjectId(p.productId),
        );

        const products = await db
          .collection("products")
          .find({ _id: { $in: productIds } })
          .toArray();

        const enrichedProducts = products.map((product) => {
          const quantity: number = invoice.products.find(
            (p: Products) => p.productId.toString() === product._id.toString(),
          ).quantity;

          return {
            id: product._id.toString(),
            name: product.name,
            priceCents: product.priceCents,
            images: product.images,
            description: product.description,
            categoryId: product.categoryId.toString(),
            saleOff: product.saleOff,
            slug: product.slug,
            sizes: product.sizes,
            quantity: quantity,
          };
        });

        return {
          invoiceId: invoice._id.toString(),
          status: invoice.status,
          products: enrichedProducts,
        };
      }),
    );

    return results;
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}
