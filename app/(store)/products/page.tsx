import shuffleArray from "@/lib/utils";
import { productsByCategory } from "@/lib/placeholder-data";
import { Fragment } from "react";
import ProductGrid from "@/ui/product/grid";

export default function AllProductsPage() {
  const allProducts = shuffleArray([
    ...productsByCategory.men,
    ...productsByCategory.women,
    ...productsByCategory.kids,
  ]);

  return (
    <div className="relative z-10 bg-white px-8 pt-8 md:px-20">
      <h1 className="mb-5 text-3xl font-bold">All Products</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allProducts.map(({ id, name, priceCents, images, saleOff }) => (
          <Fragment key={id}>
            <ProductGrid
              id={id}
              name={name}
              priceCents={priceCents}
              images={images}
              saleOff={saleOff}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
