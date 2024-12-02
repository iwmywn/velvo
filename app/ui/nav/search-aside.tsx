import { CiSearch } from "react-icons/ci";
import Link from "next/link";

export default function SearchSummary() {
  return (
    <Link
      className="relative cursor-pointer"
      href="/search-overlay"
      scroll={false}
    >
      <CiSearch className="text-[22px] md:text-2xl" />
    </Link>
  );
}
