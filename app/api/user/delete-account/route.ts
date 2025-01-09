"use server";

import { deleteAccountScheme } from "@/schemas";
import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "@lib/definitions";
import { verifySession } from "@lib/dal";

export async function DELETE(req: Request) {
  const data = await req.json();
  const parsedCredentials = deleteAccountScheme.safeParse(data);
  const { isAuth, userId } = await verifySession();

  if (!isAuth) return createResponse("User is not authenticated!", 401);
  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const db = await connectToDatabase();
  const existingUser = await db
    .collection<User>("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) return createResponse("Password is not correct", 400);

  await Promise.all([
    db.collection("users").deleteOne({ _id: new ObjectId(userId) }),
    db.collection("carts").deleteOne({ userId: new ObjectId(userId) }),
    db.collection("invoiceLists").deleteOne({ userId: new ObjectId(userId) }),
  ]);

  return createResponse("Good bye.", 201);
}
