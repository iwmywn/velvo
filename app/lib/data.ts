"use server";

import { connectToDatabase } from "@lib/mongodb";
import {
  Category,
  Product,
  Products,
  CartProductsProps,
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
): Promise<(Product & { quantity: number; size: string })[] | null> {
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

    if (productIds.length === 0) return null;

    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    const result = cart.products.map((cartProduct: Products) => {
      const product = products.find(
        (p) => p._id.toString() === cartProduct.productId.toString(),
      );

      if (!product) return null;

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
        quantity: cartProduct.quantity,
        size: cartProduct.size,
      };
    });

    return result.filter(
      (item: CartProductsProps): item is NonNullable<typeof item> => !!item,
    );
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch carts.");
  }
}

export async function fetchInvoiceProducts(userId: string | undefined): Promise<
  | {
      invoiceId: string;
      recipient: string;
      phone: string;
      address: string;
      date: Date;
      status: "WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
      products: (Product & {
        quantity: number;
        size: string;
        priceCentsAfterDiscount: string[];
      })[];
      totalPriceCents: string;
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

        const enrichedProducts = invoice.products.map(
          (invoiceProducts: Products) => {
            const product = products.find(
              (p) => p._id.toString() === invoiceProducts.productId.toString(),
            );

            if (!product) return null;

            return {
              id: product._id.toString(),
              name: product.name,
              images: product.images,
              description: product.description,
              categoryId: product.categoryId.toString(),
              saleOff: product.saleOff,
              slug: product.slug,
              sizes: product.sizes,
              quantity: invoiceProducts.quantity,
              size: invoiceProducts.size,
              priceCentsAfterDiscount: [
                invoiceProducts.priceCentsAfterDiscount[0],
                invoiceProducts.priceCentsAfterDiscount[1],
              ],
            };
          },
        );

        return {
          invoiceId: invoice._id.toString(),
          recipient: invoice.recipient,
          phone: invoice.phone,
          address: invoice.address,
          date: invoice.date,
          status: invoice.status,
          products: enrichedProducts,
          totalPriceCents: invoice.totalPriceCents,
        };
      }),
    );

    return results;
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchCartProductQuantity(
  userId: string | undefined,
): Promise<number> {
  if (!userId) return 0;

  try {
    const db = await connectToDatabase();
    const cart = await db
      .collection("carts")
      .findOne({ userId: new ObjectId(userId) });

    if (!cart || !cart.products || cart.products.length === 0) return 0;

    const totalQuantity = cart.products.reduce(
      (sum: number, product: { quantity: number }) => {
        return sum + product.quantity;
      },
      0,
    );

    return totalQuantity;
  } catch (error) {
    console.error("Error fetching cart product count:", error);
    return 0;
  }
}
