import { InvoiceList } from "@lib/definitions";
import OrderList from "@ui/purchase/order-list";

export default function Cancelled({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceList["invoices"] | null;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["cancelled"]}
      emptyState="cancelled"
    />
  );
}
