import OrderList from "@ui/purchase/order-list";

export default function Cancelled() {
  return <OrderList customerId={1} status="PROCESSING" />;
}
