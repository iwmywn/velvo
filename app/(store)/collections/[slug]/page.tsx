import type { Metadata } from "next";
import { getCategories, getProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import { collections } from "@ui/data";

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
  const [fetchedCategories, fetchedProducts, { slug: collectionName }] =
    await Promise.all([getCategories(), getProducts(), params]);

  if (!validCollections.has(collectionName)) return <NotFound />;

  const categoryId = fetchedCategories.find(
    (cat) => cat.name === capitalizeFirstLetter(collectionName),
  )?._id;

  const productsByCollection = fetchedProducts.filter(
    (p) => p.categoryId === categoryId,
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
