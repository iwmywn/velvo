import OrderList from "@ui/purchase/order-list";

export default function Completed() {
  return <OrderList orderStatus={["completed"]} emptyState="completed" />;
}
