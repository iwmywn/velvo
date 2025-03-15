import type { Metadata } from "next";
import {
  getProductIdsByMainCategory,
  getProducts,
  getMainCategories,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ main: string }>;
}): Promise<Metadata> {
  const [{ main: mainCategorySlug }, mainCategories] = await Promise.all([
    params,
    getMainCategories(),
  ]);
  const mainCategoryName = mainCategories.find(
    (mainCats) => mainCats.slug === mainCategorySlug,
  )?.name;

  return {
    title: `${!mainCategoryName ? "NOT FOUND" : mainCategoryName}`,
  };
}

export default async function MainCategoryPage({
  params,
}: {
  params: Promise<{ main: string }>;
}) {
  const [products, { main: mainCategorySlug }, mainCategories] =
    await Promise.all([getProducts(), params, getMainCategories()]);
  const mainCategoryName = mainCategories.find(
    (mainCats) => mainCats.slug === mainCategorySlug,
  )?.name;

  if (!mainCategoryName) return <NotFound />;

  const productIds = await getProductIdsByMainCategory(mainCategorySlug);
  const productsByCustomerGroup = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: mainCategoryName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsByCustomerGroup}
        title={mainCategoryName}
      />
    </>
  );
}

export async function generateStaticParams() {
  const mainCategories = await getMainCategories();

  return mainCategories.map(({ slug: main }) => ({
    main,
  }));
}
