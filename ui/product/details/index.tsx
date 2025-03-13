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
    availableColors,
  } = product;
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { userId } = useAuthContext();
  const { heights } = useHeightContext();
  const isObject = selectedColor && typeof colors[selectedColor] === "object";
  const isNumber = selectedColor && typeof colors[selectedColor] === "number";
  const remainingQuantity = selectedColor
    ? selectedSize && typeof colors[selectedColor] === "object"
      ? colors[selectedColor].sizes[selectedSize]
      : typeof colors[selectedColor] === "number"
        ? colors[selectedColor]
        : 0
    : 0;
  const isAvailable = selectedColor && availableColors.includes(selectedColor);
  const formattedPrice = `$${formatCurrency(priceCents)}`;
  const priceAfterDiscount = `$${getPriceAfterDiscount(priceCents, saleOff)}`;
  const swiperRef = useRef<SwiperCore | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { setState } = useUIStateContext();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const message = await addToCart(
        productId,
        selectedColor,
        selectedSize,
        quantity,
      );

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

  console.log(quantity);

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
        <div className="col-span-5 grid grid-cols-[1fr_1fr_1fr] gap-4 sm:col-span-1 sm:flex sm:flex-col lg:col-span-2 min-[87.5rem]:col-span-1">
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
              <ImageTag src={img} alt={name} loading="eager" />
            </div>
          ))}
        </div>

        <div className="relative col-span-5 sm:col-span-4 lg:col-span-6 min-[87.5rem]:col-span-7">
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
                <div className="flex items-center justify-center">
                  <Image
                    src={img}
                    alt={name}
                    width={340}
                    height={340}
                    loading="eager"
                    sizes="(min-width: 640px) 100vw, (min-width: 1024px) 80vw, 340px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="h-auto w-full sm:w-[340px]"
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
              {Object.keys(colors).map((color) => {
                const isAvai = availableColors.includes(color);

                return (
                  <label
                    key={color}
                    className={`relative flex items-center justify-center gap-x-2 overflow-hidden rounded border px-2.5 py-1.5 text-sm hover:bg-slate-100 ${selectedColor === color ? "border-black bg-slate-50" : "border-slate-200"} cursor-pointer`}
                  >
                    {!isAvai && (
                      <span
                        className={`absolute inset-0 before:absolute before:top-[50%] before:right-0 before:left-0 before:h-[1px] before:translate-y-[-50%] ${selectedColor === color ? "before:bg-black" : "before:bg-gray-200"}`}
                      />
                    )}

                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => {
                        setSelectedColor(color);
                        setSelectedSize(null);
                        setQuantity(1);
                      }}
                      className="hidden"
                    />
                    <span className="uppercase select-none">{color}</span>
                  </label>
                );
              })}
            </div>

            <div className="h-1" />

            {selectedColor && (
              <>
                {isAvailable ? (
                  <>
                    {isObject && <p className="text-sm font-medium">Size</p>}
                    <div className="flex flex-wrap items-center gap-4">
                      {typeof colors[selectedColor] === "object" &&
                        Object.keys(colors[selectedColor].sizes).map((size) => {
                          const qty =
                            typeof colors[selectedColor] === "object" &&
                            colors[selectedColor].sizes[size];

                          return (
                            <label
                              translate="no"
                              key={size}
                              className={`relative flex items-center justify-center gap-x-2 overflow-hidden rounded border px-2.5 py-1.5 text-sm whitespace-nowrap hover:bg-slate-100 ${selectedSize === size ? "border-black bg-slate-50" : "border-slate-200"} cursor-pointer`}
                            >
                              {qty === 0 && (
                                <span
                                  className={`absolute inset-0 before:absolute before:top-[50%] before:right-0 before:left-0 before:h-[1px] before:translate-y-[-50%] ${selectedSize === size ? "before:bg-black" : "before:bg-gray-200"}`}
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
                      {(selectedSize || isNumber) && (
                        <span
                          className={`text-sm font-medium ${
                            remainingQuantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {remainingQuantity > 0
                            ? `In stock: ${remainingQuantity}`
                            : "Out of stock"}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-medium text-red-600">
                    Out of stock
                  </p>
                )}
              </>
            )}
          </div>

          {(selectedSize || isNumber) && remainingQuantity > 0 && (
            <div className="flex max-w-max items-center border text-sm">
              <button
                className={`flex items-center justify-center border-r px-3 py-2 transition-all duration-300 ${quantity > 1 ? "hover:bg-slate-100" : "opacity-50"}`}
                onClick={() => setQuantity((prev) => prev - 1)}
                disabled={quantity === 1}
              >
                <HiMinusSmall />
              </button>
              <span className="px-5 text-center select-none">{quantity}</span>
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
              !userId ||
              !isAvailable ||
              (isObject && !selectedSize) ||
              ((isNumber || selectedSize) && remainingQuantity <= 0) ||
              isLoading
            }
            onClick={handleAddToCart}
          >
            {isLoading ? (
              <div className="absolute mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            ) : !userId ? (
              "PLEASE SIGN IN TO BUY"
            ) : !selectedColor ? (
              "PLEASE SELECT COLOR"
            ) : !isAvailable ? (
              "SOLD OUT"
            ) : isObject && !selectedSize ? (
              "PLEASE SELECT SIZE"
            ) : (isNumber || selectedSize) && remainingQuantity > 0 ? (
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
