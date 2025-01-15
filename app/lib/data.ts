"use server";

import { Category, Product, Avatar } from "@lib/definitions";
import { baseImgUrl } from "@ui/data";
import {
  getCategoryCollection,
  getProductCollection,
  getAvatarCollection,
  getUserCollection,
} from "@lib/collections";
import { cache } from "react";

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
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch avatars.");
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
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch categories.");
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
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch products.");
  }
});
