"use client";

import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { useStoreContext } from "@ui/contexts";
import { GrPrevious, GrNext } from "react-icons/gr";
import ProductCard from "@ui/product/card";
import Link from "next/link";
import { Collection } from "@lib/definitions";

export default function Home({ collections }: { collections: Collection[] }) {
  const { products, banners } = useStoreContext();
  const lastTenProducts = products.slice(-10);

  return (
    <>
      <div className="group relative overflow-hidden rounded">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".categories-prev",
            nextEl: ".categories-next",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          slidesPerView={1}
          loop
        >
          {banners.map(({ name, slug, image }) => (
            <SwiperSlide key={slug}>
              <Link href={`/products/${slug}`}>
                <div className="relative w-full" style={{ paddingTop: "38%" }}>
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="100vw"
                    loading="eager"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperNavButton direction="prev" className="categories-prev" />
        <SwiperNavButton direction="next" className="categories-next" />
      </div>

      <h2 className="mt-10 mb-4 text-center text-xl font-bold">
        LATEST PRODUCTS
      </h2>
      <div className="group relative">
        <Swiper
          className="custom-swiper"
          style={{ padding: "1rem 1rem 2rem" }}
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{
            prevEl: ".product-card-prev",
            nextEl: ".product-card-next",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={24}
          loop
          pagination={{ dynamicBullets: true, clickable: true }}
          breakpoints={{
            600: {
              slidesPerView: 2,
            },
            1000: {
              slidesPerView: 3,
            },
            1400: {
              slidesPerView: 4,
            },
            1900: {
              slidesPerView: 5,
            },
            2300: {
              slidesPerView: 6,
            },
            2700: {
              slidesPerView: 7,
            },
          }}
        >
          {lastTenProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperNavButton direction="prev" className="product-card-prev" />
        <SwiperNavButton direction="next" className="product-card-next" />
      </div>

      <h2 className="mt-10 mb-8 text-center text-xl font-bold">WARDROBE</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {collections.map(({ _id, name, slug, image }) => (
          <Link
            key={_id}
            href={`/collections/${slug}`}
            className="group relative block overflow-hidden rounded"
          >
            <div className="relative w-full" style={{ paddingTop: "80%" }}>
              <Image
                src={image}
                alt={`${name} collection preview`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-lg font-bold uppercase">{name}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function SwiperNavButton({
  direction,
  className,
}: {
  direction: "prev" | "next";
  className: string;
}) {
  return (
    <div
      className={`${className} ${direction === "prev" ? "left-1" : "right-1"} absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-black/20`}
    >
      {direction === "prev" ? <GrPrevious size={16} /> : <GrNext size={16} />}
    </div>
  );
}
