"use client";

import Link from "next/link";
import { useMemo } from "react";
import Button from "@ui/button";
import ImageTag from "@ui/image";
import {
  getPriceAfterDiscount,
  getTotalPriceCents,
  transformCartProducts,
} from "@lib/utils";
import Backdrop from "@ui/overlay/backdrop";
import SlidingContainer from "@ui/overlay/sliding-container";
import { useStoreContext, useUIStateContext } from "@ui/contexts";
import Loading from "@ui/loading";
import { useAnimation } from "@ui/hooks";
import { useCart } from "@lib/hooks";

export default function CartOverlay() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const { cart, isLoading } = useCart();
  const { products } = useStoreContext();
  const { setState } = useUIStateContext();
  const handleClose = () =>
    triggerAnimation(() => setState("isCartOpen", false));
  const combinedCartProducts = transformCartProducts(cart.products, products);
  const totalPriceCents = useMemo(
    () => getTotalPriceCents(combinedCartProducts),
    [combinedCartProducts],
  );

  return (
    <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
      <SlidingContainer isAnimating={isAnimating}>
        <div className="flex h-full flex-col px-6 pt-6 text-sm">
          <h2 className="text-base font-bold">SHOPPING CART</h2>
          <div className="mt-4">
            {isLoading ? (
              <Loading />
            ) : (
              combinedCartProducts.map(
                ({
                  name,
                  priceCents,
                  images,
                  saleOff,
                  slug,
                  quantity,
                  color,
                  size,
                }) => (
                  <div
                    className="mb-2 flex items-center gap-2"
                    key={`${slug}-${color}-${size}`}
                  >
                    <ImageTag src={images[0]} alt={name} />
                    <div className="flex-1">
                      <span className="mb-1 line-clamp-1 font-medium">
                        {name}
                      </span>
                      <span className="line-clamp-2 opacity-65">
                        <span>Quantity: {quantity}</span>
                        <span className="mx-2">|</span>
                        <span>Color: {color}</span>
                        {size && (
                          <>
                            <span className="mx-2">|</span>
                            <span>Size: {size}</span>
                          </>
                        )}
                      </span>
                    </div>
                    <span className="opacity-65">
                      ${getPriceAfterDiscount(priceCents, saleOff)}
                    </span>
                  </div>
                ),
              )
            )}
          </div>

          <div className="sticky bottom-0 mt-auto bg-white pb-6">
            <div className="float-right mb-2">
              <span className="font-medium">Total: </span>
              <span className="opacity-65">${totalPriceCents}</span>
            </div>
            <Link href="/purchase" onClick={handleClose}>
              <Button className="w-full">Go to Payment</Button>
            </Link>
          </div>
        </div>
      </SlidingContainer>
    </Backdrop>
  );
}
