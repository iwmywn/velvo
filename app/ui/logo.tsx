import Link from "next/link";

export default function Logo() {
  return (
    <Link className="h-8 w-8" href="/">
      <img className="h-full w-full" src="/logo.png" alt="logo" />
    </Link>
  );
}
