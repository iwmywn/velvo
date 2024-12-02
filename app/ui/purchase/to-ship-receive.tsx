import OrderList from "@ui/purchase/components/order-list";

export default function Cancelled() {
  return <OrderList customerId={1} status="PROCESSING" />;
}
