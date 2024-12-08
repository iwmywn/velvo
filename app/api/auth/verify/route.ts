"use server";

import { connectToDatabase } from "@lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 400,
    });
  }

  const db = await connectToDatabase();
  const user = await db
    .collection("customers")
    .findOne({ verificationToken: token });

  if (!user) {
    return new Response(
      JSON.stringify({ message: "Token not found or expired" }),
      { status: 404 },
    );
  }

  await db
    .collection("customers")
    .updateOne(
      { verificationToken: token },
      { $set: { isVerified: true }, $unset: { verificationToken: "" } },
    );

  return new Response(
    JSON.stringify({ message: "Email verified successfully" }),
    {
      status: 200,
    },
  );
}
