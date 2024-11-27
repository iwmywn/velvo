"use client";

import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { GiShoppingCart } from "react-icons/gi";
import Link from "next/link";

const mockOrders = [
  {
    id: "82893usax3ep57qq53a6wf83fqahkc",
    products: [
      {
        href: "/men_1.png",
        name: "Young Green College Varsity Jacket",
        quantity: 2,
        priceCents: 4545,
      },
      {
        href: "/women_1.png",
        name: "Cardigan",
        quantity: 1,
        priceCents: 7000,
      },
    ],
  },
  {
    id: "e7g5g79cvcrtyb4zwv7g386c58gea5",
    products: [
      {
        href: "/women_2.png",
        name: "Tiffany Dress",
        quantity: 1,
        priceCents: 12000,
      },
    ],
  },
].map((order) => ({
  ...order,
  totalPriceCents: order.products.reduce(
    (total, product) => total + product.priceCents * product.quantity,
    0,
  ),
}));

export default function OrderHistory() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-gray-500">
          <GiShoppingCart fontSize={50} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">
          No Completed Orders
        </h1>
        <p className="text-center text-gray-500">
          You haven&apos;t completed any orders yet. Start shopping and place
          your first order!
        </p>
        <Link
          className="mt-2 rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
          href="/"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function haveOrder() {
  return (
    <>
      <div className="flex min-w-[600px] flex-col gap-6 text-sm">
        {mockOrders.map(({ id, products, totalPriceCents }) => (
          <div key={id} className="rounded-md border shadow-sm">
            {/* Order Header */}
            <div className="flex justify-between border-b bg-stone-100 p-4">
              <div className="text-gray-700">
                <span className="font-medium">Order ID:</span> {id}
              </div>
              <div className="text-gray-900">
                <span className="font-medium">Total Price: </span>
                <span className="text-black">
                  ${formatCurrency(totalPriceCents)}
                </span>
              </div>
            </div>
            {/* Product List */}
            <div className="flex flex-col gap-4 p-4">
              {products.map(({ href, name, quantity, priceCents }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <span className="relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
                      <Image
                        src={href}
                        alt="product"
                        fill
                        priority
                        style={{ objectFit: "contain" }}
                      />
                    </span>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-gray-900">
                        {name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {quantity} <span className="mx-2">|</span>{" "}
                        Price: ${formatCurrency(priceCents)}{" "}
                        <span className="mx-2">|</span> Total: $
                        {formatCurrency(priceCents * quantity)}
                      </p>
                    </div>
                  </div>
                  {/* Buy Again */}
                  <button className="rounded bg-black px-4 py-[6px] text-white transition-all duration-300 hover:scale-95">
                    <span className="sm:hidden">
                      <GiShoppingCart />
                    </span>
                    <span className="hidden sm:inline">Buy again</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
