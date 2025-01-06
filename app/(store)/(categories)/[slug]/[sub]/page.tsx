import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@lib/data";
import ProductList from "@ui/product/list";
import NotFound from "@/app/not-found";
import BreadCrumbs from "@ui/breadcrumbs";
import { capitalizeFirstLetter } from "@ui/utils";
import {
  categories,
  subCategories,
  menItems,
  womenItems,
  kidsItems,
} from "@ui/data";

const validSubCategories = new Set(subCategories);
const validCategories = new Set(categories);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug: categoryName, sub: subCategoryName } = await params;

  return {
    title: `${!validSubCategories.has(subCategoryName) || !validCategories.has(categoryName) ? "NOT FOUND" : `${capitalizeFirstLetter(categoryName)} / ${capitalizeFirstLetter(subCategoryName)}`}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const [categories, products, { slug: categoryName, sub: subCategoryName }] =
    await Promise.all([fetchCategories(), fetchProducts(), params]);

  const category = categories.find(
    (cat) => cat.name === capitalizeFirstLetter(categoryName),
  );

  if (!category) return <NotFound />;

  const productsBySubCategory = products.filter(
    (p) => p.subCategory === subCategoryName && p.categoryId === category.id,
  );

  if (productsBySubCategory.length === 0) return <NotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
      label: capitalizeFirstLetter(categoryName),
      href: `/${categoryName}`,
    },
    { label: capitalizeFirstLetter(subCategoryName) },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList
        products={productsBySubCategory}
        title={`${categoryName} / ${subCategoryName}`}
      />
    </>
  );
}

export async function generateStaticParams() {
  const params = [];

  const categoryItems = [
    { category: "men", items: menItems },
    { category: "women", items: womenItems },
    { category: "kids", items: kidsItems },
  ];

  for (const { category, items } of categoryItems) {
    for (const { href } of items) {
      params.push({ slug: category, sub: href });
    }
  }

  return params;
}
