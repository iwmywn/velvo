"use server";

import { changeEmailScheme } from "@/schemas";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getUserByIdentifier } from "@lib/actions";
import { verifySession } from "@lib/dal";
import { getUserCollection } from "@lib/collections";

export async function PATCH(req: Request) {
  const data = await req.json();
  const parsedCredentials = changeEmailScheme.safeParse(data);
  const { isAuth, userId } = await verifySession();

  if (!isAuth) return createResponse("User is not authenticated!", 401);
  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { confirmEmail, password } = parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const existingEmail = await getUserByIdentifier(confirmEmail);

  if (existingEmail)
    return createResponse("This email is already in use!", 400);

  const userCollection = await getUserCollection();
  const existingUser = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!existingUser) return createResponse("User not found!", 404);

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) return createResponse("Password is not correct", 400);

  const result = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { email: confirmEmail, updatedAt: new Date() } },
  );

  if (result.modifiedCount === 0)
    return createResponse("Email update failed! Try again later.", 500);

  return createResponse("Your email has been changed.", 201);
}
