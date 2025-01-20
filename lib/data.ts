"use server";

import { Category, Product, Avatar, Banner } from "@lib/definitions";
import { baseImgUrl } from "@ui/data";
import {
  getCategoryCollection,
  getProductCollection,
  getAvatarCollection,
  getUserCollection,
  getCartCollection,
  getInvoiceListCollection,
  getBannerCollection,
} from "@lib/collections";
import { cache } from "react";
import { verifySession } from "@lib/dal";
import { ObjectId } from "mongodb";
import { CartResponse, InvoicesResponse } from "@lib/hooks";

export async function getUserByEmail(email: string) {
  try {
    const user = await (await getUserCollection()).findOne({ email });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export const getAvatars = cache(async (): Promise<Avatar[]> => {
  try {
    const avatars = await (await getAvatarCollection()).find({}).toArray();

    return avatars.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return [];
  }
});

export const getBanners = cache(async (): Promise<Banner[]> => {
  try {
    const banners = await (await getBannerCollection()).find({}).toArray();

    return banners.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.log("Failed to fetch banners:", error);
    return [];
  }
});

export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const categories = await (await getCategoryCollection()).find({}).toArray();

    return categories.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
});

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await (await getProductCollection()).find({}).toArray();

    return products.map(({ _id, categoryId, images, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      categoryId: categoryId.toString(),
      images: images.map((image) => baseImgUrl + image),
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
});

export async function getCart(): Promise<CartResponse> {
  try {
    const { userId } = await verifySession();
    if (!userId) {
      return { error: "Please sign in to view cart!" };
    }

    const cart = await (
      await getCartCollection()
    ).findOne({ userId: new ObjectId(userId) });

    if (!cart) {
      return { error: "Cart not found!" };
    }

    if (cart.products.length === 0)
      return { error: "Your shopping cart is empty." };

    const products = cart.products.map(({ productId, ...rest }) => ({
      ...rest,
      productId: productId.toString(),
    }));

    const quantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0,
    );

    return { products, quantity };
  } catch {
    return { error: "An unexpected error occurred!" };
  }
}

export async function getInvoices(): Promise<InvoicesResponse> {
  try {
    const { userId } = await verifySession();
    if (!userId) {
      return { error: "Please sign in to view invoices!" };
    }

    const invoiceList = await (
      await getInvoiceListCollection()
    ).findOne({ userId: new ObjectId(userId) });

    if (!invoiceList) {
      return { error: "Invoice List not found!" };
    }

    if (invoiceList.invoices.length === 0) return { error: "No invoice!" };

    const invoices = invoiceList.invoices.map(
      ({ invoiceId, products, ...rest }) => ({
        ...rest,
        invoiceId: invoiceId.toString(),
        products: products.map(({ productId, ...rest }) => ({
          ...rest,
          productId: productId.toString(),
        })),
      }),
    );

    return { invoices };
  } catch {
    return { error: "An unexpected error occurred!" };
  }
}
