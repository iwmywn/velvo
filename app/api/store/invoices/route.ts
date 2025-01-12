import { getInvoiceListCollection } from "@lib/collections";
import { verifySession } from "@lib/dal";
import { createResponse } from "@lib/utils";
import { ObjectId } from "mongodb";

export async function GET() {
  const { userId } = await verifySession();
  if (!userId) return createResponse("User is not authenticated!", 401);

  const invoiceList = await (
    await getInvoiceListCollection()
  ).findOne({
    userId: new ObjectId(userId),
  });

  if (!invoiceList) return createResponse("Invoice List not found!", 404);

  if (invoiceList.invoices.length === 0)
    return createResponse({ invoices: [] }, 200);

  const invoices = invoiceList.invoices.map(
    ({ invoiceId, products, ...rest }) => ({
      ...rest,
      invoiceId: invoiceId.toString(),
      products: products.map(({ productId, ...rest }) => ({
        ...rest,
        productId: productId.toString(),
      })),
    }),
  );

  return createResponse(invoices, 200);
}
