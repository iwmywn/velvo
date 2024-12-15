import { InvoiceProductsProps } from "@lib/definition";
import OrderList from "@ui/purchase/order-list";

export default function Cancelled({
  invoiceProducts,
}: {
  invoiceProducts: InvoiceProductsProps;
}) {
  return (
    <OrderList
      invoiceProducts={invoiceProducts}
      orderStatus={["CANCELLED"]}
      emptyState="cancelled"
    />
  );
}
