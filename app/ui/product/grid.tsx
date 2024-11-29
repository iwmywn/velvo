import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";

interface Props {
  id: number;
  name: string;
  priceCents: number;
  images: string[];
  saleOff: number;
}

export default function ProductGrid({
  id,
  name,
  priceCents,
  images,
  saleOff,
}: Props) {
  return (
    <Link
      key={id}
      className="relative overflow-hidden rounded-lg border bg-white"
      href={`/product/${id}`}
    >
      {saleOff > 0 && (
        <div className="absolute left-0 top-0 z-[1] rounded-tl-lg bg-[#FEEEEA] px-3 py-2 text-xs font-bold text-[#EE4D2D]">
          {saleOff}% OFF
        </div>
      )}
      <div className="relative h-60 w-full bg-black/5">
        <Image
          src={images[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex items-center justify-between gap-5 p-4 text-sm font-medium">
        <div className="truncate">{name}</div>
        <div className="text-gray-800">
          ${formatCurrency(priceCents - (priceCents * saleOff) / 100)}
        </div>
      </div>
    </Link>
  );
}
