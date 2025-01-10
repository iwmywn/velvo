"use server";

import { nanoid } from "nanoid";
import { getUserCollection } from "@lib/collections";

export async function generateUniqueToken() {
  let verificationToken: string;
  let tokenExists: boolean = true;

  do {
    verificationToken = nanoid();
    const existingToken = await (
      await getUserCollection()
    ).findOne({ verificationToken });
    tokenExists = !!existingToken;
  } while (tokenExists);

  return verificationToken;
}
