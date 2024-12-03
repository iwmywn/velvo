"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import { usePathname } from "next/navigation";
import { products } from "@/lib/placeholder-data";
import ProductCard from "../product/card";
import { Product } from "@/lib/definition";

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
      <div
        className={`fixed inset-0 z-[9998] bg-black/70 ${
          isAnimating ? "animate-fadeOut" : "animate-fadeIn"
        }`}
        onClick={() => handleClose(true)}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 z-[9999] h-[80%] overflow-y-auto rounded-tl-lg rounded-tr-lg bg-white text-sm sm:left-auto sm:top-0 sm:h-auto sm:w-[50%] sm:rounded-bl-lg sm:rounded-tr-none lg:w-[33%] ${
            isAnimating
              ? "animate-centerToBottom sm:animate-leftToRight"
              : "animate-bottomToCenter sm:animate-rightToLeft"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
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
        </div>
      </div>
    </>
  );
}
