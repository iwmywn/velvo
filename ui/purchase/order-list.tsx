"use client";

import ImageTag from "@ui/image";
import Button from "@ui/button";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineCancel, MdCheck } from "react-icons/md";
import Link from "next/link";
import EmptyState from "@ui/cart/empty";
import { useState } from "react";
import showToast from "@ui/toast";
import { addToCart, cancelReceiveOrder } from "@lib/actions";
import { useProductContext, useUIStateContext } from "@ui/contexts";
import { useRouter } from "next/navigation";
import Backdrop from "@ui/overlay/backdrop";
import { MdOutlinePlace } from "react-icons/md";
import Loading from "@ui/loading";
import { useAnimation } from "@ui/hooks";
import { transformInvoiceProducts } from "@lib/utils";
import { useInvoices } from "@lib/hooks";
import { mutate } from "swr";

export default function OrderList({
  orderStatus,
  emptyState,
}: {
  orderStatus: ("waiting" | "processing" | "completed" | "cancelled")[];
  emptyState: "toShipNReceive" | "cancelled" | "completed";
}) {
  const { isLoading, invoices } = useInvoices();
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [isLoadingGlobal, setIsLoadingGlobal] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<{
    invoiceId: string;
    products: {
      productId: string;
      quantity: number;
      size: string;
      discountedPriceDetails: [string, string];
    }[];
    status: "processing" | "waiting";
  } | null>(null);
  const [deliveryInfoData, setDeliveryInfoData] = useState<{
    recipient: string;
    phone: string;
    address: string;
    orderDate: Date;
  } | null>(null);
  const { isAnimating, triggerAnimation } = useAnimation();
  const { state, setState } = useUIStateContext();
  const setButtonLoading = (key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: isLoading }));
  };
  const { products } = useProductContext();

  const invoicesFilter = invoices.filter(({ status }) =>
    orderStatus.includes(status),
  );

  if (isLoading) return <Loading />;

  if (invoicesFilter.length === 0)
    return <EmptyState emptyState={emptyState} />;

  const handleClose = () =>
    triggerAnimation(() => {
      setState("isConfirmOrderOpen", false);
      setState("isDeliveryInfoOpen", false);
    });

  const handleCancelReceive = async (
    invoiceId: string,
    products: {
      productId: string;
      quantity: number;
      size: string;
      discountedPriceDetails: [string, string];
    }[],
    status: "processing" | "waiting",
    isConfirm: boolean = false,
  ) => {
    if (!isConfirm) {
      setInvoiceData({ invoiceId, products, status });
      setState("isConfirmOrderOpen", true);
      return;
    }

    const statusUrl = status === "processing" ? "completed" : "cancelled";

    setButtonLoading(invoiceId, true);
    setIsLoadingGlobal(true);
    try {
      const message = await cancelReceiveOrder(invoiceId, products, statusUrl);

      if (message === "Done.") {
        await mutate("invoices");
        router.push(`/purchase?tab=${statusUrl}`);
        showToast(
          status === "processing" ? "Order Completed." : "Order Cancelled.",
          "success",
        );
      } else {
        showToast(message, "warning");
      }
    } catch (error) {
      console.error("Cancel Receive Error: ", error);
      showToast("Something went wrong! Please try again.", "warning");
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
      const message = await addToCart(productId, size);

      if (message === "Done.") {
        await mutate("cart");
        setState("isCartOpen", true);
      } else {
        showToast(message, "warning");
      }
    } catch (error) {
      console.error("Add to cart Error: ", error);
      showToast("Something went wrong! Please try again.", "warning");
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
              {invoiceData.status === "processing"
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
                {deliveryInfoData.orderDate.toLocaleString("en-US", {
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
        {invoicesFilter.map(
          ({
            invoiceId,
            products: invoiceProducts,
            status,
            recipient,
            phone,
            address,
            totalPriceCents,
            orderDate,
          }) => {
            const combinedinvoiceProducts = transformInvoiceProducts(
              invoiceProducts,
              products,
            );

            return (
              <div key={invoiceId} className="relative border">
                <div
                  className={`absolute left-0 top-0 z-[1] ml-auto px-2 text-center text-[10px] uppercase text-white ${status === "waiting" ? "bg-blue-500" : status === "processing" ? "bg-yellow-500" : status === "completed" ? "bg-green-500" : "bg-red-500"}`}
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
                    {combinedinvoiceProducts!.map(
                      (
                        {
                          _id: productId,
                          name,
                          images,
                          description,
                          slug,
                          quantity,
                          size,
                          discountedPriceDetails,
                        },
                        index,
                      ) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-center justify-between gap-4 border p-2 sm:flex-nowrap"
                        >
                          <Link href={`/products/${slug}`}>
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
                                    Price: ${discountedPriceDetails[0]}
                                  </span>
                                  <span className="mx-2">|</span>
                                  <span>
                                    Total: ${discountedPriceDetails[1]}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </Link>

                          {status !== "processing" && status !== "waiting" && (
                            <Button
                              className="ml-auto flex items-center gap-2 text-green-600 before:border-green-600 before:bg-white"
                              onClick={() =>
                                handleBuyAgain(invoiceId, productId, size)
                              }
                              disabled={
                                loadingStates[
                                  `${invoiceId}-${productId}-${size}`
                                ] || isLoadingGlobal
                              }
                            >
                              {loadingStates[
                                `${invoiceId}-${productId}-${size}`
                              ] ? (
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
                            orderDate,
                          });
                          setState("isDeliveryInfoOpen", true);
                        }}
                      >
                        <MdOutlinePlace />
                        <span className="hidden sm:inline sm:truncate">
                          Delivery Information
                        </span>
                      </Button>
                      {(status === "processing" || status === "waiting") && (
                        <Button
                          className={`${status === "processing" ? "text-green-500 before:border-green-500" : "text-red-500 before:border-red-500"} flex items-center gap-2 before:bg-white`}
                          onClick={() =>
                            handleCancelReceive(
                              invoiceId,
                              invoiceProducts,
                              status,
                            )
                          }
                          disabled={loadingStates[invoiceId] || isLoadingGlobal}
                        >
                          {loadingStates[invoiceId] ? (
                            <div
                              className={`mx-auto h-4 w-4 animate-spin rounded-full border-4 ${status === "processing" ? "border-green-300 border-t-green-600" : "border-red-300 border-t-red-600"}`}
                            />
                          ) : (
                            <>
                              {status === "processing" ? (
                                <MdCheck />
                              ) : (
                                <MdOutlineCancel />
                              )}
                              <span className="hidden sm:inline sm:truncate">
                                {status === "processing"
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
            );
          },
        )}
      </div>
    </>
  );
}
