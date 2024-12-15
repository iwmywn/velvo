import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";

export const revalidate = 1800;

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryName } = await params;

  return {
    title: `${capitalizeFirstLetter(categoryName)} Category`,
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
  const categories = await fetchCategories();
  return categories.map((category) => ({
    category: category.name.toLowerCase(),
  }));
}
