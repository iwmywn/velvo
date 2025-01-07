"use server";

import { connectToDatabase } from "@lib/mongodb";
import { createResponse } from "@lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // if (!token) return createResponse("Invalid token!", 400);

  const db = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ verificationToken: token });

  if (!user)
    return createResponse("Token expired or email already verified!", 404);

  try {
    const [, , userUpdateResult] = await Promise.all([
      db.collection("carts").insertOne({
        userId: user._id,
        products: [],
      }),
      db.collection("invoiceLists").insertOne({
        userId: user._id,
        invoices: [],
      }),
      db.collection("users").updateOne(
        { verificationToken: token },
        {
          $set: { isVerified: true, updatedAt: new Date() },
          $unset: { verificationToken: "", resendVerification: "" },
        },
      ),
    ]);

    if (userUpdateResult.modifiedCount === 0)
      return createResponse("Email verification failed! Try again later.", 500);

    return createResponse("Email verified successfully.", 200);
  } catch (error) {
    console.error("Error during email verification:", error);
    return createResponse("An error occurred. Please try again later.", 500);
  }
}
