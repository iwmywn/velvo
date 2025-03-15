import type { Metadata } from "next";
import {
  getCollections,
  getProductIdsByCollection,
  getProducts,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug: collectionSlug }, collections] = await Promise.all([
    params,
    getCollections(),
  ]);
  const collectionName = collections.find(
    (col) => col.slug === collectionSlug,
  )?.name;

  return {
    title: `${!collectionName ? "NOT FOUND" : `Collection / ${collectionName}`}`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [products, collections, { slug: collectionSlug }] = await Promise.all([
    getProducts(),
    getCollections(),
    params,
  ]);
  const collectionName = collections.find(
    (col) => col.slug === collectionSlug,
  )?.name;

  if (!collectionName) return <NotFound />;

  const productIds = await getProductIdsByCollection(collectionSlug);
  const productsByCollection = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: collectionName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCollection}
        title={`Collection / ${collectionName}`}
      />
    </>
  );
}

export async function generateStaticParams() {
  const collections = await getCollections();

  return collections.map(({ slug }) => ({
    slug,
  }));
}
