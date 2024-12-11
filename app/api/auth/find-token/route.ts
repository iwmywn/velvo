"use server";

import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const db = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ verificationToken: token });

  if (!user) return createResponse("Token expired!", 404);

  return createResponse("Token found.", 200);
}
