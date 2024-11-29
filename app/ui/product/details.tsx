"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import Button from "../button";

interface ProductDetailsProps {
  name: string;
  priceCents: number;
  saleOff: number;
  images: string[];
}

export default function ProductDetails({
  name,
  priceCents,
  saleOff,
  images,
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="mx-auto grid grid-cols-4 gap-x-5 gap-y-5 pb-5 lg:grid-cols-12 lg:gap-6">
      <div className="flex flex-col space-y-4">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`relative h-[100px] cursor-pointer overflow-hidden rounded-lg border p-2 ${
              selectedImage === img ? "border-black" : "border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>
      <div className="relative col-span-3 lg:col-span-7">
        {saleOff > 0 && (
          <div className="absolute left-0 top-0 z-[1] rounded-tl-lg bg-[#FEEEEA] px-3 py-2 text-xs font-bold text-[#EE4D2D]">
            {saleOff}% OFF
          </div>
        )}
        <div className="relative h-96 w-full rounded-lg bg-black/5">
          <Image
            src={selectedImage}
            alt={name}
            fill
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="col-span-4 space-y-6 lg:col-span-4">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aliquam
          exercitationem repellat cupiditate, facere eius excepturi obcaecati
          illo neque minima maiores nulla ipsam quia voluptatum dignissimos
          veniam?
        </p>
        <div className="text-lg font-bold text-gray-900">
          {saleOff > 0 ? (
            <>
              <span className="text-gray-500 line-through">
                ${formatCurrency(priceCents)}
              </span>{" "}
              <span className="text-red-500">
                ${formatCurrency(priceCents - (priceCents * saleOff) / 100)}
              </span>
            </>
          ) : (
            <span>${formatCurrency(priceCents)}</span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Size</p>
          <div className="flex gap-4">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <Button className="h-10 w-full">ADD TO CART</Button>
      </div>
    </div>
  );
}
