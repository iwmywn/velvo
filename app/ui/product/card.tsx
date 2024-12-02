"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getPriceAfterDiscount } from "@lib/utils";
import { useState, useEffect } from "react";
import { Product } from "@lib/definition";

export default function ProductCard({
  name,
  priceCents,
  images,
  saleOff,
  slug,
}: Product) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const priceAfterDiscount = getPriceAfterDiscount(priceCents, saleOff);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (hovered && images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      }, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [hovered, images.length]);

  return (
    <Link
      href={`/product/${slug}`}
      className="relative overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {saleOff > 0 && (
        <div className="absolute left-0 top-0 z-10 rounded-tl-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-600">
          {saleOff}% OFF
        </div>
      )}
      <div className="flex h-60 justify-center bg-stone-100">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          width={240}
          height={240}
          loading="eager"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, (max-width: 2000px) 25vw, (max-width: 3000px) 20vw, 240px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="p-4">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="mt-2 font-semibold">
          ${formatCurrency(priceAfterDiscount)}
        </div>
      </div>
    </Link>
  );
}
