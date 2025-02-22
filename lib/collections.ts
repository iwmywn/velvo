import { collection } from "@lib/mongodb";
import {
  DBUser,
  DBInvoiceList,
  DBCart,
  DBCustomerCategories,
  DBProduct,
  DBAvatar,
  DBBanner,
  DBCollection,
} from "@lib/definitions";

export async function getAvatarCollection() {
  return await collection<DBAvatar>("avatars");
}

export async function getBannerCollection() {
  return await collection<DBBanner>("banners");
}

export async function getCollectionCollection() {
  return await collection<DBCollection>("collections");
}

export async function getUserCollection() {
  return await collection<DBUser>("users");
}

export async function getInvoiceListCollection() {
  return await collection<DBInvoiceList>("invoiceLists");
}

export async function getCartCollection() {
  return await collection<DBCart>("carts");
}

export async function getCustomerCategoriesCollection() {
  return await collection<DBCustomerCategories>("customerCategories");
}

export async function getProductCollection() {
  return await collection<DBProduct>("products");
}
