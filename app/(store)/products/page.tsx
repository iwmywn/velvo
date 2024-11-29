import { shuffleArray } from "@/lib/utils";
import { products } from "@/lib/placeholder-data";
import ProductGrid from "@/ui/product/grid";

export default function AllProductsPage() {
  const allProducts = shuffleArray(products);

  return (
    <div className="relative z-10 bg-white px-8 pt-8 md:px-20">
      <h1 className="mb-5 text-3xl font-bold">All Products</h1>
      <ProductGrid products={allProducts} />
    </div>
  );
}
