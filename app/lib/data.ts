"use server";

import { connectToDatabase } from "@lib/mongodb";
import { Category, User, Product } from "@lib/definition";
import { ObjectId } from "mongodb";

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

/**
 *
 * @param identifier - Email or ID of the user
 * @returns The user document, if found
 */
export async function getUserByIdentifier(identifier: string) {
  try {
    const db = await connectToDatabase();
    let query;

    if (ObjectId.isValid(identifier)) {
      query = { _id: new ObjectId(identifier) };
    } else {
      query = { email: identifier };
    }

    const user = await db.collection<User>("users").findOne(query);
    return user;
  } catch (e) {
    console.error("Failed to fetch user:", e);
    throw new Error("Failed to fetch user.");
  }
}
