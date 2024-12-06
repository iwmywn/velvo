import { connectToDatabase } from "@/lib/mongodb";

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  images: string[];
  description: string;
  categoryId: string;
  saleOff: number;
  slug: string;
};

type DatabaseCategory = Omit<Category, "id">;
type DatabaseProduct = Omit<Product, "id">;

export async function fetchCategories() {
  try {
    const db = await connectToDatabase();
    const categories = await db
      .collection<DatabaseCategory>("categories")
      .find({})
      .toArray();

    return categories.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
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
      .collection<DatabaseProduct>("products")
      .find({})
      .toArray();

    return products.map(({ _id, categoryId, ...rest }) => ({
      id: _id.toString(),
      categoryId: categoryId.toString(),
      ...rest,
    }));
  } catch (error) {
    console.error("MongoDB fetch error:", error);
    throw new Error("Failed to fetch products.");
  }
}
