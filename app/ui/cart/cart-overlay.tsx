"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "@ui/button";
import { mockProducts } from "@/lib/placeholder-data";
import { formatCurrency, totalPriceCents } from "@/utils/currency";
import ImageTag from "@ui/image";
import useDeviceType from "@ui/hooks/device-type";

export default function CartOverlay({
  setIsShowCart,
}: {
  setIsShowCart: Dispatch<SetStateAction<boolean>>;
}) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const deviceType = useDeviceType();
  const fontSize = deviceType === "desktop" ? "text-sm" : "text-xs";

  const handleCloseCart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsShowCart(false);
    }, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] animate-fadeIn bg-black/70 ${isAnimating && "animate-fadeOut"}`}
      onClick={handleCloseCart}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 h-[80%] overflow-y-auto bg-white scrollbar-thin sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] lg:w-[33%] ${isAnimating ? "animate-centerToBottom sm:animate-leftToRight" : "animate-bottomToCenter sm:animate-rightToLeft"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`text- flex h-full flex-col px-6 pt-6 ${fontSize}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <h2 className="text-base font-semibold">Shopping Cart</h2>
          <div className="mt-4">
            {mockProducts.map(({ href, name, priceCents, quantity }) => (
              <div className="mb-2 flex items-center gap-2" key={href}>
                <ImageTag
                  className="hidden min-[350px]:inline"
                  href={href}
                  name={name}
                />
                <div className="flex-1">
                  <span className="mb-1 line-clamp-1 font-medium">{name}</span>
                  <span className="line-clamp-1 text-gray-500">
                    Quantity: {quantity}
                  </span>
                </div>
                <span className="">${formatCurrency(priceCents)}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pb-6">
            <div className="float-right mb-2">
              <span className="font-medium">Total:</span> $
              {formatCurrency(totalPriceCents(mockProducts))}
            </div>
            <Link href="/user/purchase?tab=to-pay" onClick={handleCloseCart}>
              <Button className={`w-full ${fontSize}`}>Go to Payment</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
