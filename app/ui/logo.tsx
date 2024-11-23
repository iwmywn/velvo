import Link from "next/link";

export default function Logo() {
  return (
    <Link className="h-7 w-7 md:h-8 md:w-8" href="/">
      <img className="h-full w-full" src="/logo.png" alt="logo" />
    </Link>
  );
}
