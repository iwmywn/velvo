"use server";

import { createResponse } from "@api/utils";
import { getUserCollection } from "@lib/collections";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // todo: filter (verificationToken & userid)
  const user = await (
    await getUserCollection()
  ).findOne({ verificationToken: token! });

  if (!user) return createResponse("Token expired!", 404);

  return createResponse("Token found.", 200);
}
