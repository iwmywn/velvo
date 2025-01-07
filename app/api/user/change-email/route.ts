"use server";

import { changeEmailWithIdScheme } from "@/schemas";
import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { User } from "@lib/definition";
import { getUserByIdentifier } from "@lib/actions";

export async function PATCH(req: Request) {
  const data = await req.json();
  const parsedCredentials = changeEmailWithIdScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { userId, confirmEmail, password } = parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const existingEmail = await getUserByIdentifier(confirmEmail);

  if (existingEmail)
    return createResponse("This email is already in use!", 400);

  const db = await connectToDatabase();
  const existingUser = await db
    .collection<User>("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) return createResponse("Password is not correct", 400);

  const result = await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { email: confirmEmail, updatedAt: new Date() } },
    );

  if (result.modifiedCount === 0)
    return createResponse("Email update failed! Try again later.", 500);

  return createResponse("Your email has been changed.", 201);
}
