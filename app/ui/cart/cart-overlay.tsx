"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@ui/button";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";
import ImageTag from "@ui/image";
import { getPriceAfterDiscount, getTotalPriceCents } from "@lib/utils";
import Backdrop from "@ui/overlays/backdrop";
import SlidingContainer from "@ui/overlays/sliding-container";
import { CartProductsProps } from "@lib/definition";
import { useAuthContext } from "@ui/hooks/auth";
import { fetchCartProducts } from "@lib/data";
import Loading from "@ui/loading";

export default function CartOverlay() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const [cartProducts, setCartProducts] = useState<CartProductsProps>(null);
  const totalPriceCents = getTotalPriceCents(cartProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId } = useAuthContext();
  const handleClose = (shouldNavigate: boolean) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
      if (shouldNavigate) router.back();
    }, 250);
  };

  useOverflow(isOpen);

  // idk whats going on here, when i click on cart, go to checkout
  // and then click on cart again, isOpen is false, idk why
  // use useEffect temporarily
  useEffect(() => {
    if (pathname === "/cart-overlay") {
      setIsOpen(true);

      const fetchCartData = async () => {
        if (!userId) return;

        try {
          const storedCartProducts: CartProductsProps = sessionStorage.getItem(
            "cartProducts",
          )
            ? JSON.parse(sessionStorage.getItem("cartProducts") as string)
            : null;

          if (storedCartProducts) {
            setCartProducts(storedCartProducts);
          } else {
            setIsLoading(true);
            const fetchedCartProducts = await fetchCartProducts(userId);
            setCartProducts(fetchedCartProducts);
            sessionStorage.setItem(
              "cartProducts",
              JSON.stringify(fetchedCartProducts),
            );
          }
        } catch (error) {
          console.error("Failed to fetch cart products:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCartData();
    }
  }, [pathname, userId]);

  return (
    isOpen && (
      <Backdrop isAnimating={isAnimating} onMouseDown={() => handleClose(true)}>
        <SlidingContainer isAnimating={isAnimating}>
          <div className="flex h-full flex-col px-6 pt-6 text-sm">
            <h2 className="text-base font-bold uppercase">SHOPPING CART</h2>
            <div className="mt-4">
              {isLoading ? (
                <Loading />
              ) : cartProducts === null ? (
                <p>You have no products in your shopping cart.</p>
              ) : (
                cartProducts.map(
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
              <Link href="/user/purchase" onClick={() => handleClose(false)}>
                <Button className="w-full">Go to Payment</Button>
              </Link>
            </div>
          </div>
        </SlidingContainer>
      </Backdrop>
    )
  );
}
