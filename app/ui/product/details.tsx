"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@lib/utils";
import Button from "@ui/button";
import { Product } from "@lib/definition";
import ImageTag from "@ui/image";
import { useAuthContext } from "@ui/hooks/auth";
import { addToCart } from "@lib/actions";
import { toast } from "react-toastify";
import { useCartContext } from "@ui/hooks/cart";
import { useRouter } from "next/navigation";
import { HiPlusSmall, HiMinusSmall } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";

export default function ProductDetails({ product }: { product: Product }) {
  const {
    id: productId,
    name,
    priceCents,
    images,
    description,
    saleOff,
    sizes,
  } = product;
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { userId } = useAuthContext();
  const { refreshCart } = useCartContext();
  const router = useRouter();
  const descriptionRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const remainingQuantity = sizes[selectedSize as keyof typeof sizes];

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const message = await addToCart(
        productId,
        userId,
        selectedSize!,
        quantity,
      );

      if (message === "Done.") {
        await refreshCart();
        router.push("/cart-overlay", { scroll: false });
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Add to cart Error: ", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setSelectedImage(img);
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="mt-10 grid grid-cols-5 gap-x-5 gap-y-5 pb-5 lg:grid-cols-12 lg:gap-6">
      <div className="col-span-5 grid grid-cols-[1fr_1fr_1fr] gap-4 sm:col-span-1 sm:flex sm:flex-col lg:col-span-2 min-[1400px]:col-span-1">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(img, index)}
            className={`flex cursor-pointer items-center justify-center rounded-lg border hover:bg-slate-100 ${
              selectedImage === img
                ? "border-black bg-slate-50"
                : "border-slate-200"
            }`}
          >
            <ImageTag src={img} alt={description} />
          </div>
        ))}
      </div>

      <div className="relative col-span-5 sm:col-span-4 lg:col-span-6 min-[1400px]:col-span-7">
        {saleOff > 0 && (
          <div className="absolute left-0 top-0 z-[1] rounded-tl-lg bg-red-600 px-5 py-2 text-sm font-bold text-white">
            {saleOff}% OFF
          </div>
        )}
        <Swiper
          slidesPerView={1}
          onSlideChange={(swiper) =>
            setSelectedImage(images[swiper.activeIndex])
          }
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={images.indexOf(selectedImage)}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-[18.75rem] items-center justify-center rounded-lg p-5">
                <Image
                  src={img}
                  alt={name}
                  width={300}
                  height={300}
                  sizes="(min-width: 640px) 100vw, (min-width: 1024px) 80vw, 300px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="col-span-5 space-y-6 lg:col-span-4">
        <h1 className="text-2xl font-extrabold text-gray-900">{name}</h1>
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
          <div className="flex items-center gap-4">
            {["S", "M", "L", "XL"].map((size) => (
              <label
                key={size}
                className={`flex items-center gap-x-2 rounded border px-4 py-2 text-sm hover:bg-slate-100 ${selectedSize === size ? "border-black bg-slate-50" : "border-slate-200"} cursor-pointer`}
              >
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(size)}
                  className="hidden"
                />
                <span className="select-none">{size}</span>
              </label>
            ))}
            {selectedSize !== null && (
              <span
                className={`text-sm font-medium ${remainingQuantity > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {remainingQuantity > 0
                  ? `In stock: ${remainingQuantity}`
                  : "Out of stock"}
              </span>
            )}
          </div>
        </div>
        {selectedSize && (
          <div className="flex max-w-max items-center border text-sm">
            <button
              className={`flex items-center justify-center border-r px-3 py-2 transition-all duration-300 ${quantity > 1 ? "hover:bg-slate-100" : "opacity-50"}`}
              onClick={() => setQuantity((prev) => prev - 1)}
              disabled={quantity === 1}
            >
              <HiMinusSmall />
            </button>
            <span className="select-none px-5 text-center">{quantity}</span>
            <button
              className={`flex items-center justify-center border-l px-3 py-2 transition-all duration-300 ${quantity < remainingQuantity ? "hover:bg-slate-100" : "opacity-50"}`}
              onClick={() => setQuantity((prev) => prev + 1)}
              disabled={quantity === remainingQuantity}
            >
              <HiPlusSmall />
            </button>
          </div>
        )}
        <Button
          className="relative flex h-10 w-full items-center justify-center"
          disabled={
            userId === undefined ||
            selectedSize === null ||
            (selectedSize !== null &&
              sizes[selectedSize as keyof typeof sizes] <= 0)
          }
          onClick={handleAddToCart}
        >
          {isLoading ? (
            <div className="absolute mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          ) : userId === undefined ? (
            "PLEASE SIGN IN TO BUY"
          ) : selectedSize === null ? (
            "PLEASE SELECT SIZE"
          ) : selectedSize !== null &&
            sizes[selectedSize as keyof typeof sizes] > 0 ? (
            "ADD TO CART"
          ) : (
            "SOLD OUT"
          )}
        </Button>
        <div className="space-y-2 text-xs">
          <div
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex h-full cursor-pointer items-center justify-between border-y py-3 font-medium"
          >
            <span>DESCRIPTION</span>
            {isExpanded ? <HiMinusSmall /> : <HiPlusSmall />}
          </div>
          <div
            ref={descriptionRef}
            className={`transition-max-height overflow-hidden duration-500 ease-in-out ${isExpanded ? "max-h-max" : "max-h-0"}`}
            style={{
              maxHeight: isExpanded
                ? descriptionRef.current?.scrollHeight + "px"
                : "0px",
            }}
          >
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
