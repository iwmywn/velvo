import type { MetadataRoute } from "next";
import {
  getCollections,
  getMainCategoriesWithSubcategories,
  getMainCategories,
  getProducts,
} from "@lib/data";

type Item = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_URL is not defined.");
  }
  const [products, mainCategories, collections, mainSubCategories] =
    await Promise.all([
      getProducts(),
      getMainCategories(),
      getCollections(),
      getMainCategoriesWithSubcategories(),
    ]);

  const defaultUrl = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "always",
    priority: 1,
  } satisfies Item;

  const productsUrl = {
    url: `${baseUrl}/products`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  } satisfies Item;

  const collectionUrls = collections.map(
    ({ slug }) =>
      ({
        url: `${baseUrl}/collections/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      }) satisfies Item,
  );

  const productUrls = products.map(
    ({ slug }) =>
      ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }) satisfies Item,
  );

  const categoryUrls = mainCategories.map(
    ({ slug }) =>
      ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.4,
      }) satisfies Item,
  );

  const subCategoryUrls = mainSubCategories.flatMap(({ main, sub }) =>
    sub.map(
      (item) =>
        ({
          url: `${baseUrl}/${main.slug}/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.5,
        }) satisfies Item,
    ),
  );

  return [
    defaultUrl,
    productsUrl,
    ...collectionUrls,
    ...productUrls,
    ...categoryUrls,
    ...subCategoryUrls,
  ];
}
