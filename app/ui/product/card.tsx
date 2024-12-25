"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getPriceAfterDiscount } from "@lib/utils";
import { useState } from "react";
import { Product } from "@lib/definition";

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
      href={`/product/${slug}`}
      className="group relative flex flex-col rounded border border-slate-200 bg-white transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => {
        if (images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {saleOff > 0 && (
        <div className="absolute -left-2 top-5 z-[1] h-7 whitespace-nowrap bg-red-600 px-[15px] py-[6px] text-xs font-semibold text-white before:absolute before:-bottom-2 before:left-0 before:right-auto before:border-x-4 before:border-y-4 before:border-red-700 before:border-b-transparent before:border-l-transparent after:absolute after:-right-2 after:left-auto after:top-0 after:h-7 after:border-x-8 after:border-y-[14px] after:border-red-600 after:border-r-transparent">
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
          className="transition-transform duration-300 group-hover:scale-105"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-center text-sm font-semibold uppercase text-gray-900">
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
