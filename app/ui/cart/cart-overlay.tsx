"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import Button from "@ui/button";
import ImageTag from "@ui/image";
import {
  getPriceAfterDiscount,
  getTotalPriceCents,
  transformCartProducts,
} from "@lib/utils";
import Backdrop from "@ui/overlay/backdrop";
import SlidingContainer from "@ui/overlay/sliding-container";
import { useAuthContext } from "@ui/contexts/auth";
import Loading from "@ui/loading";
import useAnimation from "@ui/hooks/animation";
import { useCartStore } from "@lib/stored";
import { useProduct } from "@ui/contexts/product";
import { useUIState } from "@ui/contexts/state";

export default function CartOverlay() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const { isLoading, cartProducts, fetchCartProducts } = useCartStore();
  const { userId } = useAuthContext();
  const { products } = useProduct();
  const { setState } = useUIState();
  const handleClose = () =>
    triggerAnimation(() => setState("isCartOpen", false));
  const combinedCartProducts = transformCartProducts(cartProducts, products);
  const totalPriceCents = useMemo(
    () => getTotalPriceCents(combinedCartProducts),
    [combinedCartProducts],
  );

  useEffect(() => {
    fetchCartProducts(userId);
  }, [fetchCartProducts, userId]);

  return (
    <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
      <SlidingContainer isAnimating={isAnimating}>
        <div className="flex h-full flex-col px-6 pt-6 text-sm">
          <h2 className="text-base font-bold uppercase">SHOPPING CART</h2>
          <div className="mt-4">
            {isLoading ? (
              <Loading />
            ) : cartProducts === null || combinedCartProducts === null ? (
              <p>You have no products in your shopping cart.</p>
            ) : (
              combinedCartProducts.map(
                ({
                  name,
                  priceCents,
                  images,
                  description,
                  saleOff,
                  slug,
                  quantity,
                  size,
                }) => (
                  <div
                    className="mb-2 flex items-center gap-2"
                    key={`${slug}-${size}`}
                  >
                    <ImageTag src={images[0]} alt={description} />
                    <div className="flex-1">
                      <span className="mb-1 line-clamp-1 font-medium">
                        {name}
                      </span>
                      <span className="line-clamp-1 opacity-65">
                        Quantity: {quantity}
                        <span className="mx-2">|</span>
                        {size}
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
            <Link href="/user/purchase" onClick={handleClose}>
              <Button className="w-full">Go to Payment</Button>
            </Link>
          </div>
        </div>
      </SlidingContainer>
    </Backdrop>
  );
}
