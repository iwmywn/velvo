import { getCartCollection } from "@lib/collections";
import { verifySession } from "@lib/dal";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";

export async function GET() {
  const { userId } = await verifySession();
  if (!userId) return createResponse("User is not authenticated!", 401);

  const cart = await (
    await getCartCollection()
  ).findOne({ userId: new ObjectId(userId) });

  if (!cart) return createResponse("Cart not found!", 404);

  if (cart.products.length === 0)
    return createResponse({ products: [], quantity: 0 }, 200);

  const products = cart.products.map(({ productId, ...rest }) => ({
    ...rest,
    productId: productId.toString(),
  }));

  const quantity = products.reduce((sum, product) => sum + product.quantity, 0);

  return createResponse({ products, quantity }, 200);
}
