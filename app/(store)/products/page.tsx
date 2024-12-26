import { shuffleProduct } from "@lib/utils";
import ProductList from "@ui/product/list";
import BreadCrumbs from "@ui/breadcrumbs";
import { fetchProducts } from "@lib/data";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "All Products" };
}

export default async function AllProductsPage() {
  const products = await fetchProducts();
  const allProducts = shuffleProduct(products);

  return (
    <>
      <BreadCrumbs
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "All Products",
          },
        ]}
      />
      <ProductList products={allProducts} title="All Products" />
    </>
  );
}
