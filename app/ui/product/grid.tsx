"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import { Product } from "@lib/definition";
import { Fragment, useState, useEffect } from "react";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map(({ name, priceCents, images, saleOff, slug }) => (
        <Fragment key={slug}>
          <ProductCard
            name={name}
            priceCents={priceCents}
            images={images}
            saleOff={saleOff}
            slug={slug}
          />
        </Fragment>
      ))}
    </div>
  );
}

function ProductCard({
  name,
  priceCents,
  images,
  saleOff,
  slug,
}: {
  name: string;
  priceCents: number;
  images: string[];
  saleOff: number;
  slug: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
      <div className="group relative h-60 w-full bg-stone-100">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="p-4">
        <div className="truncate text-sm font-medium">{name}</div>
        <div className="mt-2 font-semibold">
          ${formatCurrency(priceCents - (priceCents * saleOff) / 100)}
        </div>
      </div>
    </Link>
  );
}
