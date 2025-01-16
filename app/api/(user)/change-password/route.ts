"use server";

import { changePasswordScheme } from "@/schemas";
import { createResponse } from "@api/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { verifySession } from "@lib/dal";
import { getUserCollection } from "@lib/collections";

export async function PATCH(req: Request) {
  const data = await req.json();
  const parsedCredentials = changePasswordScheme.safeParse(data);
  const { userId } = await verifySession();

  if (!userId) return createResponse("User is not authenticated!", 401);
  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { confirmPassword, currentPassword } = parsedCredentials.data;
  const userCollection = await getUserCollection();
  const existingUser = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(
    currentPassword,
    existingUser.password,
  );

  if (!isMatchPassword)
    return createResponse("Current password is not correct", 400);

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);

  const result = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedPassword, updatedAt: new Date() } },
  );

  if (result.modifiedCount === 0)
    return createResponse("Password update failed! Try again later.", 500);

  return createResponse("Your password has been changed.", 201);
}
