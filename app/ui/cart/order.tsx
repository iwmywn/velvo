"use client";

import { formatCurrency } from "@/utils/currency";
// import EmptyState from "@ui/cart/empty";
import { MdDelete } from "react-icons/md";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { mockProducts } from "@/lib/placeholder-data";
import useDeviceType from "@ui/hooks/device-type";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

export default function Order() {
  const deviceType = useDeviceType();

  return (
    <>
      {deviceType === "desktop" ? <DeskTop /> : <Mobile />}
      {/* <EmptyState emptyState="cart" /> */}
    </>
  );
}

function DeskTop() {
  return (
    <>
      <div className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border text-center font-medium">
        {heads.map((head) => (
          <div className="whitespace-nowrap p-2" key={head}>
            {head}
          </div>
        ))}
      </div>
      {mockProducts.map(({ src, name, priceCents, quantity }) => (
        <div
          className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border"
          key={src}
        >
          <div className="flex flex-col items-center justify-center gap-2 p-2 text-center sm:flex-row sm:justify-start sm:text-left">
            <ImageTag src={src} name={name} />
            <span className="md:line-clamp-1">{name}</span>
          </div>
          <div className="flex items-center justify-center">
            ${formatCurrency(priceCents)}
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center border">
              <button className="border-r px-3 py-1 transition-all duration-300 hover:bg-stone-100">
                -
              </button>
              <span className="select-none px-3 py-1 text-xs">{quantity}</span>
              <button className="border-l px-3 py-1 transition-all duration-300 hover:bg-stone-100">
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            ${formatCurrency(priceCents * quantity)}
          </div>
          <div className="flex items-center justify-center">
            <Button>
              <span className="sm:hidden">
                <MdDelete />
              </span>
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}

function Mobile() {
  return (
    <>
      {mockProducts.map(({ src, name, priceCents, quantity }) => (
        <div
          className="mb-2 flex min-w-[250px] items-center gap-2 rounded-md border p-2"
          key={src}
        >
          <div className="flex items-center justify-center">
            <ImageTag className="h-16 w-16" src={src} name={name} />
          </div>
          <div className="flex flex-1 flex-col gap-2 text-xs">
            <span className="line-clamp-2">{name}</span>
            <div className="flex items-center justify-between">
              <span>${formatCurrency(priceCents)}</span>
              <div className="whitespace-nowrap border">
                <button className="border-r px-2 transition-all duration-300 hover:bg-stone-100">
                  -
                </button>
                <span className="select-none px-2">{quantity}</span>
                <button className="border-l px-2 transition-all duration-300 hover:bg-stone-100">
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>${formatCurrency(priceCents * quantity)}</span>
              <Button className="h-auto py-1">
                <span className="sm:hidden">
                  <MdDelete />
                </span>
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
