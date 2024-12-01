"use client";

import { formatCurrency } from "@/utils/currency";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { mockOrders } from "@lib/placeholder-data";
import { GiShoppingCart } from "react-icons/gi";

export default function Completed() {
  return (
    <div className="flex flex-col gap-6 text-sm">
      {mockOrders.map(({ id, products, totalPriceCents }) => (
        <div key={id} className="rounded-md border shadow-sm">
          <div className="flex justify-between border-b bg-stone-100 p-4">
            <div>
              <span className="font-medium">Order ID:</span>{" "}
              <span className="line-clamp-1 truncate text-xs sm:text-sm">
                {id}
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium">Total Price: </span>
              <span className="text-xs sm:text-sm">
                ${formatCurrency(totalPriceCents)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-2 text-xs sm:text-sm">
            {products.map(({ src, name, quantity, priceCents }, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center justify-between gap-4 border p-2 sm:flex-nowrap"
              >
                <div className="flex items-center gap-4 sm:gap-2">
                  <ImageTag src={src} alt={name} />
                  <div className="">
                    <h4 className="mb-1 line-clamp-2 max-w-fit text-sm">
                      {name}
                    </h4>
                    <p className="flex flex-wrap gap-y-1 text-gray-600">
                      <span>Quantity: {quantity}</span>
                      <span className="mx-2">|</span>
                      <span>Price: ${formatCurrency(priceCents)}</span>
                      <span className="mx-2">|</span>
                      <span>
                        Total: ${formatCurrency(priceCents * quantity)}
                      </span>
                    </p>
                  </div>
                </div>

                <Button
                  className="ml-auto flex items-center gap-2"
                  type="submit"
                >
                  <GiShoppingCart />
                  <span className="hidden sm:inline sm:truncate">
                    Buy again
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
