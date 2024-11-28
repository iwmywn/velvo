import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productsByCategory } from "@/lib/placeholder-data";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";

const validCategories = new Set(["men", "women", "kids"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = (await params).category;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Category`,
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
      <h1 className="mb-4 text-xl font-semibold">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(({ id, name, priceCents, image, saleOff }) => (
          <div
            key={id}
            className="relative overflow-hidden rounded-lg border bg-white"
          >
            {saleOff > 0 && (
              <div className="absolute left-0 top-0 rounded-tl-lg bg-[#FEEEEA] px-3 py-2 text-xs font-bold text-[#EE4D2D]">
                {saleOff}% OFF
              </div>
            )}
            <div className="relative h-60 w-full">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="p-4 font-medium">
              <h3 className="mb-1 truncate text-sm">{name}</h3>
              <div className="text-base text-gray-800">
                ${formatCurrency(priceCents - (priceCents * saleOff) / 100)}
              </div>
            </div>
          </div>
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
