import type { Metadata } from "next";
import {
  getProductIdsByCustomerGroup,
  getProducts,
  getCustomerGroups,
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
  const [{ slug: customerGroup }, customerGroups] = await Promise.all([
    params,
    getCustomerGroups(),
  ]);

  return {
    title: `${!customerGroups.includes(customerGroup) ? "NOT FOUND" : capitalizeWords(customerGroup)}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [products, { slug: customerGroup }, customerGroups] = await Promise.all(
    [getProducts(), params, getCustomerGroups()],
  );

  if (!customerGroups.includes(customerGroup)) return <NotFound />;

  const productIds = await getProductIdsByCustomerGroup(customerGroup);
  const productsByCustomerGroup = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeWords(customerGroup) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCustomerGroup} title={customerGroup} />
    </>
  );
}

export async function generateStaticParams() {
  const categoriesName = await getCustomerGroups();

  return categoriesName.map((name) => ({
    slug: name,
  }));
}
