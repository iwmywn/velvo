"use server";

import { changePasswordWithIdScheme } from "@/schemas";
import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "@lib/definition";

export async function PATCH(req: Request) {
  const data = await req.json();
  const parsedCredentials = changePasswordWithIdScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { userId, confirmPassword, currentPassword } = parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const db = await connectToDatabase();
  const existingUser = await db
    .collection<User>("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(
    currentPassword,
    existingUser.password,
  );

  if (!isMatchPassword)
    return createResponse("Current password is not correct", 400);

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);

  const result = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
    );

  if (result.modifiedCount === 0)
    return createResponse("Password update failed! Try again later.", 500);

  return createResponse("Your password has been changed.", 201);
}
