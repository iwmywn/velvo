import type { Metadata } from "next";
import {
  getCategoriesByCustomerGroup,
  getCustomerGroupCategories,
  getCustomerGroups,
  getProductIdsByCategory,
  getProducts,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeWords, convertFromSlug } from "@ui/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const [{ slug: customerGroup, sub: rawCategory }, customerGroups] =
    await Promise.all([params, getCustomerGroups()]);
  const category = convertFromSlug(rawCategory);
  const categories = await getCategoriesByCustomerGroup(customerGroup);

  return {
    title: `${!categories.includes(category) || !customerGroups.includes(customerGroup) ? "NOT FOUND" : `${capitalizeWords(customerGroup)} / ${capitalizeWords(category)}`}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const [products, customerGroups, { slug: customerGroup, sub: rawCategory }] =
    await Promise.all([getProducts(), getCustomerGroups(), params]);
  const category = convertFromSlug(rawCategory);
  const categories = await getCategoriesByCustomerGroup(customerGroup);

  if (!categories.includes(category) || !customerGroups.includes(customerGroup))
    return <NotFound />;

  const productIds = await getProductIdsByCategory(customerGroup, category);
  const productsByCategory = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: capitalizeWords(customerGroup),
      href: `/${customerGroup}`,
    },
    { label: capitalizeWords(category) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCategory} title={`${category}`} />
    </>
  );
}

export async function generateStaticParams() {
  const categoryItems = await getCustomerGroupCategories();
  const params = categoryItems.flatMap(({ group, items }) =>
    items.map((href) => ({ slug: group, sub: href })),
  );

  return params;
}
