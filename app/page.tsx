import Link from "next/link";
import categories from "./data/categories";
// import Image from "next/image";

export default function Home() {
  return (
    <main
      className={`relative z-10 flex flex-col items-center gap-7 bg-white px-8 pt-8 md:px-20`}
    >
      {categories.map(({ src, alt, describe, href }, index) => (
        <section
          key={index}
          className={`flex w-full flex-col rounded border border-black/5 bg-stone-100 py-4 md:flex-row ${index % 2 !== 0 && "md:flex-row-reverse"}`}
        >
          <div className="flex max-h-[25rem] justify-center px-12 md:w-[50%] md:px-6">
            <img
              className="max-h-full max-w-full object-contain"
              src={src}
              alt={alt}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 px-4 text-center md:w-[50%]">
            <span>{describe}</span>
            {/* todo: text should not be scale */}
            <Link
              href={href}
              className="rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
            >
              EXPLORE THE SELECTION
            </Link>
          </div>
        </section>
      ))}
    </main>
  );
}
