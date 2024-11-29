import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productsByCategory } from "@/lib/placeholder-data";
import ProductGrid from "@/ui/product/grid";
import { Fragment } from "react";
import { capitalizeFirstLetter } from "@/utils/format-text";

const validCategories = new Set(["men", "women", "kids"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = (await params).category;
  return {
    title: `${capitalizeFirstLetter(category)} Category`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = (await params).category;

  if (!validCategories.has(category)) notFound();

  const products = productsByCategory[category];

  return (
    <div className="relative z-10 bg-white px-8 pt-8 md:px-20">
      <h1 className="mb-5 text-3xl font-bold">
        {capitalizeFirstLetter(category)}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(({ id, name, priceCents, images, saleOff }) => (
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

export async function generateStaticParams() {
  return Array.from(validCategories).map((category) => ({
    category,
  }));
}
