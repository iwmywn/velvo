import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import { categories } from "@ui/data";

const validCategories = new Set(categories);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: categoryName } = await params;

  return {
    title: `${!validCategories.has(categoryName) ? "NOT FOUND" : capitalizeFirstLetter(categoryName)}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [categories, products, { slug: categoryName }] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    params,
  ]);
  const category = categories.find(
    (cat) => cat.name === capitalizeFirstLetter(categoryName),
  );

  if (!category) return <NotFound />;

  const productsByCategory = products.filter(
    (p) => p.categoryId === category.id,
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
  return categories.map((cat) => ({
    slug: cat,
  }));
}
