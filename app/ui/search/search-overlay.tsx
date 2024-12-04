"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";
import { products } from "@/lib/placeholder-data";
import ProductCard from "@ui/product/card";
import { Product } from "@/lib/definition";
import Backdrop from "@ui/overlays/backdrop";
import SlidingContainer from "@ui/overlays/sliding-container";

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [wasInProductPage, setWasInProductPage] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const handleClose = useCallback(
    (shouldNavigate: boolean) => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setIsOpen(false);
        if (shouldNavigate && !pathname.includes("/product/")) router.back();
      }, 250);
      setWasInProductPage(false);
    },
    [pathname, router],
  );

  useOverflow(isOpen);

  useEffect(() => {
    if (pathname === "/search-overlay") setIsOpen(true);
    if (pathname.includes("/product/") && !wasInProductPage) {
      setWasInProductPage(true);
      handleClose(true);
    }
  }, [pathname, handleClose, wasInProductPage]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(results);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <>
      <Backdrop isAnimating={isAnimating} onClick={() => handleClose(true)}>
        <SlidingContainer isAnimating={isAnimating}>
          <div className="relative p-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-black/80 outline-none focus:border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm.trim() === "" ? (
            <div className="mx-4 text-center">
              Search for the latest fashion trends that match your style.
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 p-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="mx-4 text-center">No products found.</div>
          )}
        </SlidingContainer>
      </Backdrop>
    </>
  );
}
