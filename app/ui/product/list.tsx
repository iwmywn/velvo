"use client";

import { Product } from "@lib/definition";
import ProductCard from "./card";

export default function ProductList({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  return (
    <>
      <h3 className="mb-7 mt-5 text-center text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-6 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3 min-[1400px]:grid-cols-4 min-[1900px]:grid-cols-5 min-[2300px]:grid-cols-6 min-[2700px]:grid-cols-7">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </>
  );
}
