"use server";

import { resetPasswordScheme } from "@/schemas";
import { getUserCollection } from "@lib/collections";
import { createResponse } from "@api/utils";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const data = await req.json();
  const parsedCredentials = resetPasswordScheme.safeParse(data);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const { password } = parsedCredentials.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  // todo: filter (verificationToken & userid)
  const result = await (
    await getUserCollection()
  ).updateOne(
    { verificationToken: token! },
    {
      $set: { password: hashedPassword },
      $unset: { verificationToken: "", resendVerification: "" },
    },
  );

  if (result.matchedCount === 0) return createResponse("Token expired!", 404);

  if (result.modifiedCount === 0)
    return createResponse("Password update failed! Try again later.", 500);

  return createResponse("Your password has been changed.", 201);
}
