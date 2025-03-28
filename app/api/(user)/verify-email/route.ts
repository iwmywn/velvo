"use server";

import {
  getUserCollection,
  getCartCollection,
  getInvoiceListCollection,
} from "@lib/collections";
import { createResponse } from "@api/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) return createResponse("Invalid field!", 400);

  const user = await (
    await getUserCollection()
  ).findOne({ email: email, verificationToken: token });

  if (!user)
    return createResponse("Token expired or email already verified!", 404);

  try {
    const [, , userUpdateResult] = await Promise.all([
      (await getCartCollection()).insertOne({
        userId: user._id,
        products: [],
      }),
      (await getInvoiceListCollection()).insertOne({
        userId: user._id,
        invoices: [],
      }),
      (await getUserCollection()).updateOne(
        { verificationToken: token! },
        {
          $set: { emailVerified: true, updatedAt: new Date() },
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
