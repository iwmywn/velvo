"use server";

import { createResponse } from "@api/utils";
import { getUserCollection } from "@lib/collections";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("user");

  if (!token || !email) return createResponse("Invalid field!", 400);

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user) return createResponse("Token expired!", 404);

  return createResponse("Token found.", 200);
}
