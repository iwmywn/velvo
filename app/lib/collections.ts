import { collection } from "@lib/mongodb";
import {
  DBUser,
  DBInvoiceList,
  DBCart,
  DBCategory,
  DBProduct,
  DBAvatar,
} from "@lib/definitions";

export async function getAvatarCollection() {
  return await collection<DBAvatar>("avatars");
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

export async function getCategoryCollection() {
  return await collection<DBCategory>("categories");
}

export async function getProductCollection() {
  return await collection<DBProduct>("products");
}
