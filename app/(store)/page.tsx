import Link from "next/link";
import { categories } from "@lib/placeholder-data";
import Image from "next/image";
import Button from "@/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-7">
      {categories.map(({ id, name, description }, index) => (
        <section
          key={id}
          className={`flex w-full flex-col rounded border border-black/5 bg-stone-100 py-4 md:flex-row ${index % 2 !== 0 && "md:flex-row-reverse"}`}
        >
          <div className="flex h-[18.75rem] justify-center px-12 md:w-[50%] md:px-6">
            <Image
              src={`/${name}.png`}
              alt={name}
              width={300}
              height={300}
              sizes="(max-width: 768px) 100vw, 300px"
              loading="eager"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 px-4 text-center md:w-[50%]">
            <span>{description}</span>
            <Link href={`/category/${name}`}>
              <Button className="h-10">EXPLORE THE SELECTION</Button>
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
