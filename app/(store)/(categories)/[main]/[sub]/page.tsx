import type { Metadata } from "next";
import {
  getSubCategoriesByMainCategory,
  getMainCategoriesWithSubcategories,
  getMainCategories,
  getProductIdsByCategory,
  getProducts,
} from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ main: string; sub: string }>;
}): Promise<Metadata> {
  const [{ main: mainCategorySlug, sub: subCategorySlug }, mainCategories] =
    await Promise.all([params, getMainCategories()]);
  const subCategories = await getSubCategoriesByMainCategory(mainCategorySlug);
  const subCategoryName = subCategories.find(
    (subCats) => subCats.slug === subCategorySlug,
  )?.name;
  const mainCategoryName = mainCategories.find(
    (mainCats) => mainCats.slug === mainCategorySlug,
  )?.name;

  return {
    title: `${!subCategoryName || !mainCategoryName ? "NOT FOUND" : `${mainCategoryName} / ${subCategoryName}`}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ main: string; sub: string }>;
}) {
  const [
    products,
    mainCategories,
    { main: mainCategorySlug, sub: subCategorySlug },
  ] = await Promise.all([getProducts(), getMainCategories(), params]);

  const subCategories = await getSubCategoriesByMainCategory(mainCategorySlug);
  const subCategoryName = subCategories.find(
    (subCats) => subCats.slug === subCategorySlug,
  )?.name;
  const mainCategoryName = mainCategories.find(
    (mainCats) => mainCats.slug === mainCategorySlug,
  )?.name;

  if (!subCategoryName || !mainCategoryName) return <NotFound />;

  const productIds = await getProductIdsByCategory(
    mainCategorySlug,
    subCategorySlug,
  );
  const productsByCategory = products.filter((product) =>
    productIds.includes(product._id),
  );
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: mainCategoryName,
      href: `/${mainCategorySlug}`,
    },
    { label: subCategoryName },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={productsByCategory} title={subCategoryName} />
    </>
  );
}

export async function generateStaticParams() {
  const categories = await getMainCategoriesWithSubcategories();
  const params = categories.flatMap(({ main, sub }) =>
    sub.map((item) => ({ main: main.slug, sub: item.slug })),
  );

  return params;
}
