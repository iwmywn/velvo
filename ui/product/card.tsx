"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getPriceAfterDiscount } from "@lib/utils";
import { useState } from "react";
import { Product } from "@lib/definitions";

export default function ProductCard({
  name,
  priceCents,
  images,
  saleOff,
  slug,
}: Product) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const priceAfterDiscount = getPriceAfterDiscount(priceCents, saleOff);

  return (
    <Link
      href={`/products/${slug}`}
      className="group/product-card relative flex flex-col rounded border border-slate-200 bg-white transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => {
        if (images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {saleOff > 0 && (
        <div className="absolute top-5 -left-2 z-[1] h-7 bg-red-600 px-[15px] py-[6px] text-xs font-semibold whitespace-nowrap text-white before:absolute before:right-auto before:-bottom-2 before:left-0 before:border-x-4 before:border-y-4 before:border-red-700 before:border-b-transparent before:border-l-transparent after:absolute after:top-0 after:-right-2 after:left-auto after:h-7 after:border-x-8 after:border-y-[14px] after:border-red-600 after:border-r-transparent">
          {saleOff}% OFF
        </div>
      )}
      <div className="flex h-[22.5rem] items-center justify-center overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          width={240}
          height={240}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
          className="transition-transform duration-300 group-hover/product-card:scale-105"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-center text-sm font-semibold text-gray-900 uppercase">
          {name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          {saleOff > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ${formatCurrency(priceCents)}
            </span>
          )}
          <span className="text-base font-semibold text-red-500">
            ${priceAfterDiscount}
          </span>
        </div>
      </div>
    </Link>
  );
}
