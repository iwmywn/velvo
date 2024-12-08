import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { REVALIDATE_TIME } from "@lib/config";

export const revalidate = REVALIDATE_TIME;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const [categories, { category: categoryName }] = await Promise.all([
    fetchCategories(),
    params,
  ]);
  const validCategories = new Set(categories.map((cat) => cat.name));

  return {
    title: !validCategories.has(categoryName)
      ? "NOT FOUND"
      : `${categoryName} Category`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [categories, products, { category: categoryName }] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    params,
  ]);
  const category = categories.find((cat) => cat.name === categoryName);

  if (!category) return <NotFound />;

  const productsByCategory = products.filter(
    (p) => p.categoryId === category.id,
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: categoryName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCategory} title={categoryName} />
    </>
  );
}

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((category) => ({
    category: category.name.toLowerCase(),
  }));
}
