"use client";

import { formatCurrency } from "@/utils/currency";
import useDeviceType from "@ui/hooks/device-type";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { mockOrders } from "@lib/placeholder-data";
import { GiShoppingCart } from "react-icons/gi";

export default function Completed() {
  const deviceType = useDeviceType();

  return <>{deviceType === "desktop" ? <DeskTop /> : <Mobile />}</>;
}

function DeskTop() {
  return (
    <>
      <div className="flex min-w-[600px] flex-col gap-6 text-sm">
        {mockOrders.map(({ id, products, totalPriceCents }) => (
          <div key={id} className="rounded-md border shadow-sm">
            <div className="flex justify-between border-b bg-stone-100 p-4">
              <div>
                <span className="font-medium">Order ID:</span> {id}
              </div>
              <div>
                <span className="font-medium">Total Price: </span>
                <span className="text-black">
                  ${formatCurrency(totalPriceCents)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {products.map(({ src, name, quantity, priceCents }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <ImageTag src={src} name={name} />
                    <div>
                      <h4 className="mb-1 text-sm text-gray-900">{name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {quantity} <span className="mx-2">|</span>{" "}
                        Price: ${formatCurrency(priceCents)}{" "}
                        <span className="mx-2">|</span> Total: $
                        {formatCurrency(priceCents * quantity)}
                      </p>
                    </div>
                  </div>
                  <Button>
                    <span className="sm:hidden">
                      <GiShoppingCart />
                    </span>
                    <span className="hidden sm:inline">Buy again</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Mobile() {
  return (
    <>
      <div className="flex flex-col gap-6 text-sm">
        {mockOrders.map(({ id, products, totalPriceCents }) => (
          <div
            key={id}
            className="min-w-[250px] rounded-md border text-xs shadow-sm"
          >
            <div className="flex flex-col gap-1 border-b bg-stone-100 p-4">
              <div className="">
                <span className="font-medium">Order ID:</span> {id}
              </div>
              <div>
                <span className="font-medium">Total Price: </span>
                <span className="text-black">
                  ${formatCurrency(totalPriceCents)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2">
              {products.map(({ src, name, quantity, priceCents }) => (
                <div
                  className="flex items-center gap-2 rounded-md border p-2"
                  key={src}
                >
                  <div className="flex items-center justify-center">
                    <ImageTag className="h-16 w-16" src={src} name={name} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="line-clamp-2">{name}</span>
                    <div className="flex items-center justify-between">
                      <span>${formatCurrency(priceCents)}</span>
                      <span className="select-none px-2">{quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>${formatCurrency(priceCents * quantity)}</span>
                      <Button className="h-auto py-1">
                        <span className="sm:hidden">
                          <GiShoppingCart />
                        </span>
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
