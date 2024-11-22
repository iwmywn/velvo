import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <img className="h-8 w-8" src="/logo.png" />
    </Link>
  );
}
