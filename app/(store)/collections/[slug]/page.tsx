import type { Metadata } from "next";
import {
  getCollections,
  getProductIdsByCollection,
  getProducts,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeWords } from "@ui/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug: collection }, collections] = await Promise.all([
    params,
    getCollections(),
  ]);
  const collectionName = collections.find(
    (col) => col.slug === collection,
  )?.name;

  return {
    title: `${!collectionName ? "NOT FOUND" : `Collection / ${capitalizeWords(collectionName)}`}`,
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [products, collections, { slug: collection }] = await Promise.all([
    getProducts(),
    getCollections(),
    params,
  ]);
  const collectionName = collections.find(
    (col) => col.slug === collection,
  )?.name;

  if (!collectionName) return <NotFound />;

  const productIds = await getProductIdsByCollection(collection);
  const productsByCollection = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeWords(collectionName) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCollection}
        title={`Collection / ${collection}`}
      />
    </>
  );
}

export async function generateStaticParams() {
  const collections = await getCollections();

  return collections.map((coll) => ({
    slug: coll.slug,
  }));
}
