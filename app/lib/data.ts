"use server";

import { connectToDatabase } from "@lib/mongodb";
import { Category, Customer, Product } from "@lib/definition";

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

export async function getUserByEmail(email: string) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection<Customer>("customers").findOne({ email });

    return user;
  } catch (e) {
    console.error("Failed to fetch user:", e);
    throw new Error("Failed to fetch user.");
  }
}
