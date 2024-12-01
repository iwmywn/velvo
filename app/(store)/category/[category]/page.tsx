import { notFound } from "next/navigation";
import { Metadata } from "next";
import { categories, products } from "@/lib/placeholder-data";
import { Product } from "@/lib/definition";
import ProductList from "@/ui/product/list";
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
    <>
      <ProductList products={productsByCategory} title={category} />
    </>
  );
}

export async function generateStaticParams() {
  return Array.from(validCategories).map((category) => ({
    category,
  }));
}
