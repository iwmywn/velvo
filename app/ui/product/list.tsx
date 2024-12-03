"use client";

import { Product } from "@lib/definition";
import ProductCard from "./card";
import BreadCrumbs from "../breadcrumbs";
import { capitalizeFirstLetter } from "@/utils/format-text";

export default function ProductList({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: `${title !== "All Products" && "All Products"}`,
      href: "/products",
    },
    { label: `${capitalizeFirstLetter(title)}` },
  ];

  return (
    <>
      {title !== "You may also like" && (
        <BreadCrumbs breadcrumbs={breadcrumbs} />
      )}
      <h3 className="mb-7 mt-5 text-center text-xl font-bold uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 min-[2000px]:grid-cols-5 min-[3000px]:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </>
  );
}
