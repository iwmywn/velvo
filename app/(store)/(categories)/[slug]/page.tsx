import type { Metadata } from "next";
import { getProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import { customerGroup } from "@ui/data";

const validcustomerGroup = new Set(customerGroup);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: customerGroupName } = await params;

  return {
    title: `${!validcustomerGroup.has(customerGroupName) ? "NOT FOUND" : capitalizeFirstLetter(customerGroupName)}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [fetcheProducts, { slug: customerGroupName }] = await Promise.all([
    getProducts(),
    params,
  ]);

  if (!validcustomerGroup.has(customerGroupName)) return <NotFound />;

  const productsBycustomerGroup = fetcheProducts.filter(
    (p) => p.customerGroup === capitalizeFirstLetter(customerGroupName),
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: capitalizeFirstLetter(customerGroupName) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsBycustomerGroup}
        title={customerGroupName}
      />
    </>
  );
}

export async function generateStaticParams() {
  return customerGroup.map((cg) => ({
    slug: cg,
  }));
}
