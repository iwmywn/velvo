import { getTotalPriceCents, transformCartProducts } from "@lib/utils";
import ProductRow from "@ui/purchase/product-row";
import Checkout from "@ui/purchase/checkout";
import EmptyState from "@ui/cart/empty";
import Loading from "@ui/loading";
import { useCart } from "@lib/hooks";
import { useStoreContext } from "@ui/contexts";
import { useMemo } from "react";

export default function ToPay() {
  const { cart, isLoading } = useCart();
  const { products } = useStoreContext();
  const combinedCartProducts = transformCartProducts(cart.products, products);
  const totalPriceCents = useMemo(() => {
    return getTotalPriceCents(combinedCartProducts);
  }, [combinedCartProducts]);

  if (isLoading) return <Loading />;

  return (
    <>
      {combinedCartProducts.length === 0 ? (
        <EmptyState emptyState="toPay" />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden select-none grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 border text-center font-medium sm:grid">
            {["Product", "Price", "Quantity", "Sub Total", "Action"].map(
              (head) => (
                <div className="p-2" key={head}>
                  {head}
                </div>
              ),
            )}
          </div>

          {combinedCartProducts.map((product) => (
            <ProductRow
              key={`${product.slug}-${product.color}-${product.size}`}
              {...product}
            />
          ))}

          <div className="flex grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center justify-between gap-2 border-t pt-2 text-center sm:grid">
            <div className="hidden text-left sm:block" />
            <div className="hidden sm:block" />
            <div className="font-semibold">TOTAL PRICE</div>
            <div className="font-medium">${totalPriceCents}</div>
            <div className="flex justify-center">
              <Checkout
                products={combinedCartProducts}
                totalPriceCents={totalPriceCents}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
