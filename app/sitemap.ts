import type { MetadataRoute } from "next";
import {
  getCollections,
  getCustomerGroupCategories,
  getCustomerGroups,
  getProducts,
} from "@lib/data";

type Item = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_URL is not defined.");
  }
  const [products, customerGroups, collections, categoryItems] =
    await Promise.all([
      getProducts(),
      getCustomerGroups(),
      getCollections(),
      getCustomerGroupCategories(),
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
    (coll) =>
      ({
        url: `${baseUrl}/collections/${coll.slug}`,
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

  const categoryUrls = customerGroups.map(
    (cg) =>
      ({
        url: `${baseUrl}/${cg.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.4,
      }) satisfies Item,
  );

  const subCategoryUrls = categoryItems.flatMap(({ group, items }) =>
    items.map(
      (item) =>
        ({
          url: `${baseUrl}/${group}/${item.slug}`,
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
