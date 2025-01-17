import OrderList from "@ui/purchase/order-list";

export default function Cancelled() {
  return <OrderList orderStatus={["cancelled"]} emptyState="cancelled" />;
}
