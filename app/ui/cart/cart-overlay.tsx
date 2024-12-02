"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@ui/button";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";
import ImageTag from "@ui/image";
import {
  formatCurrency,
  getPriceAfterDiscount,
  getTotalPriceCents,
  getCartProductsByCustomerId,
} from "@/lib/utils";

export default function CartOverlay() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const cartProducts = getCartProductsByCustomerId(1);
  const totalPriceCents = getTotalPriceCents(cartProducts);

  // idk whats going on here, when i click on cart, go to checkout
  // and then click on cart again, isOpen is false, idk why
  // use useEffect temporarily
  useEffect(() => {
    if (pathname === "/cart-overlay") setIsOpen(true);
  }, [pathname]);

  useOverflow(isOpen);
  const handleCloseCart = (shouldNavigate: boolean) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
      if (shouldNavigate) router.back();
    }, 350);
  };

  return (
    isOpen && (
      <div
        className={`fixed inset-0 z-[9998] bg-black/70 ${isAnimating ? "animate-fadeOut" : "animate-fadeIn"}`}
        onClick={() => handleCloseCart(true)}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 z-[9999] h-[80%] overflow-y-auto bg-white sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] lg:w-[33%] ${isAnimating ? "animate-centerToBottom sm:animate-leftToRight" : "animate-bottomToCenter sm:animate-rightToLeft"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col px-6 pt-6 text-sm">
            <h2 className="text-base font-bold uppercase">SHOPPING CART</h2>
            <div className="mt-4">
              {cartProducts.map(
                ({
                  name,
                  priceCents,
                  images,
                  description,
                  saleOff,
                  slug,
                  quantity,
                }) => (
                  <div className="mb-2 flex items-center gap-2" key={slug}>
                    <ImageTag src={images[0]} alt={description} />
                    <div className="flex-1">
                      <span className="mb-1 line-clamp-1 font-medium">
                        {name}
                      </span>
                      <span className="line-clamp-1 opacity-65">
                        Quantity: {quantity}
                      </span>
                    </div>
                    <span className="opacity-65">
                      $
                      {formatCurrency(
                        getPriceAfterDiscount(priceCents, saleOff),
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-auto pb-6">
              <div className="float-right mb-2">
                <span className="font-medium">Total: </span>
                <span className="opacity-65">
                  ${formatCurrency(totalPriceCents)}
                </span>
              </div>
              <Link
                href="/user/purchase"
                onClick={() => handleCloseCart(false)}
              >
                <Button className="w-full">Go to Payment</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
