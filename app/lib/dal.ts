import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@lib/session";
import { cache } from "react";

export const verifySession = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!payload) return {};

  return {
    userId: payload.userId,
    image: payload.image,
  };
});
