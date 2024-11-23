import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link className="h-7 w-7 md:h-8 md:w-8" href="/">
      <Image className="h-full w-full" src="/logo.png" alt="logo" />
    </Link>
  );
}
