"use server";

import { Product, Avatar, Banner, Collection } from "@lib/definitions";
import { baseImgUrl } from "@ui/data";
import {
  getCustomerCategoriesCollection,
  getProductCollection,
  getAvatarCollection,
  getUserCollection,
  getCartCollection,
  getInvoiceListCollection,
  getBannerCollection,
  getCollectionCollection,
} from "@lib/collections";
import { cache } from "react";
import { verifySession } from "@lib/dal";
import { ObjectId } from "mongodb";
import { CartResponse, InvoicesResponse } from "@lib/hooks";

export async function getUserByEmail(email: string) {
  try {
    const user = await (await getUserCollection()).findOne({ email });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export const getAvatars = cache(async (): Promise<Avatar[]> => {
  try {
    const avatars = await (await getAvatarCollection()).find({}).toArray();

    return avatars.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch avatars:", error);
    return [];
  }
});

export const getBanners = cache(async (): Promise<Banner[]> => {
  try {
    const banners = await (await getBannerCollection()).find({}).toArray();

    return banners.map(({ _id, image, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      image: `${baseImgUrl}${image}`,
    }));
  } catch (error) {
    console.log("Failed to fetch banners:", error);
    return [];
  }
});

export const getCollections = cache(async (): Promise<Collection[]> => {
  try {
    const collections = await (await getCollectionCollection())
      .find({})
      .toArray();

    return collections.map(({ _id, image, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      image: `${baseImgUrl}${image}`,
    }));
  } catch (error) {
    console.log("Failed to fetch collections:", error);
    return [];
  }
});

export const getCustomerGroups = cache(
  async (): Promise<{ name: string; slug: string }[]> => {
    try {
      const categories = await (await getCustomerCategoriesCollection())
        .find({})
        .toArray();

      return categories.map((cat) => ({ name: cat.name, slug: cat.slug }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },
);

export const getCategories = cache(
  async (): Promise<{ name: string; slug: string }[]> => {
    try {
      const categories = await (await getCustomerCategoriesCollection())
        .find({})
        .toArray();

      return categories.flatMap((cat) =>
        cat.subcategories.map((sub) => ({
          name: sub.name,
          slug: sub.slug,
        })),
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },
);

export const getCustomerGroupCategories = cache(async () => {
  try {
    const customerGroups = await getCustomerGroups();

    return Promise.all(
      customerGroups.map(async (group) => {
        const { slug } = group;
        const items = await getCategoriesByCustomerGroup(slug);
        return { group: slug, items };
      }),
    );
  } catch (error) {
    console.error("Failed to fetch customer group categories:", error);
    return [];
  }
});

export const getCategoriesByCustomerGroup = cache(
  async (
    customerGroupSlug: string,
  ): Promise<{ name: string; slug: string }[]> => {
    try {
      const category = await (
        await getCustomerCategoriesCollection()
      ).findOne({ slug: customerGroupSlug });

      if (!category) return [];

      return category.subcategories.map((sub) => ({
        name: sub.name,
        slug: sub.slug,
      }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },
);

export const getProductIdsByCustomerGroup = cache(
  async (customerGroupSlug: string): Promise<string[]> => {
    try {
      const category = await (
        await getCustomerCategoriesCollection()
      ).findOne({ slug: customerGroupSlug });

      if (!category) return [];

      return category.subcategories.flatMap((sub) =>
        sub.productIds.map(String),
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  },
);

export const getProductIdsByCategory = cache(
  async (
    customerGroupSlug: string,
    categorySlug: string,
  ): Promise<string[]> => {
    try {
      const category = await (
        await getCustomerCategoriesCollection()
      ).findOne({ slug: customerGroupSlug });

      if (!category) return [];

      return category.subcategories
        .filter((sub) => sub.slug === categorySlug)
        .flatMap((sub) => sub.productIds.map(String));
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  },
);

export const getCategoryByProductId = cache(
  async (
    productId: string,
  ): Promise<{
    customerGroupName: string;
    customerGroupSlug: string;
    categoryName: string;
    categorySlug: string;
  } | null> => {
    try {
      const category = await (
        await getCustomerCategoriesCollection()
      ).findOne(
        { "subcategories.productIds": new ObjectId(productId) },
        { projection: { name: 1, slug: 1, "subcategories.$": 1 } },
      );

      if (!category || !category.subcategories.length) return null;

      return {
        customerGroupName: category.name,
        customerGroupSlug: category.slug,
        categoryName: category.subcategories[0].name,
        categorySlug: category.subcategories[0].slug,
      };
    } catch (error) {
      console.error("Failed to find category:", error);
      return null;
    }
  },
);

export const getProductIdsByCollection = cache(
  async (collectionSlug: string): Promise<string[]> => {
    try {
      const categories = await (await getCustomerCategoriesCollection())
        .find(
          { "subcategories.slug": collectionSlug },
          { projection: { "subcategories.$": 1 } },
        )
        .toArray();

      if (!categories.length) return [];

      return categories.flatMap((cat) =>
        cat.subcategories.flatMap((sub) =>
          sub.slug === collectionSlug ? sub.productIds.map(String) : [],
        ),
      );
    } catch (error) {
      console.error("Failed to fetch productIds:", error);
      return [];
    }
  },
);

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await (await getProductCollection()).find({}).toArray();

    return products.map(({ _id, images, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      images: images.map((image) => baseImgUrl + image),
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
});

export const getSimilarProductIds = cache(
  async (productId: string): Promise<string[]> => {
    try {
      const category = await (
        await getCustomerCategoriesCollection()
      ).findOne(
        { "subcategories.productIds": new ObjectId(productId) },
        { projection: { "subcategories.$": 1 } },
      );

      if (!category || !category.subcategories.length) return [];

      const similarProductIds = category.subcategories[0].productIds
        .map(String)
        .filter((id) => id !== productId);

      return similarProductIds;
    } catch (error) {
      console.error("Failed to find productId:", error);
      return [];
    }
  },
);

export async function getCart(): Promise<CartResponse> {
  try {
    const { userId } = await verifySession();
    if (!userId) {
      return { error: "Please sign in to view cart!" };
    }

    const cart = await (
      await getCartCollection()
    ).findOne({ userId: new ObjectId(userId) });

    if (!cart) {
      return { error: "Cart not found!" };
    }

    if (cart.products.length === 0)
      return { error: "Your shopping cart is empty." };

    const products = cart.products.map(({ productId, ...rest }) => ({
      ...rest,
      productId: productId.toString(),
    }));

    const quantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0,
    );

    return { products, quantity };
  } catch {
    return { error: "An unexpected error occurred!" };
  }
}

export async function getInvoices(): Promise<InvoicesResponse> {
  try {
    const { userId } = await verifySession();
    if (!userId) {
      return { error: "Please sign in to view invoices!" };
    }

    const invoiceList = await (
      await getInvoiceListCollection()
    ).findOne({ userId: new ObjectId(userId) });

    if (!invoiceList) {
      return { error: "Invoice List not found!" };
    }

    if (invoiceList.invoices.length === 0) return { error: "No invoice!" };

    const invoices = invoiceList.invoices.map(
      ({ invoiceId, products, ...rest }) => ({
        ...rest,
        invoiceId: invoiceId.toString(),
        products: products.map(({ productId, ...rest }) => ({
          ...rest,
          productId: productId.toString(),
        })),
      }),
    );

    return { invoices };
  } catch {
    return { error: "An unexpected error occurred!" };
  }
}
