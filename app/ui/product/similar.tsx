"use client";

import { productsByCategory } from "@/lib/placeholder-data";
import ProductGrid from "./grid";
import { Fragment } from "react";

interface SimilarProductsProps {
  currentCategory: string;
  currentProductId: number;
}

export default function SimilarProducts({
  currentCategory,
  currentProductId,
}: SimilarProductsProps) {
  const similarProducts = productsByCategory[currentCategory].filter(
    (product) => product.id !== currentProductId,
  );

  return (
    <div className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {similarProducts.map(({ id, name, priceCents, images, saleOff }) => (
          <Fragment key={id}>
            <ProductGrid
              id={id}
              name={name}
              priceCents={priceCents}
              images={images}
              saleOff={saleOff}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
