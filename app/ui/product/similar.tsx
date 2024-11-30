"use client";

import ProductList from "./grid";
import { Product } from "@/lib/definition";

export default function SimilarProducts({
  similarProducts,
}: {
  similarProducts: Product[];
}) {
  return (
    <div className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
      <ProductList products={similarProducts} />
    </div>
  );
}
