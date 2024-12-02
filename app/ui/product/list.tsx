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
      <h1 className="mb-7 text-xl font-bold uppercase">{title}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[2000px]:grid-cols-5 min-[3000px]:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </>
  );
}
