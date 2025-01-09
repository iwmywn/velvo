import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@lib/session";
import { cache } from "react";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false };
  }

  return {
    isAuth: true,
    userId: session.userId.toString(),
    image: session.image,
  };
});
