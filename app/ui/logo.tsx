import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link className="relative h-7 w-7 md:h-8 md:w-8 lg:mx-3" href="/">
      <Image
        src="/logo.png"
        alt="logo"
        fill
        loading="eager"
        style={{ objectFit: "contain" }}
        sizes="(min-width: 768px) 32px, 28px"
      />
    </Link>
  );
}
