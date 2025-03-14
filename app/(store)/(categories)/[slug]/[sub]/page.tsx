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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const [{ slug: customerGroup, sub: category }, customerGroups] =
    await Promise.all([params, getCustomerGroups()]);
  const categories = await getCategoriesByCustomerGroup(customerGroup);
  const categoryName = categories.find((cat) => cat.slug === category)?.name;
  const customerGroupName = customerGroups.find(
    (cgs) => cgs.slug === customerGroup,
  )?.name;

  return {
    title: `${!categoryName || !customerGroupName ? "NOT FOUND" : `${customerGroupName} / ${categoryName}`}`,
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
  const customerGroupName = customerGroups.find(
    (cgs) => cgs.slug === customerGroup,
  )?.name;
  const categoryName = categories.find((cat) => cat.slug === category)?.name;

  if (!categoryName || !customerGroupName) return <NotFound />;

  const productIds = await getProductIdsByCategory(customerGroup, category);
  const productsByCategory = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: customerGroupName,
      href: `/${customerGroup}`,
    },
    { label: categoryName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCategory} title={categoryName} />
    </>
  );
}

export async function generateStaticParams() {
  const categoryItems = await getCustomerGroupCategories();
  const params = categoryItems.flatMap(({ group, items }) =>
    items.map((item) => ({ slug: group, sub: item.slug })),
  );

  return params;
}
