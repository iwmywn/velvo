import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductDetails from "@ui/product/details";
import SimilarProducts from "@ui/product/similar";
import BreadCrumbs from "@ui/breadcrumbs";
import NotFound from "@app/not-found";
import { capitalizeFirstLetter } from "@ui/utils";

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [products, { slug: productSlug }] = await Promise.all([
    fetchProducts(),
    params,
  ]);
  const name = products.find((p) => p.slug === productSlug)?.name;

  return {
    title: name || "NOT FOUND",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [categories, products, { slug: productSlug }] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    params,
  ]);
  const product = products.find((p) => p.slug === productSlug);

  if (!product) return <NotFound />;

  const category = categories.find((cat) => cat.id === product.categoryId);

  if (!category) return <NotFound />;

  const similarProducts = products.filter(
    (p) => p.categoryId === category.id && p.slug !== productSlug,
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: category.name,
      href: `/category/${category.name.toLowerCase()}`,
    },
    {
      label: capitalizeFirstLetter(product.subCategory),
      href: `/category/${category.name.toLowerCase()}/${product.subCategory}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-[90vh]">
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <ProductDetails product={product} />

      <SimilarProducts similarProducts={similarProducts} />
    </div>
  );
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}
