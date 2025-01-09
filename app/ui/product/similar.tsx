import ProductList from "@ui/product/list";
import { Product } from "@lib/definitions";

export default function SimilarProducts({
  similarProducts,
}: {
  similarProducts: Product[];
}) {
  return (
    <div className="mt-10">
      <ProductList products={similarProducts} title="You may also like" />
    </div>
  );
}
