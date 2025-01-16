"use server";

import { getPriceAfterDiscount } from "@lib/utils";
import { createResponse } from "@api/utils";
import { placeOrderWithProductSchema } from "@/schemas";
import { ObjectId } from "mongodb";
// import { revalidatePath } from "next/cache";
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
  const { userId } = await verifySession();

  if (!userId) return createResponse("User is not authenticated!", 401);
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
  const transformedProducts = products.map(
    ({ _id, quantity, size, priceCents, saleOff }) => {
      return {
        productId: new ObjectId(_id),
        quantity,
        size,
        discountedPriceDetails: [
          getPriceAfterDiscount(priceCents, saleOff),
          getPriceAfterDiscount(priceCents, saleOff, quantity),
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
    ...products.map(async ({ _id, quantity, size }) => {
      const sizeField = `sizes.${size}`;
      await productCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $inc: { [sizeField]: -quantity } },
      );
    }),
  ]);

  //todo: revalidatePath
  // revalidatePath("/products/GWAS-Tote-Bag");
  return createResponse("Order created.", 201);
}
