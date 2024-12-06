import { shuffleProduct } from "@/lib/utils";
import { products } from "@/lib/placeholder-data";
import ProductList from "@/ui/product/list";
import BreadCrumbs from "@/ui/breadcrumbs";

export default function AllProductsPage() {
  const allProducts = shuffleProduct(products);
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
      <ProductList products={allProducts} title="All Products" />
    </>
  );
}
