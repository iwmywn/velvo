import OrderList from "@ui/purchase/components/order-list";

export default function Completed() {
  return <OrderList customerId={1} status="COMPLETED" />;
}
