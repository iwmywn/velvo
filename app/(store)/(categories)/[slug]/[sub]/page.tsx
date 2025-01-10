import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import {
  customerGroup,
  categories,
  menItems,
  womenItems,
  kidsItems,
} from "@ui/data";

const validCustomerGroup = new Set(customerGroup);
const validCategories = new Set(categories);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug: customerGroup, sub: categoryName } = await params;

  return {
    title: `${!validCategories.has(categoryName) || !validCustomerGroup.has(customerGroup) ? "NOT FOUND" : `${capitalizeFirstLetter(customerGroup)} / ${capitalizeFirstLetter(categoryName)}`}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const [
    fetchedCategories,
    fetchedProducts,
    { slug: customerGroup, sub: categoryName },
  ] = await Promise.all([fetchCategories(), fetchProducts(), params]);

  if (
    !validCategories.has(categoryName) ||
    !validCustomerGroup.has(customerGroup)
  )
    return <NotFound />;

  const categoryId = fetchedCategories.find(
    (cat) => cat.name === capitalizeFirstLetter(categoryName),
  )?._id;

  const productsByCategory = fetchedProducts.filter(
    (p) =>
      p.customerGroup === capitalizeFirstLetter(customerGroup) &&
      p.categoryId === categoryId,
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: capitalizeFirstLetter(customerGroup),
      href: `/${customerGroup}`,
    },
    { label: capitalizeFirstLetter(categoryName) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCategory}
        title={`${customerGroup} / ${categoryName}`}
      />
    </>
  );
}

export async function generateStaticParams() {
  const categoryItems = [
    { group: "men", items: menItems },
    { group: "women", items: womenItems },
    { group: "kids", items: kidsItems },
  ];

  const params = categoryItems.flatMap(({ group, items }) =>
    items.map((href) => ({ slug: group, sub: href })),
  );

  return params;
}
