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
import { capitalizeFirstLetter } from "@ui/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const [{ slug: customerGroup, sub: category }, customerGroups] =
    await Promise.all([params, getCustomerGroups()]);

  const categories = await getCategoriesByCustomerGroup(customerGroup);

  return {
    title: `${!categories.includes(category) || !customerGroups.includes(customerGroup) ? "NOT FOUND" : `${capitalizeFirstLetter(customerGroup)} / ${capitalizeFirstLetter(category)}`}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const [products, customerGroups, { slug: customerGroup, sub: category }] =
    await Promise.all([getProducts(), getCustomerGroups(), params]);

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
      label: capitalizeFirstLetter(customerGroup),
      href: `/${customerGroup}`,
    },
    { label: capitalizeFirstLetter(category) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCategory}
        title={`${customerGroup} / ${category}`}
      />
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
