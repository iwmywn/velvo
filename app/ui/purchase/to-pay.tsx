import { getCartProductsByCustomerId } from "@lib/utils";
import ProductRow from "./components/product-row";

export default function ToPay() {
  const cartProducts = getCartProductsByCustomerId(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden select-none grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 border text-center font-medium sm:grid">
        {["Product", "Price", "Quantity", "Total", "Action"].map((head) => (
          <div className="p-2" key={head}>
            {head}
          </div>
        ))}
      </div>

      {cartProducts.map((product) => (
        <ProductRow key={product.slug} {...product} />
      ))}
      <div className="ml-auto">(todo: checkout)</div>
    </div>
  );
}
