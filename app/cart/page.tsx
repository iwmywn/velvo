"use client";

import Image from "next/image";
import { MdDelete } from "react-icons/md";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

const mockProduct = [
  {
    href: "/men_1.png",
    name: "Young Green College Varsity Jacket",
    price: 45,
    quantity: 2,
  },
  {
    href: "/women_1.png",
    name: "Cardigan",
    price: 70,
    quantity: 1,
  },
] as const;

const centerClass = "flex items-center justify-center text-center";

export default function CartPage() {
  return (
    <main className="relative z-10 bg-white px-8 pb-28 pt-10 md:px-20">
      <h3 className="mb-5 text-xl font-medium">REVIEW YOUR ORDER (mock)</h3>
      <div className="flex flex-col overflow-x-scroll text-sm min-[400px]:overflow-visible">
        <div className="mb-4 grid grid-cols-5 rounded-lg border sm:grid-cols-6 lg:grid-cols-7">
          {heads.map((head, index) => (
            <div
              className={`flex items-center justify-center text-nowrap py-2 font-medium ${index === 0 && "col-auto sm:col-span-2 lg:col-span-3"}`}
              key={head}
            >
              {head}
            </div>
          ))}
        </div>
        {mockProduct.map(({ href, name, price, quantity }, index) => (
          <div
            className="mb-2 grid grid-cols-5 rounded-lg border py-2 sm:grid-cols-6 md:py-0 lg:grid-cols-7"
            key={index}
          >
            <div className="relative col-auto flex flex-col items-center justify-center gap-x-3 gap-y-1 p-1 text-center sm:col-span-2 md:flex-row md:justify-normal md:text-left lg:col-span-3">
              <span className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={href}
                  alt="product"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </span>
              <span className="md:line-clamp-1">{name}</span>
            </div>
            <div className={centerClass}>${price}</div>
            <div className={`${centerClass}`}>
              <div className="flex flex-col flex-nowrap items-center border min-[900px]:flex-row">
                <button className="border-b px-3 py-1 min-[900px]:border-b-0 min-[900px]:border-r">
                  -
                </button>
                <span className="select-none px-3 py-1">{quantity}</span>
                <button className="border-t px-3 py-1 min-[900px]:border-l min-[900px]:border-t-0">
                  +
                </button>
              </div>
            </div>
            <div className={centerClass}>${price * quantity}</div>
            <div className={`${centerClass}`}>
              <button className="rounded bg-black px-4 py-1 text-white transition-all duration-300 hover:scale-95">
                <span className="sm:hidden">
                  <MdDelete />
                </span>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
