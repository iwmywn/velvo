import Button from "@ui/button";
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";
import { useAnimation } from "@ui/hooks";

export default function ProductFloat({
  name,
  priceAfterDiscount,
  src,
  alt,
  heights,
  buttonRef,
}: {
  name: string;
  priceAfterDiscount: string;
  src: string;
  alt: string;
  heights: number;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const [isProductFloatVisible, setIsProductFloatVisible] =
    useState<boolean>(false);
  const isProductFloatVisibleRef = useRef<boolean>(isProductFloatVisible);
  const { isAnimating, triggerAnimation } = useAnimation();

  useEffect(() => {
    isProductFloatVisibleRef.current = isProductFloatVisible;
  }, [isProductFloatVisible]);

  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const shouldShow = rect.top <= heights - 40;

        if (shouldShow !== isProductFloatVisibleRef.current) {
          if (!shouldShow)
            triggerAnimation(() => setIsProductFloatVisible(false));
          else setIsProductFloatVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heights, triggerAnimation]);

  return (
    (isProductFloatVisible || isAnimating) && (
      <div
        className={`space-right fixed left-0 right-0 z-20 flex justify-center border-b bg-white/80 backdrop-blur ${
          isAnimating ? "animate-centerToTop" : "animate-topToCenter"
        }`}
        style={{ top: heights }}
      >
        <div className="mx-8 flex w-full items-center justify-between gap-x-5 md:mx-20">
          <div className="flex min-w-0 items-center gap-x-2 sm:gap-x-4">
            <span className="flex h-[70px] justify-center">
              <Image
                src={src}
                alt={alt}
                width={70}
                height={70}
                priority
                sizes="(max-width: 640px) 33vw, 70px"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </span>
            <div className="min-w-0 flex-1 space-y-1 text-sm">
              <h3 className="line-clamp-1 font-semibold">{name}</h3>
              <p>{priceAfterDiscount}</p>
            </div>
          </div>
          <Button
            className="h-8 text-xs"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Buy it now
          </Button>
        </div>
      </div>
    )
  );
}
