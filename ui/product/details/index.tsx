"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { formatCurrency, getPriceAfterDiscount } from "@lib/utils";
import Button from "@ui/button";
import { Product } from "@lib/definitions";
import ImageTag from "@ui/image";
import {
  useAuthContext,
  useHeightContext,
  useUIStateContext,
} from "@ui/contexts";
import { addToCart } from "@lib/actions";
import showToast from "@ui/toast";
import { HiPlusSmall, HiMinusSmall } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import ExpandableSections from "@ui/expandable";
import { mutate } from "swr";
import ProductFloat from "@ui/product/details/float";

export default function ProductDetails({ product }: { product: Product }) {
  const {
    _id: productId,
    name,
    priceCents,
    images,
    description,
    saleOff,
    colors,
    keyFeatures,
  } = product;
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { userId } = useAuthContext();
  const { heights } = useHeightContext();
  const remainingQuantity =
    selectedColor && selectedSize
      ? colors[selectedColor]?.sizes[selectedSize] || 0
      : 0;
  const formattedPrice = `$${formatCurrency(priceCents)}`;
  const priceAfterDiscount = `$${getPriceAfterDiscount(priceCents, saleOff)}`;
  const swiperRef = useRef<SwiperCore | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { setState } = useUIStateContext();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const message = await addToCart(productId, selectedSize!, quantity);

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
      setIsLoading(false);
    }
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setSelectedImage(img);
    swiperRef.current?.slideTo(index);
  };

  return (
    <>
      <ProductFloat
        name={name}
        priceAfterDiscount={priceAfterDiscount}
        src={images[0]}
        alt={description}
        heights={heights}
        buttonRef={buttonRef}
      />
      <div className="my-10 grid grid-cols-5 gap-x-5 gap-y-5 lg:grid-cols-12 lg:gap-6">
        <div className="col-span-5 grid grid-cols-[1fr_1fr_1fr] gap-4 sm:col-span-1 sm:flex sm:flex-col lg:col-span-2 min-[1400px]:col-span-1">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(img, index)}
              className={`flex cursor-pointer items-center justify-center rounded border hover:bg-slate-100 ${
                selectedImage === img
                  ? "border-black bg-slate-50"
                  : "border-slate-200"
              }`}
            >
              <ImageTag src={img} alt={description} loading="eager" />
            </div>
          ))}
        </div>

        <div className="relative col-span-5 sm:col-span-4 lg:col-span-6 min-[1400px]:col-span-7">
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
                <div className="flex h-[18.75rem] items-center justify-center p-5">
                  <Image
                    src={img}
                    alt={name}
                    width={300}
                    height={300}
                    loading="eager"
                    sizes="(min-width: 640px) 100vw, (min-width: 1024px) 80vw, 300px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="col-span-5 space-y-6 lg:col-span-4">
          <h1 className="text-2xl font-extrabold text-gray-900">{name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-lg font-bold text-gray-900">
            {saleOff > 0 ? (
              <>
                <span className="text-red-500">{priceAfterDiscount}</span>
                <span className="text-gray-500 line-through">
                  {formattedPrice}
                </span>
                <span className="bg-black px-3 py-1 text-xs font-semibold text-white">
                  {saleOff}% OFF
                </span>
              </>
            ) : (
              <span>{formattedPrice}</span>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Color</p>
            <div className="flex flex-wrap items-center gap-4">
              {Object.keys(colors).map((color) => (
                <label
                  key={color}
                  className={`relative flex h-9 items-center justify-center gap-x-2 overflow-hidden rounded border p-2 text-sm hover:bg-slate-100 ${selectedColor === color ? "border-black bg-slate-50" : "border-slate-200"} cursor-pointer`}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => {
                      setSelectedColor(color);
                      setSelectedSize(null);
                      setQuantity(0);
                    }}
                    className="hidden"
                  />
                  <span className="select-none">{color}</span>
                </label>
              ))}
            </div>

            <div className="h-1" />

            {selectedColor && (
              <>
                <p className="text-sm font-medium">Size</p>
                <div className="flex flex-wrap items-center gap-4">
                  {Object.keys(colors[selectedColor].sizes).map((size) => {
                    const quantity = colors[selectedColor].sizes[size];
                    return (
                      <label
                        translate="no"
                        key={size}
                        className={`relative flex h-9 w-12 items-center justify-center gap-x-2 overflow-hidden rounded border text-sm hover:bg-slate-100 ${selectedSize === size ? "border-black bg-slate-50" : "border-slate-200"} cursor-pointer`}
                      >
                        {quantity === 0 && (
                          <span
                            className={`absolute inset-0 before:absolute before:h-[1px] before:w-[150%] before:origin-top-left before:rotate-[36deg] ${selectedSize === size ? "before:bg-[linear-gradient(90deg,_black,_gray,_black)]" : "before:bg-gray-200"}`}
                          />
                        )}
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          className="hidden"
                        />
                        <span className="select-none">{size}</span>
                      </label>
                    );
                  })}
                  {selectedSize && (
                    <span
                      className={`text-sm font-medium ${colors[selectedColor].sizes[selectedSize] > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {colors[selectedColor].sizes[selectedSize] > 0
                        ? `In stock: ${colors[selectedColor].sizes[selectedSize]}`
                        : "Out of stock"}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {selectedSize && remainingQuantity > 0 && (
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
            ref={buttonRef}
            className="relative flex h-10 w-full items-center justify-center"
            disabled={
              userId === undefined ||
              selectedSize === null ||
              (selectedSize !== null && remainingQuantity <= 0) ||
              isLoading
            }
            onClick={handleAddToCart}
          >
            {isLoading ? (
              <div className="absolute mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            ) : userId === undefined ? (
              "PLEASE SIGN IN TO BUY"
            ) : selectedColor === null ? (
              "PLEASE SELECT COLOR"
            ) : selectedSize === null ? (
              "PLEASE SELECT SIZE"
            ) : selectedSize !== null && remainingQuantity > 0 ? (
              "ADD TO CART"
            ) : (
              "SOLD OUT"
            )}
          </Button>
          <ExpandableSections
            sections={[
              { label: "DESCRIPTION", body: description },
              {
                label: "KEY FEATURES",
                body: keyFeatures,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
