"use server";

import { Category, Product, Avatar } from "@lib/definitions";
import { baseImgUrl } from "@ui/data";
import {
  getCategoryCollection,
  getProductCollection,
  getAvatarCollection,
} from "@lib/collections";

export async function getAvatars(): Promise<Avatar[]> {
  try {
    const avatars = await (await getAvatarCollection()).find({}).toArray();

    return avatars.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch avatars.");
  }
}

export async function getCategories(): Promise<Category[]> {
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

export async function getProducts(): Promise<Product[]> {
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
