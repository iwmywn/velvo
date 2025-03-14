import type { Metadata } from "next";
import {
  getCategoryDetailsByProductId,
  getProducts,
  getSimilarProductIds,
} from "@lib/data";
import ProductDetails from "@ui/product/details";
import SimilarProducts from "@ui/product/similar";
import BreadCrumbs from "@ui/breadcrumbs";
import NotFound from "@/app/not-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [products, { slug: productSlug }] = await Promise.all([
    getProducts(),
    params,
  ]);
  const productName = products.find((p) => p.slug === productSlug)?.name;

  return {
    title: productName || "NOT FOUND",
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

  const details = await getCategoryDetailsByProductId(product._id);

  if (!details) return <NotFound />;

  const {
    mainCategoryName,
    mainCategorySlug,
    subCategoryName,
    subCategorySlug,
  } = details;
  const similarProductIds = await getSimilarProductIds(product._id);
  const similarProducts = products.filter((product) =>
    similarProductIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: mainCategoryName,
      href: `/${mainCategorySlug}`,
    },
    {
      label: subCategoryName,
      href: `/${mainCategorySlug}/${subCategorySlug}`,
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

  return products.map(({ slug }) => ({
    slug,
  }));
}
