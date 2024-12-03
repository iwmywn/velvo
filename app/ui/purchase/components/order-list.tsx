import {
  getPriceAfterDiscount,
  getTotalPriceCents,
  getInvoiceProductsByCustomerId,
} from "@lib/utils";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { GiShoppingCart } from "react-icons/gi";
import Link from "next/link";

interface OrderListProps {
  customerId: number;
  status: "PROCESSING" | "COMPLETED" | "CANCELLED";
}

export default function OrderList({ customerId, status }: OrderListProps) {
  const invoiceData = getInvoiceProductsByCustomerId(customerId, status);

  return (
    <div className="flex flex-col gap-6 text-sm">
      {invoiceData.map(({ invoiceId, products }) => (
        <div key={invoiceId} className="relative rounded-md border shadow-sm">
          <div
            className={`absolute left-0 top-0 z-[1] ml-auto rounded-tl-md px-2 text-center text-[10px] text-white ${status === "PROCESSING" ? "bg-yellow-500" : status === "COMPLETED" ? "bg-green-500" : "bg-red-500"}`}
          >
            {status}
          </div>
          <div className="flex justify-between border-b bg-stone-100 px-4 pb-4 pt-8">
            <div>
              <span className="font-medium">Order ID:</span>{" "}
              <span className="opacity-65">
                {invoiceId} (todo: use string here)
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium">Total Price: </span>
              <span className="opacity-65">
                ${getTotalPriceCents(products)}
              </span>
            </div>
          </div>
          <div className="p-2">
            <div className="flex flex-col gap-4">
              {products.map(
                (
                  {
                    name,
                    priceCents,
                    images,
                    description,
                    saleOff,
                    slug,
                    quantity,
                  },
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center justify-between gap-4 border p-2 sm:flex-nowrap"
                  >
                    <Link href={`/product/${slug}`}>
                      <div className="flex items-center gap-4 sm:gap-2">
                        <ImageTag src={images[0]} alt={description} />
                        <div>
                          <h4 className="mb-1 line-clamp-2 font-medium">
                            {name}
                          </h4>
                          <p className="flex flex-wrap gap-y-1 opacity-65">
                            <span>Quantity: {quantity}</span>
                            <span className="mx-2">|</span>
                            <span>
                              Price: $
                              {getPriceAfterDiscount(priceCents, saleOff)}
                            </span>
                            <span className="mx-2">|</span>
                            <span>
                              Total: $
                              {getPriceAfterDiscount(
                                priceCents,
                                saleOff,
                                quantity,
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    {status !== "PROCESSING" && (
                      <Button
                        className="ml-auto flex items-center gap-2"
                        type="submit"
                      >
                        <GiShoppingCart />
                        <span className="hidden sm:inline sm:truncate">
                          Buy again
                        </span>
                      </Button>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
