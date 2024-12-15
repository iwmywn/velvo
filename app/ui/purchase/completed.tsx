import { InvoiceProductsProps } from "@lib/definition";
import OrderList from "@ui/purchase/order-list";

export default function Completed({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceProductsProps;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["COMPLETED"]}
      emptyState="completed"
    />
  );
}
