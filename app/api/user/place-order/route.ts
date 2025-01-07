"use server";

import { createResponse } from "@lib/utils";
import { connectToDatabase } from "@lib/mongodb";
import { placeOrderWithIdSchema } from "@/schemas";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import verifyRecaptchaToken from "@lib/recaptcha";

export async function POST(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;

  if (!recaptchaToken) return createResponse("Invalid field!", 400);

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = placeOrderWithIdSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const {
    userId,
    fullName,
    phone,
    city,
    district,
    ward,
    address,
    products,
    totalPriceCents,
  } = parsedCredentials.data;

  if (!userId || !ObjectId.isValid(userId))
    return createResponse("User id is not valid!", 400);

  const transformedProducts = products.map(
    ({ productId, quantity, size, discountedPriceDetails }) => {
      if (!ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID in products array!");
      }
      return {
        productId: new ObjectId(productId),
        quantity,
        size,
        discountedPriceDetails: [
          discountedPriceDetails[0],
          discountedPriceDetails[1],
        ],
      };
    },
  );

  const db = await connectToDatabase();

  for (const { productId, quantity, size } of transformedProducts) {
    const sizeField = `sizes.${size}`;
    const product = await db
      .collection("products")
      .findOne({ _id: productId }, { projection: { name: 1, [sizeField]: 1 } });

    if (!product || (product.sizes?.[size] ?? 0) < quantity) {
      return createResponse(
        `Not enough stock for product "${product?.name}" (size: ${size})!`,
        400,
      );
    }
  }

  await Promise.all([
    db.collection("invoiceLists").updateOne(
      { userId: new ObjectId(userId) },
      {
        $push: {
          invoices: {
            $each: [
              {
                invoiceId: new ObjectId(),
                recipient: fullName,
                phone,
                address: `${address}, ${ward}, ${district}, ${city}`,
                status: "waiting",
                totalPriceCents,
                products: transformedProducts,
                orderDate: new Date(),
              },
            ],
            $position: 0,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      },
    ),
    db
      .collection("carts")
      .updateOne({ userId: new ObjectId(userId) }, { $set: { products: [] } }),
    ...transformedProducts.map(async ({ productId, quantity, size }) => {
      const sizeField = `sizes.${size}`;
      await db
        .collection("products")
        .updateOne({ _id: productId }, { $inc: { [sizeField]: -quantity } });
    }),
  ]);

  revalidatePath("/product");
  revalidatePath("/user/purchase");
  return createResponse("Order created.", 201);
}
