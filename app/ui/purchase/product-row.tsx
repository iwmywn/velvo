"use client";

import { Product } from "@lib/definition";
import { getPriceAfterDiscount } from "@lib/utils";
import Button from "@ui/button";
import ImageTag from "@ui/image";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { useCartContext } from "@ui/hooks/cart";
import { useAuthContext } from "@ui/hooks/auth";
import { addToCart, removeFromCart, deleteFromCart } from "@lib/actions";
import { toast } from "react-toastify";
import { useState } from "react";

const ActionButton = ({
  handleDeleteFromCart,
}: {
  handleDeleteFromCart: () => void;
}) => (
  <Button
    className="flex items-center justify-center gap-2 px-4 text-red-500 before:border-red-500 before:bg-white sm:max-w-[100px] sm:flex-1 sm:px-0"
    onClick={handleDeleteFromCart}
  >
    <MdDelete />
    <span className="hidden sm:inline">Delete</span>
  </Button>
);

export default function ProductRow({
  id,
  name,
  priceCents,
  images,
  description,
  saleOff,
  slug,
  quantity,
  size,
}: Product & { quantity: number; size: string }) {
  const formattedPrice = `$${getPriceAfterDiscount(priceCents, saleOff)}`;
  const formattedTotal = `$${getPriceAfterDiscount(priceCents, saleOff, quantity)}`;
  const { userId } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { refreshCart } = useCartContext();

  const handleCartOperation = async (
    operation: () => Promise<string>,
    successMessages: string[],
  ) => {
    setIsLoading(true);
    try {
      const message = await operation();

      if (successMessages.includes(message)) {
        await refreshCart();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error handling cart operation:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    handleCartOperation(() => addToCart(id, userId, size), ["Done."]);
  };

  const handleRemoveFromCart = () => {
    handleCartOperation(
      () => removeFromCart(id, userId, size),
      ["Product removed from cart.", "Product quantity decreased."],
    );
  };

  const handleDeleteFromCart = () => {
    handleCartOperation(
      () => deleteFromCart(id, userId, size),
      ["Product removed from cart!"],
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-md border p-2 text-sm sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] sm:gap-2 sm:p-0">
      <Link href={`/product/${slug}`}>
        <div className="flex items-center gap-2 border sm:flex-col sm:justify-center sm:gap-1 sm:border-0 sm:py-1 sm:text-center">
          <ImageTag src={images[0]} alt={description} />
          <span className="line-clamp-2 font-medium">
            {name} - {size}
          </span>
        </div>
      </Link>

      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex justify-between">
          <span>Price:</span>
          <span className="opacity-65">{formattedPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>
          <span className="opacity-65">{isAdd(isLoading, formattedTotal)}</span>
        </div>
      </div>

      <div className="hidden items-center justify-center opacity-65 sm:flex">
        {formattedPrice}
      </div>

      <div className="flex items-center justify-between sm:justify-center">
        <div className="flex w-full max-w-[100px] items-center border">
          <button
            className="flex-1 border-r py-1 transition-all duration-300 hover:bg-stone-100"
            onClick={handleRemoveFromCart}
          >
            -
          </button>
          <span className="flex-1 select-none py-1 text-center">
            {quantity}
          </span>
          <button
            className="flex-1 border-l py-1 transition-all duration-300 hover:bg-stone-100"
            onClick={handleAddToCart}
          >
            +
          </button>
        </div>
        <div className="block sm:hidden">
          <ActionButton handleDeleteFromCart={handleDeleteFromCart} />
        </div>
      </div>

      <div className="hidden items-center justify-center opacity-65 sm:flex">
        {isAdd(isLoading, formattedTotal)}
      </div>

      <div className="hidden items-center justify-end sm:flex sm:justify-center">
        <ActionButton handleDeleteFromCart={handleDeleteFromCart} />
      </div>
    </div>
  );
}

function isAdd(isLoading: boolean, price: string) {
  return isLoading ? (
    <div className="mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
  ) : (
    price
  );
}
