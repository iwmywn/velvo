"use server";

import { createResponse } from "@lib/utils";
import { connectToDatabase } from "@lib/mongodb";
import { placeOrderWithIdSchema } from "@/schemas";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedCredentials = placeOrderWithIdSchema.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { userId, fullName, phone, city, district, ward, address, products } =
    parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const transformedProducts = products.map(({ id, quantity, size }) => {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid product ID in products array");
    }
    return {
      productId: new ObjectId(id),
      quantity,
      size,
    };
  });

  const db = await connectToDatabase();

  await Promise.all([
    db.collection("invoices").insertOne({
      recipient: fullName,
      phone,
      address: `${address}, ${ward}, ${district}, ${city}`,
      date: new Date(),
      status: "WAITING",
      products: transformedProducts,
      userId: new ObjectId(userId),
    }),
    db
      .collection("carts")
      .updateOne({ userId: new ObjectId(userId) }, { $set: { products: [] } }),
    ...transformedProducts.map(async ({ productId, quantity, size }) => {
      const sizeField = `sizes.${size}`;
      await db
        .collection("products")
        .updateOne({ _id: productId }, { $inc: { [sizeField]: -quantity } });
    }),
  ]);

  revalidatePath("/user/purchase");
  return createResponse("Order created successfully!", 201);
}
