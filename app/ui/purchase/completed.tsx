import { InvoiceList } from "@lib/definition";
import OrderList from "@ui/purchase/order-list";

export default function Completed({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceList["invoices"] | null;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["completed"]}
      emptyState="completed"
    />
  );
}
