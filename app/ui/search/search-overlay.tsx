"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ProductCard from "@ui/product/card";
import { Product } from "@lib/definition";
import Backdrop from "@ui/overlays/backdrop";
import SlidingContainer from "@ui/overlays/sliding-container";
import useAnimation from "@ui/hooks/animation";
import { fetchProducts } from "@lib/data";
import Loading from "@ui/loading";

export default function SearchOverlay({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { isAnimating, triggerAnimation } = useAnimation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const handleClose = () => triggerAnimation(() => setIsOpen(false));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function initialize() {
      try {
        const productsStored: Product[] = sessionStorage.getItem("products")
          ? JSON.parse(sessionStorage.getItem("products") as string)
          : null;

        if (productsStored) setProducts(productsStored);
        else {
          setIsLoading(true);
          const products = await fetchProducts();
          setProducts(products);
          sessionStorage.setItem("products", JSON.stringify(products));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

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
            disabled={isLoading}
          />
        </div>
        {isLoading && <Loading />}
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
