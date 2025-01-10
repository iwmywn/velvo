"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@ui/product/card";
import { Product } from "@lib/definitions";
import Backdrop from "@ui/overlay/backdrop";
import SlidingContainer from "@ui/overlay/sliding-container";
import { useAnimation } from "@ui/hooks";
import { useProductContext, useUIStateContext } from "@ui/contexts";
import Fuse from "fuse.js";

export default function SearchOverlay() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { setState } = useUIStateContext();
  const handleClose = () =>
    triggerAnimation(() => setState("isSearchOpen", false));
  const { products } = useProductContext();
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ["name"],
      threshold: 0.4,
    });
  }, [products]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = fuse.search(searchTerm).map((result) => result.item);
      setFilteredProducts(results);
    }
  }, [searchTerm, fuse]);

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
              <span key={product._id} onClick={handleClose}>
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
