import type { Metadata } from "next";
import {
  getCollections,
  getProductIdsByCollection,
  getProducts,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug: collection }, collections] = await Promise.all([
    params,
    getCollections(),
  ]);

  return {
    title: `${!collections.find((col) => col.name === collection) ? "NOT FOUND" : `Collection / ${capitalizeFirstLetter(collection)}`}`,
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

  if (!collections.find((col) => col.name === collection)) return <NotFound />;

  const productIds = await getProductIdsByCollection(collection);
  const productsByCollection = products.filter((product) =>
    productIds.includes(product._id),
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeFirstLetter(collection) },
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
    slug: `collections/${coll.name}`,
  }));
}
