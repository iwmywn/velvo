import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductDetails from "@ui/product/details";
import SimilarProducts from "@ui/product/similar";
import BreadCrumbs from "@ui/breadcrumbs";
import NotFound from "@/app/not-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [fetchedProducts, { slug: productSlug }] = await Promise.all([
    fetchProducts(),
    params,
  ]);
  const name = fetchedProducts.find((p) => p.slug === productSlug)?.name;

  return {
    title: name || "NOT FOUND",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [fetchedCategories, fetchedProducts, { slug: productSlug }] =
    await Promise.all([fetchCategories(), fetchProducts(), params]);
  const product = fetchedProducts.find((p) => p.slug === productSlug);

  if (!product) return <NotFound />;

  const category = fetchedCategories.find(
    (cat) => cat.categoryId === product.categoryId,
  );

  if (!category) return <NotFound />;

  const similarProducts = fetchedProducts.filter(
    (p) => p.categoryId === category.categoryId && p.slug !== productSlug,
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: product.customerGroup,
      href: `/${product.customerGroup.toLowerCase()}`,
    },
    {
      label: category.name,
      href: `/${product.customerGroup.toLowerCase()}/${category.name.toLowerCase()}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-[90vh]">
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <ProductDetails product={product} />

      {similarProducts.length > 0 && (
        <SimilarProducts similarProducts={similarProducts} />
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}
