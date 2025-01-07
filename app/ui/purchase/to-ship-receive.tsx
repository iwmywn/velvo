import OrderList from "@ui/purchase/order-list";
import { InvoiceList } from "@lib/definition";

export default function ToShipAndReceive({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceList["invoices"] | null;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["waiting", "processing"]}
      emptyState="toShipNReceive"
    />
  );
}
