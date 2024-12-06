import { shuffleProduct } from "@/lib/utils";
import ProductList from "@/ui/product/list";
import BreadCrumbs from "@/ui/breadcrumbs";
import { fetchProducts } from "@/lib/data";

export default async function AllProductsPage() {
  const products = await fetchProducts();
  // const allProducts = shuffleProduct(products);
  const breadcrumbs = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "All Products",
    },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <ProductList products={products} title="All Products" />
    </>
  );
}
