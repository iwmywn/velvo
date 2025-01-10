"use server";

import { createResponse } from "@lib/utils";
import { placeOrderWithProductSchema } from "@/schemas";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import verifyRecaptchaToken from "@lib/recaptcha";
import { verifySession } from "@lib/dal";
import {
  getCartCollection,
  getInvoiceListCollection,
  getProductCollection,
} from "@lib/collections";

export async function POST(req: Request) {
  const data = await req.json();
  const { recaptchaToken, ...userData } = data;
  const { isAuth, userId } = await verifySession();

  if (!isAuth) return createResponse("User is not authenticated!", 401);
  if (!recaptchaToken) return createResponse("Invalid field!", 400);

  const verify = await verifyRecaptchaToken(recaptchaToken);

  if (!verify) return createResponse("Captcha challenge failed!", 422);

  const parsedCredentials = placeOrderWithProductSchema.safeParse(userData);

  if (!parsedCredentials.success) return createResponse("Invalid field!", 400);

  const {
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
        ] as [string, string],
      };
    },
  );

  const [productCollection, invoiceListCollection, cartCollection] =
    await Promise.all([
      getProductCollection(),
      getInvoiceListCollection(),
      getCartCollection(),
    ]);

  for (const { productId, quantity, size } of transformedProducts) {
    const sizeField = `sizes.${size}`;
    const product = await productCollection.findOne(
      { _id: productId },
      { projection: { name: 1, [sizeField]: 1 } },
    );

    if (!product || (product.sizes?.[size] ?? 0) < quantity) {
      return createResponse(
        `Not enough stock for product "${product?.name}" (size: ${size})!`,
        400,
      );
    }
  }

  await Promise.all([
    invoiceListCollection.updateOne(
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
          },
        },
      },
    ),
    cartCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $set: { products: [] } },
    ),
    ...products.map(async ({ productId, quantity, size }) => {
      const sizeField = `sizes.${size}`;
      await productCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { [sizeField]: -quantity } },
      );
    }),
  ]);

  revalidatePath("/product");
  revalidatePath("/user/purchase");
  return createResponse("Order created.", 201);
}
