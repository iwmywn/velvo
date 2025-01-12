import OrderList from "@ui/purchase/order-list";

export default function ToShipAndReceive() {
  return (
    <OrderList
      orderStatus={["waiting", "processing"]}
      emptyState="toShipNReceive"
    />
  );
}
