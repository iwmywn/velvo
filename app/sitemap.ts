import type { MetadataRoute } from "next";
import { getProducts } from "@lib/data";
import {
  customerGroup,
  kidsItems,
  menItems,
  womenItems,
  collections,
} from "@ui/data";

type Item = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_URL is not defined.");
  }
  const fetchedProducts = await getProducts();
  const categoryItems = [
    { group: "men", items: menItems },
    { group: "women", items: womenItems },
    { group: "kids", items: kidsItems },
  ];

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
        url: `${baseUrl}/${coll}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      }) satisfies Item,
  );

  const productUrls = fetchedProducts.map(
    ({ slug }) =>
      ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }) satisfies Item,
  );

  const categoryUrls = customerGroup.map(
    (cg) =>
      ({
        url: `${baseUrl}/${cg}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.4,
      }) satisfies Item,
  );

  const subCategoryUrls = categoryItems.flatMap(({ group, items }) =>
    items.map(
      (href) =>
        ({
          url: `${baseUrl}/${group}/${href}`,
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
