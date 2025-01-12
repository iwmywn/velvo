"use server";

import { verifySession } from "@lib/dal";

export async function GET() {
  const { userId, image } = await verifySession();

  if (userId) {
    return new Response(
      JSON.stringify({
        userId,
        image,
      }),
      { status: 200 },
    );
  }

  return new Response(null, { status: 401 });
}
