import Link from "next/link";

const categories = [
  {
    src: "/men.png",
    alt: "men",
    describe:
      "Discover a collection of stylish, dynamic, and versatile fashion pieces for men, perfect for any occasion.",
    href: "/category/men",
  },
  {
    src: "/women.png",
    alt: "women",
    describe:
      "Express your personality and unique style with elegant and modern designs crafted for women.",
    href: "/category/women",
  },
  {
    src: "/kids.png",
    alt: "kids",
    describe:
      "Explore adorable, comfortable, and safe collections for kids, perfect for everyday activities.",
    href: "/category/kids",
  },
] as const;

export default function Home() {
  return (
    <main className="relative z-10 mt-8 flex flex-col items-center gap-7 bg-white px-8 md:px-20">
      {categories.map(({ src, alt, describe, href }, index) => (
        <section
          key={index}
          className={`flex w-full flex-col rounded border border-black/5 bg-stone-100 py-4 md:flex-row ${index % 2 !== 0 && "md:flex-row-reverse"}`}
        >
          <div className="flex max-h-[25rem] justify-center px-3 md:w-[50%]">
            <img
              className="max-h-full max-w-full object-contain"
              src={src}
              alt={alt}
              loading="lazy"
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
