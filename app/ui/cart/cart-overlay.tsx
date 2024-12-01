"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@ui/button";
import { mockProducts } from "@/lib/placeholder-data";
import { formatCurrency, totalPriceCents } from "@/utils/currency";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function CartOverlay() {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // idk whats going on here, when i click on cart, go to checkout
  // and then click on cart again, isOpen is false, idk why
  // use useEffect temporarily
  useEffect(() => {
    if (pathname === "/cart-overlay") setisOpen(true);
  }, [pathname]);

  useOverflow(isOpen);
  const handleCloseCart = (shouldNavigate: boolean) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setisOpen(false);
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
          <div className="flex h-full flex-col px-6 pt-6 text-xs sm:text-sm">
            <h2 className="text-base font-bold uppercase">SHOPPING CART</h2>
            <div className="mt-4">
              {mockProducts.map(({ src, name, priceCents, quantity }) => (
                <div className="mb-2 flex items-center gap-2" key={src}>
                  <Image
                    src={src}
                    alt={name}
                    width={70}
                    height={70}
                    style={{ objectFit: "contain" }}
                  />
                  <div className="flex-1">
                    <span className="mb-1 line-clamp-1 text-sm font-medium">
                      {name}
                    </span>
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
              <Link
                href="/user/purchase?tab=to-pay"
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
