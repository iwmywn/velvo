import type { Metadata } from "next";
import { fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import { collections } from "@ui/data/collections";

const validCollections = new Set(collections);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: collectionName } = await params;

  return {
    title: `${!validCollections.has(collectionName) ? "NOT FOUND" : `Collection / ${capitalizeFirstLetter(collectionName)}`}`,
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [products, { slug: collectionName }] = await Promise.all([
    fetchProducts(),
    params,
  ]);

  if (!validCollections.has(collectionName)) return <NotFound />;

  const productsByCollection = products.filter(
    (p) => p.subCategory === collectionName,
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeFirstLetter(collectionName) },
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
  return collections.map((coll) => ({
    slug: coll,
  }));
}
