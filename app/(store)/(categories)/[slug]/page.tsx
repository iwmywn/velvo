import type { Metadata } from "next";
import {
  getProductIdsByCustomerGroup,
  getProducts,
  getCustomerGroups,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug: customerGroup }, customerGroups] = await Promise.all([
    params,
    getCustomerGroups(),
  ]);
  const customerGroupName = customerGroups.find(
    (cgs) => cgs.slug === customerGroup,
  )?.name;

  return {
    title: `${!customerGroupName ? "NOT FOUND" : customerGroupName}`,
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
  const customerGroupName = customerGroups.find(
    (cgs) => cgs.slug === customerGroup,
  )?.name;

  if (!customerGroupName) return <NotFound />;

  const productIds = await getProductIdsByCustomerGroup(customerGroup);
  const productsByCustomerGroup = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: customerGroupName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCustomerGroup}
        title={customerGroupName}
      />
    </>
  );
}

export async function generateStaticParams() {
  const customerGroups = await getCustomerGroups();

  return customerGroups.map((cgs) => ({
    slug: cgs.slug,
  }));
}
