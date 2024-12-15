import OrderList from "@ui/purchase/order-list";
import { InvoiceProductsProps } from "@lib/definition";

export default function ToShipAndReceive({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceProductsProps;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["WAITING", "PROCESSING"]}
      emptyState="toShipNReceive"
    />
  );
}
