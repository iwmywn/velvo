"use client";

import { getPriceAfterDiscount, getTotalPriceCents } from "@lib/utils";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineCancel, MdCheck } from "react-icons/md";
import Link from "next/link";
import { InvoiceProductsProps, Product } from "@lib/definition";
import EmptyState from "@ui/cart/empty";
import { useState } from "react";
import { toast } from "react-toastify";
import { addToCart, cancelReceiveOrder } from "@lib/actions";
import { useAuthContext } from "@ui/hooks/auth";
import { useRouter } from "next/navigation";
import useOverflow from "@ui/hooks/overflow";
import Backdrop from "@ui/overlays/backdrop";
import { fetchCartProductQuantity } from "@/app/lib/data";
import { useCartContext } from "@ui/hooks/cart";

export default function OrderList({
  invoiceProducts,
  orderStatus,
  emptyState,
}: {
  invoiceProducts: InvoiceProductsProps;
  orderStatus: ("WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED")[];
  emptyState: "toShipNReceive" | "cancelled" | "completed";
}) {
  const { userId } = useAuthContext();
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<{
    invoiceId: string;
    products: (Product & { quantity: number; size: string })[];
    status: "PROCESSING" | "WAITING";
  } | null>(null);
  const { setQuantity } = useCartContext();
  const setButtonLoading = (key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: isLoading }));
  };

  useOverflow(isOpen);

  if (!invoiceProducts) {
    return <EmptyState emptyState={emptyState} />;
  }
  const invoiceProductsFilter = invoiceProducts.filter(({ status }) =>
    orderStatus.includes(status),
  );
  if (invoiceProductsFilter.length === 0)
    <EmptyState emptyState={emptyState} />;

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 250);
  };

  const handleCancelReceive = async (
    invoiceId: string,
    products: (Product & {
      quantity: number;
      size: string;
    })[],
    status: "PROCESSING" | "WAITING",
    isConfirm: boolean = false,
  ) => {
    if (!isConfirm) {
      setData({ invoiceId, products, status });
      setIsOpen(true);
      return;
    }

    const convertedProducts = products.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      size: p.size,
    }));

    setButtonLoading(invoiceId, true);
    try {
      const message = await cancelReceiveOrder(
        userId,
        invoiceId,
        convertedProducts,
        status === "PROCESSING" ? "COMPLETED" : "CANCELLED",
      );

      if (message === "Done.") {
        toast.success(
          status === "PROCESSING" ? "Order Completed." : "Order Cancelled.",
        );
        toast.success("Is redirecting...");
        router.push(
          `/user/purchase?tab=${status === "PROCESSING" ? "completed" : "cancelled"}`,
        );
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setButtonLoading(invoiceId, false);
      setData(null);
    }
  };

  const handleAddToCart = async (
    invoiceId: string,
    productId: string,
    size: string,
  ) => {
    const key = `${invoiceId}-${productId}-${size}`;
    setButtonLoading(key, true);

    try {
      const message = await addToCart(productId, userId, size);

      if (message === "Done.") {
        router.push("/cart-overlay");
        const updatedQuantity = await fetchCartProductQuantity(userId);
        setQuantity(updatedQuantity);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setButtonLoading(key, false);
    }
  };

  return (
    <>
      {isOpen && data && (
        <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="mb-10 text-center text-base">
              Please confirm the order{" "}
              {data.status === "PROCESSING" ? "completion" : "cancellation"}.
            </h2>
            <div className="flex justify-between">
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  handleCancelReceive(
                    data.invoiceId,
                    data.products,
                    data.status,
                    true,
                  );
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Backdrop>
      )}
      <div className="flex flex-col gap-6 text-sm">
        {invoiceProductsFilter.map(({ invoiceId, products, status }) => (
          <div key={invoiceId} className="relative rounded-md border">
            <div
              className={`absolute left-0 top-0 z-[1] ml-auto rounded-tl-md px-2 text-center text-[10px] text-white ${status === "WAITING" ? "bg-blue-500" : status === "PROCESSING" ? "bg-yellow-500" : status === "COMPLETED" ? "bg-green-500" : "bg-red-500"}`}
            >
              {status}
            </div>
            <div className="flex justify-between border-b bg-slate-50 px-4 pb-4 pt-8">
              <div>
                <span className="font-medium">Order ID:</span>{" "}
                <span className="opacity-65">{invoiceId}</span>
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
                      id,
                      name,
                      priceCents,
                      images,
                      description,
                      saleOff,
                      slug,
                      quantity,
                      size,
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
                              {name} - {size}
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

                      {status !== "PROCESSING" && status !== "WAITING" && (
                        <Button
                          className="ml-auto flex items-center gap-2"
                          onClick={() => handleAddToCart(invoiceId, id, size)}
                          disabled={
                            loadingStates[`${invoiceId}-${id}-${size}`] || false
                          }
                        >
                          {loadingStates[`${invoiceId}-${id}-${size}`] ? (
                            <div className="mx-auto h-4 w-4 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                          ) : (
                            <>
                              <GiShoppingCart />
                              <span className="hidden sm:inline sm:truncate">
                                Buy again
                              </span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ),
                )}
                {(status === "PROCESSING" || status === "WAITING") && (
                  <Button
                    className="ml-auto flex items-center gap-2"
                    onClick={() =>
                      handleCancelReceive(invoiceId, products, status)
                    }
                    disabled={loadingStates[invoiceId] || false}
                  >
                    {loadingStates[invoiceId] ? (
                      <div className="mx-auto h-4 w-4 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                    ) : (
                      <>
                        {status === "PROCESSING" ? (
                          <MdCheck />
                        ) : (
                          <MdOutlineCancel />
                        )}
                        <span className="hidden sm:inline sm:truncate">
                          {status === "PROCESSING" ? "Received" : "Cancel"}
                        </span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
