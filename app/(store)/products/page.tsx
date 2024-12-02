import { shuffleProduct } from "@/lib/utils";
import { products } from "@/lib/placeholder-data";
import ProductList from "@/ui/product/list";

export default function AllProductsPage() {
  const allProducts = shuffleProduct(products);

  return (
    <>
      <ProductList products={allProducts} title="ALL PRODUCTS" />
    </>
  );
}
