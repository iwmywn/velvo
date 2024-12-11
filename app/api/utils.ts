"use server";

import { nanoid } from "nanoid";
import { Db } from "mongodb";

export async function generateUniqueToken(db: Db) {
  let verificationToken: string;
  let tokenExists: boolean = true;

  do {
    verificationToken = nanoid();
    const existingToken = await db
      .collection("users")
      .findOne({ verificationToken });
    tokenExists = !!existingToken;
  } while (tokenExists);

  return verificationToken;
}
