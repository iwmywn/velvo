"use client";

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
import { useAuthContext } from "@ui/context/auth";
import { useRouter } from "next/navigation";
import Backdrop from "@ui/overlays/backdrop";
import { useCartContext } from "@ui/context/cart";
import { MdOutlinePlace } from "react-icons/md";
import Loading from "@ui/loading";
import useAnimation from "@ui/hooks/animation";
import { useUIState } from "@ui/context/state";

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
  const [isLoadingGlobal, setIsLoadingGlobal] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<{
    invoiceId: string;
    products: (Product & { quantity: number; size: string })[];
    status: "PROCESSING" | "WAITING";
  } | null>(null);
  const [deliveryInfoData, setDeliveryInfoData] = useState<{
    recipient: string;
    phone: string;
    address: string;
    date: Date;
  } | null>(null);
  const { isAnimating, triggerAnimation } = useAnimation();
  const { isLoading, refreshCart } = useCartContext();
  const { state, setState } = useUIState();
  const setButtonLoading = (key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: isLoading }));
  };

  const invoiceProductsFilter = invoiceProducts?.filter(({ status }) =>
    orderStatus.includes(status),
  );

  if (isLoading) return <Loading />;

  if (invoiceProductsFilter === undefined || invoiceProductsFilter.length === 0)
    return <EmptyState emptyState={emptyState} />;

  const handleClose = () =>
    triggerAnimation(() => {
      setState("isConfirmOrderOpen", false);
      setState("isDeliveryInfoOpen", false);
    });

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
      setInvoiceData({ invoiceId, products, status });
      setState("isConfirmOrderOpen", true);
      return;
    }

    const statusUrl = status === "PROCESSING" ? "completed" : "cancelled";
    const convertedProducts = products.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
      size: p.size,
    }));

    setButtonLoading(invoiceId, true);
    setIsLoadingGlobal(true);
    try {
      const message = await cancelReceiveOrder(
        userId,
        invoiceId,
        convertedProducts,
        statusUrl.toUpperCase() as "COMPLETED" | "CANCELLED",
      );

      if (message === "Done.") {
        await refreshCart(false, false, true);
        router.push(`/user/purchase?tab=${statusUrl}`);
        toast.success(
          status === "PROCESSING" ? "Order Completed." : "Order Cancelled.",
        );
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Cancel Receive Error: ", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setButtonLoading(invoiceId, false);
      setIsLoadingGlobal(false);
      setInvoiceData(null);
    }
  };

  const handleBuyAgain = async (
    invoiceId: string,
    productId: string,
    size: string,
  ) => {
    const key = `${invoiceId}-${productId}-${size}`;
    setButtonLoading(key, true);
    setIsLoadingGlobal(true);

    try {
      const message = await addToCart(productId, userId, size);

      if (message === "Done.") {
        await refreshCart(true, true, false);
        setState("isCartOpen", true);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Add to cart Error: ", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setButtonLoading(key, false);
      setIsLoadingGlobal(false);
    }
  };

  return (
    <>
      {state.isConfirmOrderOpen && invoiceData && (
        <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="mb-8 text-center text-base font-medium">
              Please confirm the order{" "}
              {invoiceData.status === "PROCESSING"
                ? "completion"
                : "cancellation"}
              .
            </h2>
            <div className="flex justify-between">
              <Button
                className="text-black before:border-black before:bg-white"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="text-red-500 before:border-red-500 before:bg-white"
                onClick={() => {
                  handleCancelReceive(
                    invoiceData.invoiceId,
                    invoiceData.products,
                    invoiceData.status,
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
      {state.isDeliveryInfoOpen && deliveryInfoData && (
        <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-center text-base font-semibold">
              Delivery Information
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Recipient:</span>{" "}
                {deliveryInfoData.recipient}
              </p>
              <p>
                <span className="font-medium text-gray-800">Phone Number:</span>{" "}
                {deliveryInfoData.phone}
              </p>
              <p>
                <span className="font-medium text-gray-800">
                  Shipping Address:
                </span>{" "}
                {deliveryInfoData.address}
              </p>
              <p>
                <span className="font-medium text-gray-800">Order date:</span>{" "}
                {deliveryInfoData.date.toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </Backdrop>
      )}
      <div className="flex flex-col gap-6 text-sm">
        {invoiceProductsFilter.map(
          ({
            invoiceId,
            products,
            status,
            recipient,
            phone,
            date,
            address,
            totalPriceCents,
          }) => (
            <div key={invoiceId} className="relative border">
              <div
                className={`absolute left-0 top-0 z-[1] ml-auto px-2 text-center text-[10px] text-white ${status === "WAITING" ? "bg-blue-500" : status === "PROCESSING" ? "bg-yellow-500" : status === "COMPLETED" ? "bg-green-500" : "bg-red-500"}`}
              >
                {status}
              </div>
              <div className="flex justify-between gap-5 border-b bg-slate-50 px-4 pb-4 pt-8">
                <div>
                  <span className="font-medium">Order ID:</span>{" "}
                  <span className="opacity-65">{invoiceId}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">Total Price: </span>
                  <span className="opacity-65">${totalPriceCents}</span>
                </div>
              </div>
              <div className="p-2">
                <div className="flex flex-col gap-2">
                  {products.map(
                    (
                      {
                        id,
                        name,
                        images,
                        description,
                        slug,
                        quantity,
                        size,
                        priceCentsAfterDiscount,
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
                                  Price: ${priceCentsAfterDiscount[0]}
                                </span>
                                <span className="mx-2">|</span>
                                <span>
                                  Total: ${priceCentsAfterDiscount[1]}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>

                        {status !== "PROCESSING" && status !== "WAITING" && (
                          <Button
                            className="ml-auto flex items-center gap-2 text-green-600 before:border-green-600 before:bg-white"
                            onClick={() => handleBuyAgain(invoiceId, id, size)}
                            disabled={
                              loadingStates[`${invoiceId}-${id}-${size}`] ||
                              isLoadingGlobal
                            }
                          >
                            {loadingStates[`${invoiceId}-${id}-${size}`] ? (
                              <div className="mx-auto h-4 w-4 animate-spin rounded-full border-4 border-green-300 border-t-green-600" />
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
                  <div className="flex justify-between">
                    <Button
                      className="flex items-center gap-2 text-black before:bg-white"
                      onClick={() => {
                        setDeliveryInfoData({
                          recipient,
                          phone,
                          address,
                          date,
                        });
                        setState("isDeliveryInfoOpen", true);
                      }}
                    >
                      <MdOutlinePlace />
                      <span className="hidden sm:inline sm:truncate">
                        Delivery Information
                      </span>
                    </Button>
                    {(status === "PROCESSING" || status === "WAITING") && (
                      <Button
                        className={`${status === "PROCESSING" ? "text-green-500 before:border-green-500" : "text-red-500 before:border-red-500"} flex items-center gap-2 before:bg-white`}
                        onClick={() =>
                          handleCancelReceive(invoiceId, products, status)
                        }
                        disabled={loadingStates[invoiceId] || isLoadingGlobal}
                      >
                        {loadingStates[invoiceId] ? (
                          <div
                            className={`mx-auto h-4 w-4 animate-spin rounded-full border-4 ${status === "PROCESSING" ? "border-green-300 border-t-green-600" : "border-red-300 border-t-red-600"}`}
                          />
                        ) : (
                          <>
                            {status === "PROCESSING" ? (
                              <MdCheck />
                            ) : (
                              <MdOutlineCancel />
                            )}
                            <span className="hidden sm:inline sm:truncate">
                              {status === "PROCESSING"
                                ? "Received"
                                : "Cancel order"}
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </>
  );
}
