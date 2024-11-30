import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categories, products } from "@/lib/placeholder-data";
import { Product } from "@/lib/definition";
import ProductList from "@/ui/product/grid";
import { capitalizeFirstLetter } from "@/utils/format-text";

const validCategories = new Set(categories.map((cat) => cat.name));

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
  const categoryId = categories.find((cat) => cat.name === category)?.id;

  if (!categoryId) notFound();

  const productsByCategory: Product[] = products.filter(
    (p) => p.category_id === categoryId,
  );

  return (
    <div className="relative z-10 bg-white px-8 pt-8 md:px-20">
      <h1 className="mb-5 text-3xl font-bold">
        {capitalizeFirstLetter(category)}
      </h1>
      <ProductList products={productsByCategory} />
    </div>
  );
}

export async function generateStaticParams() {
  return Array.from(validCategories).map((category) => ({
    category,
  }));
}
