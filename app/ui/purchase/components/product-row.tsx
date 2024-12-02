import { Product } from "@/lib/definition";
import { formatCurrency, getPriceAfterDiscount } from "@/lib/utils";
import Button from "@/ui/button";
import ImageTag from "@/ui/image";
import Link from "next/link";
import { MdDelete } from "react-icons/md";

const QuantityControl = ({ quantity }: { quantity: number }) => (
  <div className="flex w-full max-w-[100px] items-center border">
    <button className="flex-1 border-r py-1 transition-all duration-300 hover:bg-stone-100">
      -
    </button>
    <span className="flex-1 select-none py-1 text-center">{quantity}</span>
    <button className="flex-1 border-l py-1 transition-all duration-300 hover:bg-stone-100">
      +
    </button>
  </div>
);

const ActionButton = () => (
  <Button
    className="flex items-center justify-center gap-2 px-4 sm:max-w-[100px] sm:flex-1 sm:px-0"
    type="submit"
  >
    <MdDelete />
    <span className="hidden sm:inline">Delete</span>
  </Button>
);

export default function ProductRow({
  name,
  priceCents,
  images,
  description,
  saleOff,
  slug,
  quantity,
}: Product & { quantity: number }) {
  const priceAfterDiscount = getPriceAfterDiscount(priceCents, saleOff);
  const formattedPrice = `$${formatCurrency(priceAfterDiscount)}`;
  const formattedTotal = `$${formatCurrency(priceAfterDiscount * quantity)}`;

  return (
    <div className="flex flex-col gap-4 rounded-md border p-2 text-sm sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] sm:gap-2 sm:p-0">
      <Link href={`/product/${slug}`}>
        <div className="flex items-center gap-2 border sm:flex-col sm:justify-center sm:gap-1 sm:border-0 sm:py-1 sm:text-center">
          <ImageTag src={images[0]} alt={description} />
          <span className="line-clamp-2 font-medium">{name}</span>
        </div>
      </Link>

      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex justify-between">
          <span>Price:</span>
          <span>{formattedPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>
          <span>{formattedTotal}</span>
        </div>
      </div>

      <div className="hidden items-center justify-center opacity-65 sm:flex">
        {formattedPrice}
      </div>

      <div className="flex items-center justify-between sm:justify-center">
        <QuantityControl quantity={quantity} />
        <div className="block sm:hidden">
          <ActionButton />
        </div>
      </div>

      <div className="hidden items-center justify-center opacity-65 sm:flex">
        {formattedTotal}
      </div>

      <div className="hidden items-center justify-end sm:flex sm:justify-center">
        <ActionButton />
      </div>
    </div>
  );
}
