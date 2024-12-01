import Link from "next/link";
import { categories } from "@lib/placeholder-data";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-7">
      {categories.map(({ id, name, description }, index) => (
        <section
          key={id}
          className={`flex w-full flex-col rounded border border-black/5 bg-stone-100 py-4 md:flex-row ${index % 2 !== 0 && "md:flex-row-reverse"}`}
        >
          <div
            className="flex justify-center px-12 md:w-[50%] md:px-6"
            style={{ height: "18.75rem", position: "relative" }}
          >
            <Image
              src={`/${name}.png`}
              alt={name}
              fill
              loading="eager"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 px-4 text-center md:w-[50%]">
            <span>{description}</span>
            {/* todo: text should not be scale */}
            <Link
              href={`/category/${name}`}
              className="rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
            >
              EXPLORE THE SELECTION
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
