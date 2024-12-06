import type { Metadata } from "next";
import { categories, products } from "@/lib/placeholder-data";
import { Product } from "@/lib/definition";
import ProductList from "@/ui/product/list";
import { capitalizeFirstLetter } from "@/utils/format-text";
import NotFound from "@/not-found";
import BreadCrumbs from "@/ui/breadcrumbs";

const validCategories = new Set(categories.map((cat) => cat.name));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = (await params).category;

  return {
    title: !validCategories.has(category)
      ? "NOT FOUND"
      : `${capitalizeFirstLetter(category)} Category`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const categoryName = (await params).category;
  const categoryId = categories.find((cat) => cat.name === categoryName)?.id;

  if (!categoryId) return <NotFound />;

  const productsByCategory: Product[] = products.filter(
    (p) => p.category_id === categoryId,
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeFirstLetter(categoryName) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCategory} title={categoryName} />
    </>
  );
}

export async function generateStaticParams() {
  return Array.from(validCategories).map((category) => ({
    category,
  }));
}
