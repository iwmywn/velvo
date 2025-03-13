import type { Metadata } from "next";
import {
  getCategoryByProductId,
  getProducts,
  getSimilarProductIds,
} from "@lib/data";
import ProductDetails from "@ui/product/details";
import SimilarProducts from "@ui/product/similar";
import BreadCrumbs from "@ui/breadcrumbs";
import NotFound from "@/app/not-found";
import { capitalizeWords, convertToSlug } from "@ui/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [products, { slug: productSlug }] = await Promise.all([
    getProducts(),
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
  const [products, { slug: productSlug }] = await Promise.all([
    getProducts(),
    params,
  ]);
  const product = products.find((p) => p.slug === productSlug);

  if (!product) return <NotFound />;

  const result = await getCategoryByProductId(product._id);

  if (!result) return <NotFound />;

  const { customerGroup, categoryName } = result;
  const similarProductIds = await getSimilarProductIds(product._id);
  const similarProducts = products.filter((product) =>
    similarProductIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: capitalizeWords(customerGroup),
      href: `/${customerGroup}`,
    },
    {
      label: capitalizeWords(categoryName),
      href: `/${customerGroup}/${convertToSlug(categoryName)}`,
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
  const products = await getProducts();

  return products.map((p) => ({
    slug: p.slug,
  }));
}
