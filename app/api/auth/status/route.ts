"use server";

import { verifySession } from "@lib/dal";

export async function GET() {
  const { isAuth, userId, image } = await verifySession();

  if (isAuth) {
    return new Response(
      JSON.stringify({
        isAuth,
        userId,
        image,
      }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ isSignedIn: false }), { status: 401 });
}
