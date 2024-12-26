"use client";

import { useEffect, useState } from "react";
import ProductCard from "@ui/product/card";
import { Product } from "@lib/definition";
import Backdrop from "@ui/overlays/backdrop";
import SlidingContainer from "@ui/overlays/sliding-container";
import useAnimation from "@ui/hooks/animation";
import { useProduct } from "@ui/context/products";
import { useUIState } from "@ui/context/state";

export default function SearchOverlay() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { setState } = useUIState();
  const handleClose = () =>
    triggerAnimation(() => setState("isSearchOpen", false));
  const { products } = useProduct();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter((product) =>
        product.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .includes(searchTerm.toLowerCase().replace(/\s+/g, "-")),
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, products]);

  return (
    <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
      <SlidingContainer isAnimating={isAnimating}>
        <div className="relative p-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded border border-slate-300 px-4 py-2 text-sm text-black/80 outline-none focus:border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        {searchTerm.trim() === "" ? (
          <div className="mx-4 text-center text-sm">
            Search for the latest fashion trends that match your style.
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredProducts.map((product) => (
              <span key={product.id} onClick={handleClose}>
                <ProductCard {...product} />
              </span>
            ))}
          </div>
        ) : (
          <div className="mx-4 text-center text-sm">No products found.</div>
        )}
      </SlidingContainer>
    </Backdrop>
  );
}
