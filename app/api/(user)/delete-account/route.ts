"use server";

import { deleteAccountScheme } from "@/schemas";
import { createResponse } from "@api/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { verifySession } from "@lib/dal";
import {
  getCartCollection,
  getInvoiceListCollection,
  getUserCollection,
} from "@lib/collections";

export async function DELETE(req: Request) {
  const data = await req.json();
  const parsedCredentials = deleteAccountScheme.safeParse(data);
  const { userId } = await verifySession();

  if (!userId) return createResponse("User is not authenticated!", 401);
  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;
  const [userCollection, cartCollection, invoiceListCollection] =
    await Promise.all([
      getUserCollection(),
      getCartCollection(),
      getInvoiceListCollection(),
    ]);
  const existingUser = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) return createResponse("Password is not correct", 400);

  await Promise.all([
    userCollection.deleteOne({ _id: new ObjectId(userId) }),
    cartCollection.deleteOne({ userId: new ObjectId(userId) }),
    invoiceListCollection.deleteOne({ userId: new ObjectId(userId) }),
  ]);

  return createResponse("Good bye.", 201);
}
